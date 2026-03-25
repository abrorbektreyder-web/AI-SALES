export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/upload/audio — Audio faylni yuklash (Supabase Storage)
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

    // Fayl nomini yaratish (userId + vaqt)
    const ext = file.name.split(".").pop() || "m4a";
    const fileName = `${payload.userId}_${Date.now()}.${ext}`;
    const storagePath = `calls/${fileName}`;

    // Faylni Supabase Storage ga yuklash
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("audio-records")
      .upload(storagePath, buffer, {
        contentType: file.type || "audio/m4a",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage xatosi:", uploadError);
      return NextResponse.json(
        { error: "Audio faylni saqlashda xatolik: " + uploadError.message },
        { status: 500 }
      );
    }

    // Public URL olish
    const { data: urlData } = supabaseAdmin.storage
      .from("audio-records")
      .getPublicUrl(storagePath);

    const audioUrl = urlData.publicUrl;

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

    // AI Engine (FastAPI -> Next.js local analyze API ga o'tkazildi)
    // Tahlil Vercel Serverless ichida tez bajarilishi uchun qisqa kutamiz (await)
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const appUrl = `${proto}://${host}`;
    
    try {
      await fetch(`${appUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: callRecord.id,
          audioUrl: audioUrl,
        }),
      });
    } catch (e) {
      console.error("AI Tahlil xatosi:", e);
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
