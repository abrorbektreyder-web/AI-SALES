
// Prisma 7 - yangi konfiguratsiya tizimi (prisma.config.js)
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import path from 'path';

// Faqat lokal ishlab chiqish muhitida .env dan yuklaymiz
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Vercel build vaqtida DATABASE_URL bo'sh bo'lganida ham Client yaratilishi uchun fallback URL
    url: process.env.DATABASE_URL || "postgresql://dummy@localhost:5432/db",
  },
});
