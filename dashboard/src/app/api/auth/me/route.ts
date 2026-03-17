import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/auth/me — Joriy foydalanuvchi ma'lumotlarini olish (token orqali)
export async function GET(req: NextRequest) {
  // Auth middleware orqali tekshirish
  const auth = authenticateRequest(req);
  if (!auth.success) return auth.response;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.payload.userId },
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

