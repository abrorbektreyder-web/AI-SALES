export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload/audio — Audio faylni yuklash
export async function POST(req: NextRequest) {
  try {
    // Token tekshirish
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Avtorizatsiya talab qilinadi" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Token yaroqsiz" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("audio") as File;
    const customerPhone = formData.get("customerPhone") as string;
    const durationSec = parseInt(formData.get("durationSec") as string) || 0;

    if (!file) {
      return NextResponse.json(
        { error: "Audio fayl yuborilmadi" },
        { status: 400 }
      );
    }

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Mijoz telefon raqami kiritilmadi" },
        { status: 400 }
      );
    }

    // Fayl hajmini tekshirish (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fayl hajmi 50MB dan oshmasligi kerak" },
        { status: 413 }
      );
    }

    // Vercel'da /tmp papkasi yozishga ruxsat berilgan yagona papka
    // (public/uploads Vercel serverless'da read-only bo'ladi)
    const uploadsDir = '/tmp/audio';
    await mkdir(uploadsDir, { recursive: true });

    // Fayl nomini yaratish (userId + vaqt)
    const ext = file.name.split(".").pop() || "m4a";
    const fileName = `${payload.userId}_${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    // Faylni /tmp ga yozish
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL: hozircha /tmp manzili (keyinchalik S3/Supabase Storage ga o'tkaziladi)
    const audioUrl = `/tmp/audio/${fileName}`;

    // Bazaga yozish
    const callRecord = await prisma.callRecord.create({
      data: {
        userId: payload.userId,
        customerPhone: customerPhone,
        durationSec: durationSec,
        audioUrl: audioUrl,
        status: "ANALYZING",
      },
    });

    // AI Engine (FastAPI) serveriga signal yuborish — fonda tahlil boshlash
    const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8001";
    try {
      fetch(`${AI_ENGINE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: callRecord.id,
          audioUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${audioUrl}`
        }),
      }).catch(err => console.error("AI Engine ga signal yuborishda xato:", err));
    } catch (e) {
      console.error("AI Engine ulanishda xato:", e);
    }

    return NextResponse.json(
      {
        message: "Audio muvaffaqiyatli yuklandi",
        callRecord: {
          id: callRecord.id,
          audioUrl: callRecord.audioUrl,
          status: callRecord.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Audio upload xatosi:", error);
    return NextResponse.json(
      { error: "Server ichki xatosi" },
      { status: 500 }
    );
  }
}
