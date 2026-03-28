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

// PATCH /api/agents/[id]/sip — Sotuvchiga SIP extension birikturish
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUser(req);
  if (!user || user.role !== 'ROP') {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 403 });
  }

  const { id } = await params;
  const { sipExtension } = await req.json();

  const updated = await prisma.user.update({
    where: { id },
    data: { sipExtension: sipExtension || null }
  });

  return NextResponse.json({ success: true, agent: { id: updated.id, sipExtension: updated.sipExtension } });
}
