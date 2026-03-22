const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash("01031984", 10);
  await prisma.user.upsert({
    where: { phone: "+998952645664" },
    update: { password, role: "AGENT" },
    create: { name: "Agent Test", phone: "+998952645664", password, role: "AGENT" }
  });
  console.log("User seeded");
}
main().catch(console.error).finally(() => prisma.$disconnect());
