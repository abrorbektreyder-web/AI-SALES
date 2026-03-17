import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { authenticateRequest, requireRole } from "@/lib/auth";

// ========== GET — Barcha AGENTlarni olish ==========
export async function GET(req: NextRequest) {
  // Auth tekshirish
  const auth = authenticateRequest(req);
  if (!auth.success) return auth.response;

  // Faqat ROP ko'rishi mumkin
  const roleCheck = requireRole(auth.payload, "ROP");
  if (roleCheck) return roleCheck;

  try {
    const agents = await prisma.user.findMany({
      where: { role: "AGENT" },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        averageScore: true,
        createdAt: true,
        _count: {
          select: { calls: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ agents });
  } catch (error: any) {
    console.error("Agentlarni olishda xato:", error);
    return NextResponse.json(
      { error: "Server xatosi" },
      { status: 500 }
    );
  }
}

// ========== POST — Yangi AGENT qo'shish ==========
const createAgentSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 belgi"),
  phone: z.string().min(9, "Telefon raqam noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 belgi"),
});

export async function POST(req: NextRequest) {
  // Auth tekshirish
  const auth = authenticateRequest(req);
  if (!auth.success) return auth.response;

  // Faqat ROP qo'shishi mumkin
  const roleCheck = requireRole(auth.payload, "ROP");
  if (roleCheck) return roleCheck;

  try {
    const body = await req.json();
    const data = createAgentSchema.parse(body);

    // Telefon raqam takrorlanmasligi
    const existing = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const agent = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: "AGENT",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Sotuvchi muvaffaqiyatli qo'shildi", agent },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Noto'g'ri ma'lumot", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Agent qo'shishda xato:", error);
    return NextResponse.json(
      { error: "Server xatosi", fullError: error.message || String(error) },
      { status: 500 }
    );
  }
}
