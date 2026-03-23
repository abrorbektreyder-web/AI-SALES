import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { signToken } from "@/lib/auth";

const qrLoginSchema = z.object({
  token: z.string().min(10, "Kalit noto'g'ri"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = qrLoginSchema.parse(body);

    // 1. Bir martalik kodni qidirish
    const access = await prisma.accessToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!access) {
      return NextResponse.json({ error: "QR-kod haqiqiy emas" }, { status: 401 });
    }

    // 2. Ishlatilgan yoki yo'qligini tekshirish
    if (access.isUsed) {
      return NextResponse.json({ error: "Bu QR-kod allaqachon ishlatilgan. ROPdan yangisini so'rang." }, { status: 401 });
    }

    // 3. Vaqtini tekshirish
    if (new Date() > access.expiresAt) {
      return NextResponse.json({ error: "QR-kod vaqti o'tib ketgan (24 soatdan ko'p). Yangisini yarating." }, { status: 401 });
    }

    // 4. Kodni "Ishlatilgan" deb belgilash (Bazadan o'chirib yuborsak ham bo'ladi, lekin statusini o'zgartirish xavfsizroq)
    await prisma.accessToken.update({
      where: { id: access.id },
      data: { isUsed: true }
    });

    // 5. JWT token yaratish
    const jwtToken = signToken({
      userId: access.user.id,
      phone: access.user.phone,
      role: access.user.role,
      name: access.user.name,
    });

    return NextResponse.json({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      token: jwtToken,
      user: {
        id: access.user.id,
        name: access.user.name,
        phone: access.user.phone,
        role: access.user.role,
      },
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Noto'g'ri kalit" }, { status: 400 });
    }
    console.error(`[QR Login Error]`, error);
    return NextResponse.json({ error: "Server ichki xatosi" }, { status: 500 });
  }
}
