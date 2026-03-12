import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

const createCallSchema = z.object({
  userId: z.string(),
  customerPhone: z.string().min(5),
  durationSec: z.number().int().positive(),
  audioUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createCallSchema.parse(body);

    const callRecord = await prisma.callRecord.create({
      data: {
        userId: data.userId,
        customerPhone: data.customerPhone,
        durationSec: data.durationSec,
        audioUrl: data.audioUrl,
        status: "ANALYZING", 
      },
    });

    // TODO: Bu yerda Python(FastAPI) dagi AI stansiyasiga `callRecord.id` va `audioUrl` jonatilib trigger qilinadi.
    // fetch("http://python-backend/analyze", { body: JSON.stringify({ callId: callRecord.id, audioUrl: callRecord.audioUrl }) })

    return NextResponse.json(callRecord, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Noto'g'ri ma'lumot jo'natildi", details: (error as z.ZodError).issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Server ichki xatosi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const calls = await prisma.callRecord.findMany({
      include: {
        user: true,
        analysis: true,
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(calls);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ma'lumotlarni o'qishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
