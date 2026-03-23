const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Test Agent',
        phone: '+998901234567',
        password: 'testpassword',
        role: 'AGENT',
      }
    });
    console.log('Success:', user);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
