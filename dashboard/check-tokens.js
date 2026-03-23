const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTokens() {
  try {
    const tokens = await prisma.accessToken.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log("So'nggi yaratilgan QR tokenlar:");
    tokens.forEach(t => {
      console.log(`- Token: ${t.token}, User: ${t.user.name}, IsUsed: ${t.isUsed}, ExpiresAt: ${t.expiresAt}`);
    });
  } catch (err) {
    console.error("Xato:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkTokens();
