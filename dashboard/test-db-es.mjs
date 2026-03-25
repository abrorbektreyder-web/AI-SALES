import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const res = await prisma.callRecord.findFirst({ orderBy: { createdAt: 'desc' } });
console.log(res);
prisma.$disconnect();
