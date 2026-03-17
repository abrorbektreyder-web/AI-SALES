import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// JWT_SECRET endi faqat .env dan olinadi — hardcode qilinmaydi
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET muhit o'zgaruvchisi sozlanmagan! .env faylga qo'shing.");
}

// Development uchun fallback (faqat dev muhitda)
const getSecret = () => {
  if (JWT_SECRET) return JWT_SECRET;
  if (process.env.NODE_ENV !== "production") {
    return "dev-only-secret-key-do-not-use-in-prod";
  }
  throw new Error("JWT_SECRET muhit o'zgaruvchisi sozlanmagan!");
};

export interface JwtPayload {
  userId: string;
  phone: string;
  role: string;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Auth Middleware — himoyalangan API route'lar uchun token tekshirish.
 * Agar token yaroqsiz bo'lsa, 401 qaytaradi.
 * Agar yaroqli bo'lsa, JwtPayload qaytaradi.
 */
export function authenticateRequest(
  req: NextRequest
): { success: true; payload: JwtPayload } | { success: false; response: NextResponse } {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Avtorizatsiya talab qilinadi. Bearer token yuboring." },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Token yaroqsiz yoki muddati o'tgan" },
        { status: 401 }
      ),
    };
  }

  return { success: true, payload };
}

/**
 * Faqat ROP rolidagi foydalanuvchilarni o'tkazish.
 */
export function requireRole(
  payload: JwtPayload,
  requiredRole: "ROP" | "AGENT"
): NextResponse | null {
  if (payload.role !== requiredRole) {
    return NextResponse.json(
      { error: `Bu amal faqat ${requiredRole} roli uchun ruxsat etilgan` },
      { status: 403 }
    );
  }
  return null;
}
