import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authenticateRequest } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// POST /api/agent/generate-qr — ROP tomonidan agent uchun bir martalik QR kod yaratish
export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (!auth.success || auth.payload.role !== 'ROP') {
    return NextResponse.json({ error: "Faqat ROP agent uchun QR yarata oladi" }, { status: 403 });
  }

  try {
    const { agentId } = await req.json();

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID talab qilinadi" }, { status: 400 });
    }

    // 1. Yangi token yaratish (Tasodifiy 32 belgili)
    const token = crypto.randomBytes(16).toString('hex');
    
    // 2. Tokenni bazaga saqlash (24 soat amal qiladi)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const accessToken = await prisma.accessToken.create({
      data: {
        token,
        userId: agentId,
        expiresAt,
      }
    });

    return NextResponse.json({ 
      token: accessToken.token,
      expiresAt: accessToken.expiresAt,
      message: "Bir martalik QR-kod muvaffaqiyatli yaratildi."
    });

  } catch (error: any) {
    console.error(`[QR Gen Error]`, error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
