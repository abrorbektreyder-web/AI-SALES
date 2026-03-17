import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Build vaqtida (DATABASE_URL bo'lmaganda) xato bermasligi uchun lazy singleton ishlatamiz
const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  // Agar URL bo'lmasa (masalan, Vercel Build paytida), plain client qaytaramiz
  if (!connectionString || connectionString.trim() === "" || connectionString === "undefined") {
    console.warn("[DB] DATABASE_URL topilmadi. Building time? Plain PrismaClient qaytarilmoqda.");
    return new PrismaClient();
  }

  try {
    const pool = new Pool({ 
      connectionString,
      max: 10, // Production uchun kengaytirilgan
      connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("[DB] Prisma initialization error:", err);
    return new PrismaClient(); // Fallback
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

// BU YERDA: faqat export qilamiz, lekin instance faqat birinchi so'rovda yaratiladi
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
