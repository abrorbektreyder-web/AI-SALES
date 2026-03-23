import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
  phone: z.string().min(9, "Telefon raqam noto'g'ri"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Xavfsizlik uchun foydalanuvchi topilmasa ham "Xabar yuborildi" deb qaytarish yaxshiroq
      return NextResponse.json({ message: "Agar raqam ro'yxatdan o'tgan bo'lsa, unga yangi parol yuborildi." });
    }

    if (!user.email) {
      return NextResponse.json({ error: "Foydalanuvchida elektron pochta biriktirilmagan. Iltimos, administratorga murojaat qiling." }, { status: 400 });
    }

    // 1. Yangi tasodifiy parol yaratish (8 belgili)
    const newPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 2. Bazadagi parolni yangilash
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // 3. Pochtaga yuborish (Simulatsiya/Mock)
    console.log(`[PASS_RESET] Yangi parol foydalanuvchiga yuborildi: ${user.email}`);
    console.log(`[PASS_RESET] Yangi parol: ${newPassword}`);
    
    // Kelajakda bu yerda Resend yoki Nodemailer orqali xat yuboriladi:
    /*
    await resend.emails.send({
      from: 'AI Sales Pilot <support@aisales.uz>',
      to: user.email,
      subject: 'Parolingiz tiklandi',
      text: `Sizning yangi parolingiz: ${newPassword}. Tizimga kirib uni darhol o'zgartirishingizni maslahat beramiz.`
    });
    */

    return NextResponse.json({ 
      message: "Yangi parol elektron pochtaga yuborildi. Iltimos, pochtangizni tekshiring.",
      // Hozircha sinov uchun parolni qaytarib turamiz (faqat dev/test uchun bo'lishi kerak)
      // temporaryPassword: newPassword 
    });

  } catch (error: any) {
    console.error(`[Forgot Password Error]`, error);
    return NextResponse.json({ error: "Server ichki xatosi" }, { status: 500 });
  }
}
