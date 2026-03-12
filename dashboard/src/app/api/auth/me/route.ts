import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/auth/me — Joriy foydalanuvchi ma'lumotlarini olish (token orqali)
export async function GET(req: NextRequest) {
  try {
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
        { error: "Token yaroqsiz yoki muddati o'tgan" },
        { status: 401 }
      );
    }

    // Bazadan yangi ma'lumotlarni olish
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        averageScore: true,
        createdAt: true,
        _count: {
          select: { calls: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth/me xatosi:", error);
    return NextResponse.json(
      { error: "Server ichki xatosi" },
      { status: 500 }
    );
  }
}
