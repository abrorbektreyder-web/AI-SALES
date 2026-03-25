export const maxDuration = 60; // Allow maximum Vercel limit for analysis
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const ANALYSIS_PROMPT = `Sen professional sotuv tahlilchisi va coach (o'qituvchi) sifatida ish ko'rayapsan.

Quyida sotuvchi va mijoz o'rtasidagi telefon suhbati matni berilgan. Uni sinchiklab tahlil qil va quyidagilarni qil:

1. **BAL BER (1 dan 5 gacha):**
   - 5 BALL = A'lo suhbat. Skriptga 100% amal qilgan, e'tirozlarni professional ishlagan.
   - 4 BALL = Yaxshi, lekin kichik imkoniyatlar boy berilgan (cross-sell aytilmagan va h.k).
   - 3 BALL = O'rtacha. E'tirozlarga javob bera olmagan, sotuv ehtimoli past.
   - 2 BALL = Yomon. Mijoz asabiylashgan yoki sotuvchi tutilib qolgan.
   - 1 BALL = Kritik yomon. Qo'pollik, kompaniya obro'siga ziyon.

2. **XULOSA YOZ (3-4 gap bilan):**
   Nimada yaxshi ish qildi? Nimada xato qildi? Nima qilsa yaxshiroq bo'lardi?

3. **TAVSIYA (1-2 ta so'zdan iborat o'quv mavzusi):**
   Sotuvchining xatosini to'g'rilash uchun eng mos dars kalit so'zini yoz.
   Masalan: "Etirozni ishlash", "Ishonch", "Narx", "Skript", "Mahsulot", "Yopish"

Javobni FAQAT quyidagi formatda ber (boshqa e'tibor qarata oladigan hech narsa yozma):
BALL: [raqam]
XULOSA: [matn]
TAVSIYA: [matn]`;

export async function POST(req: NextRequest) {
  try {
    const { callId, audioUrl } = await req.json();

    if (!callId || !audioUrl) {
      return NextResponse.json({ error: "callId va audioUrl majburiy!" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY kiritilmagan");
      return NextResponse.json({ error: "AI kaliti topilmadi" }, { status: 500 });
    }

    // 1. Audio faylni yuklash
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) {
      throw new Error("Audio faylni yuklab bo'lmadi");
    }
    const audioBlob = await audioRes.blob();
    // Groq requires File object, map Blob to File
    const file = new File([audioBlob], "audio.m4a", { type: audioBlob.type || "audio/m4a" });

    // 2. Whisper STT (Speech-to-text) Groq orqali
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      language: "uz",
      response_format: "text",
    });

    const transcriptText = (transcription as any) as string;

    if (!transcriptText || transcriptText.trim().length < 10) {
      throw new Error("Suhbat matni o'ta qisqa yoki audio sifatli emas.");
    }

    // 3. LLM Tahlili Groq (Llama-3) orqali
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: ANALYSIS_PROMPT },
        { role: "user", content: `Suhbat matni:\n\n${transcriptText}` }
      ],
      temperature: 0.3,
      max_tokens: 600,
    });

    const resultText = chatCompletion.choices[0]?.message?.content || "";

    // 4. Natijani parse qilish
    let score = 3;
    let summary = "Tahlil natijasi topilmadi";
    let tag = "";

    const lines = resultText.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("BALL:")) {
        const parsed = parseInt(trimmed.replace("BALL:", "").trim(), 10);
        if (!isNaN(parsed)) score = Math.max(1, Math.min(5, parsed));
      } else if (trimmed.startsWith("XULOSA:")) {
        summary = trimmed.replace("XULOSA:", "").trim();
      } else if (trimmed.startsWith("TAVSIYA:")) {
        tag = trimmed.replace("TAVSIYA:", "").trim();
      }
    }

    // 5. Mos darsni bazadan qidirish
    let lessonId = null;
    if (tag) {
      const lesson = await prisma.lesson.findFirst({
        where: {
          OR: [
            { title: { contains: tag, mode: 'insensitive' } },
            { type: { contains: tag, mode: 'insensitive' } },
          ]
        }
      });
      if (lesson) lessonId = lesson.id;
    }

    // 6. Bazaga AiAnalysis va Status yozish
    await prisma.$transaction([
      prisma.aiAnalysis.upsert({
        where: { callId },
        update: { score, summary, transcript: transcriptText, recommendedLessonId: lessonId },
        create: { callId, score, summary, transcript: transcriptText, recommendedLessonId: lessonId }
      }),
      prisma.callRecord.update({
        where: { id: callId },
        data: { status: "COMPLETED" }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: { score, summary, transcriptText, lessonId }
    });

  } catch (error: any) {
    console.error("Analyze Error:", error);
    return NextResponse.json({ error: error.message || "Tahlil jarayonida xato yuz berdi" }, { status: 500 });
  }
}
