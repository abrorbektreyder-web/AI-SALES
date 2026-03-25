import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const records = await prisma.callRecord.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  console.log(JSON.stringify(records, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
