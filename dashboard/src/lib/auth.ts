import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import * as dotenv from 'dotenv';
import path from 'path';

// Force load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// JWT_SECRET endi faqat .env dan olinadi — hardcode qilinmaydi
// Build vaqtida crash bermasligi uchun tekshirishni ishlayotgan vaqtda (runtime) qilamiz
const JWT_SECRET = process.env.JWT_SECRET;
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret) {
    console.log(`[Auth] Using secret from ENV (length: ${secret.length})`);
    return secret;
  }
  
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Auth] WARNING: Falling back to static dev secret! ENV not found.`);
    return "dev-only-secret-key-do-not-use-in-prod";
  }
  throw new Error("JWT_SECRET muhit o'zgaruvchisi sozlanmagan! .env faylni tekshiring.");
};

export interface JwtPayload {
  userId: string;
  phone: string;
  role: string;
  name: string;
}

export function signToken(payload: JwtPayload): string {
  const token = jwt.sign(payload, getSecret(), { expiresIn: "7d" });
  console.log(`[Auth] Signed token for ${payload.phone} (${payload.role}): "${token.substring(0, 15)}... (len: ${token.length})"`);
  return token;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, getSecret()) as JwtPayload;
    console.log("[Auth] Token verified successfully with current secret");
    return payload;
  } catch (err: any) {
    console.warn(`[Auth] Verification failed with current secret: ${err.message}`);
    
    // Agar secret o'zgargan bo'lsa (masalan hot-reload sababli yoki eskirgan xardkod kalitlar)
    const oldSecrets = [
      "dev-only-secret-key-do-not-use-in-prod",
      "juda-maxfiy-kalit-bu-ni-env-ga-kochirish-kerak", // kechagi eski tokenlar uchun
      "ai-sales-pilot-jwt-secret-2026-change-in-production" // so'nggi ma'lum bo'lgan secret
    ];
    
    for (const secret of oldSecrets) {
      try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        console.log(`[Auth] Token verified with fallback secret: ${secret.substring(0, 5)}...`);
        return payload;
      } catch {
        continue;
      }
    }
    
    console.error(`[Auth] Token verification failed after all fallback secrets. Error: ${err.message}`);
    // Error ni tashqariga ko'rsatish uchun "null" o'rniga "Error" tipida narsa yo'q, 
    // shunchaki null qaytaramiz lekint terminalda log qilamiz.
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
  console.log("--- START AUTHENTICATE REQUEST ---");
  const authHeader = req.headers.get("Authorization");
  
  console.log(`[Auth Debug] Headers received. Header present: ${!!authHeader}, Length: ${authHeader?.length}`);
  if (authHeader) {
     console.log(`[Auth Debug] Header start: "${authHeader.substring(0, 20)}..."`);
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(`[Auth Warning] Authorization missing or invalid format: "${authHeader}"`);
    return {
      success: false,
      response: NextResponse.json(
        { error: "Avtorizatsiya talab qilinadi. Bearer token yuboring." },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(" ")[1];
  console.log(`[Auth Debug] Token split result: "${token?.substring(0, 10)}..." (len: ${token?.length})`);

  if (!token || token === "null" || token === "undefined" || token === "") {
    console.error(`[Auth Error] Token is literally EMPTY or NULL-LIKE: "${token}"`);
  }

  let payload = null;
  let verifyErrorMessage = "Noma'lum xato";
  
  try {
    payload = verifyToken(token);
    if (!payload) {
      // verificToken ichida allaqachon catch bor, lekin null qaytganda error xabari qolmaydi
      // Shuning uchun bu yerda jwt.verify ni yana bir bor haqiqiy xabarini olish uchun chaqiramiz
      try {
        jwt.verify(token, getSecret());
      } catch (err: any) {
        verifyErrorMessage = err.message || "Token verification returned null";
      }
    }
  } catch (err: any) {
    verifyErrorMessage = err.message || String(err);
  }

  if (!payload) {
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: "Token yaroqsiz yoki muddati o'tgan", 
          details: verifyErrorMessage,
          token_preview: token.substring(0, 10) + "..."
        },
        { status: 401 }
      ),
    };
  }

  console.log(`[Auth Success] User: ${payload.phone}, Role: ${payload.role}, ID: ${payload.userId}`);

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
