import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ai-sales-pilot-jwt-secret-2026-change-in-production';

function getUser(req: NextRequest) {
  const auth = req.headers.get('Authorization');
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as { id: string; role: string };
  } catch { return null; }
}

// GET /api/organization — Tashkilot sozlamalarini olish
export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user || user.role !== 'ROP') {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { organization: true }
  });

  return NextResponse.json({ organization: dbUser?.organization || null });
}

// POST /api/organization — Tashkilot yaratish yoki yangilash
export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user || user.role !== 'ROP') {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
  }

  const { zadarmApiKey, zadarmApiSecret, zadarmSipBase, name } = await req.json();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { organization: true }
  });

  let org;
  if (dbUser?.organizationId) {
    // Update existing
    org = await prisma.organization.update({
      where: { id: dbUser.organizationId },
      data: {
        name: name || dbUser.organization?.name || 'Mening Tashkilotim',
        zadarmApiKey,
        zadarmApiSecret,
        zadarmSipBase,
      }
    });
  } else {
    // Create new
    org = await prisma.organization.create({
      data: {
        name: name || 'Mening Tashkilotim',
        zadarmApiKey,
        zadarmApiSecret,
        zadarmSipBase,
        users: { connect: { id: user.id } }
      }
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { organizationId: org.id }
    });
  }

  return NextResponse.json({ success: true, organization: org });
}
