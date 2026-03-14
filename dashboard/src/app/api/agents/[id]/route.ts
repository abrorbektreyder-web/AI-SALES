import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

// ========== PATCH — Agentni tahrirlash (parol almashtirish) ==========
const updateAgentSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(9).optional(),
  password: z.string().min(6).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = updateAgentSchema.parse(body);

    // Agent mavjudligini tekshirish
    const agent = await prisma.user.findUnique({ where: { id } });
    if (!agent || agent.role !== "AGENT") {
      return NextResponse.json(
        { error: "Sotuvchi topilmadi" },
        { status: 404 }
      );
    }

    // Yangilash uchun data tayyorlash
    const updateData: Record<string, string> = {};
    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Sotuvchi ma'lumotlari yangilandi",
      agent: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Noto'g'ri ma'lumot", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Agent yangilashda xato:", error);
    return NextResponse.json(
      { error: "Server xatosi" },
      { status: 500 }
    );
  }
}

// ========== DELETE — Agentni o'chirish ==========
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const agent = await prisma.user.findUnique({ where: { id } });
    if (!agent || agent.role !== "AGENT") {
      return NextResponse.json(
        { error: "Sotuvchi topilmadi" },
        { status: 404 }
      );
    }

    // Agentning qo'ng'iroqlarini ham o'chirish (cascade)
    await prisma.callRecord.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      message: "Sotuvchi muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("Agent o'chirishda xato:", error);
    return NextResponse.json(
      { error: "Server xatosi" },
      { status: 500 }
    );
  }
}
