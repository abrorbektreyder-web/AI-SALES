import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signToken } from "@/lib/auth";

// Login uchun validatsiya sxemasi
const loginSchema = z.object({
  phone: z.string().min(9, "Telefon raqam noto'g'ri"),
  password: z.string().min(1, "Parol kiriting"),
});

// POST /api/auth/login — Tizimga kirish
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    // Foydalanuvchini telefon raqamdan izlash
    const user = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Telefon raqam yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    // Parolni tekshirish
    const passwordValid = await bcrypt.compare(data.password, user.password);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Telefon raqam yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    // JWT token yaratish
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Noto'g'ri ma'lumot", details: error.issues },
        { status: 400 }
      );
    }
    console.error(`[Login Critical Error] Full Error:`, error);
    return NextResponse.json(
      { 
        error: "Server ichki xatosi", 
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
}
