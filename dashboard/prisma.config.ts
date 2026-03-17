
import { defineConfig, env } from 'prisma/config'
import * as dotenv from 'dotenv'
import path from 'path'

// Faqat lokal muhitda .env yuklanadi
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Vercel build davrida DATABASE_URL bo'sh bo'lsa xato qilmasligi uchun fallback
    url: env('DATABASE_URL') || process.env.DATABASE_URL || "postgresql://dummy@localhost:5432/db",
  },
})
