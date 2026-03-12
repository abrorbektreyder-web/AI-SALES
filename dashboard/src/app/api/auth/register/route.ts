import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signToken } from "@/lib/auth";

// Registratsiya uchun validatsiya sxemasi
const registerSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 belgi bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqam noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 belgi bo'lishi kerak"),
  role: z.enum(["ROP", "AGENT"]).default("AGENT"),
});

// POST /api/auth/register — Yangi foydalanuvchi ro'yxatdan o'tkazish
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    // Telefon raqam takrorlanmasligi tekshiriladi
    const existingUser = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" },
        { status: 409 }
      );
    }

    // Parolni hashlash
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Foydalanuvchini bazaga saqlash
    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: data.role as "ROP" | "AGENT",
      },
    });

    // JWT token yaratish
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json(
      {
        message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Noto'g'ri ma'lumot", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Register xatosi:", error);
    return NextResponse.json(
      { error: "Server ichki xatosi" },
      { status: 500 }
    );
  }
}
