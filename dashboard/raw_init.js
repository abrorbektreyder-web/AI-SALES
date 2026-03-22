const { Client } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const envLines = fs.readFileSync('.env', 'utf-8').split('\n');
let dbUrl = '';
for (const line of envLines) {
  if (line.trim().startsWith('DATABASE_URL=')) {
    dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    break;
  }
}

const client = new Client({ connectionString: dbUrl });

async function initDb() {
  await client.connect();
  console.log("Connected to DB via pg manually.");

  // Create ENUMs (or just use TEXT for simplicity if prisma allows it, but Prisma requires matching types)
  try {
    await client.query(`CREATE TYPE "Role" AS ENUM ('ROP', 'AGENT');`);
  } catch(e) {}
  try {
    await client.query(`CREATE TYPE "CallStatus" AS ENUM ('COMPLETED', 'ANALYZING', 'FAILED');`);
  } catch(e) {}

  await client.query(`
    CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "email" TEXT,
        "company" TEXT,
        "password" TEXT NOT NULL,
        "role" "Role" NOT NULL DEFAULT 'AGENT',
        "averageScore" DOUBLE PRECISION,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );
  `);
  
  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS "CallRecord" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "durationSec" INTEGER NOT NULL,
        "audioUrl" TEXT NOT NULL,
        "status" "CallStatus" NOT NULL DEFAULT 'COMPLETED',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "CallRecord_pkey" PRIMARY KEY ("id")
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS "Lesson" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS "AiAnalysis" (
        "id" TEXT NOT NULL,
        "callId" TEXT NOT NULL,
        "score" INTEGER NOT NULL,
        "summary" TEXT NOT NULL,
        "transcript" TEXT,
        "recommendedLessonId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
    );
  `);

  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "AiAnalysis_callId_key" ON "AiAnalysis"("callId");
  `);

  // Seed user
  const pwd = await bcrypt.hash("01031984", 10);
  await client.query(`
    INSERT INTO "User" ("id", "name", "phone", "password", "role", "createdAt", "updatedAt")
    VALUES ('uuid-test-user-1', 'Agent Test', '+998952645664', $1, 'AGENT', NOW(), NOW())
    ON CONFLICT ("phone") DO UPDATE SET "password" = $1, "updatedAt" = NOW();
  `, [pwd]);

  // Seed lesson
  await client.query(`
    INSERT INTO "Lesson" ("id", "title", "url", "type")
    VALUES ('lesson-1', 'Etirozni ishlash darsi', 'https://youtu.be/dQw4w9WgXcQ', 'VIDEO')
    ON CONFLICT ("id") DO NOTHING;
  `);

  // Seed call record 
  await client.query(`
    INSERT INTO "CallRecord" ("id", "userId", "customerPhone", "durationSec", "audioUrl", "status")
    VALUES ('call-1', 'uuid-test-user-1', '+998901112233', 120, 'http://example.com/audio.mp3', 'COMPLETED')
    ON CONFLICT ("id") DO NOTHING;
  `);

  // Seed ai analysis
  await client.query(`
    INSERT INTO "AiAnalysis" ("id", "callId", "score", "summary", "recommendedLessonId")
    VALUES ('analysis-1', 'call-1', 2, 'Etirozga yaxshi javob berilmadi', 'lesson-1')
    ON CONFLICT ("id") DO NOTHING;
  `);

  console.log("DB forcefully synced and seeded successfully!");
  process.exit(0);
}

initDb().catch(e => {
  console.error("DB init error:", e);
  process.exit(1);
});
