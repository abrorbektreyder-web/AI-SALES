import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  
  // Vercel build paytida yoki bo'sh URL da xato bermasligi uchun
  if (!connectionString || connectionString === "undefined" || connectionString.trim() === "") {
    console.warn("[DB] DATABASE_URL topilmadi, bo'sh client yaratilmoqda (bu build paytida normal bo'lishi mumkin).");
    return new PrismaClient();
  }

  const pool = new Pool({ 
    connectionString,
    max: 1, 
    connectionTimeoutMillis: 5000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
