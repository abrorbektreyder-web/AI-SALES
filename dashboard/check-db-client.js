const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst().then(u => {
  if (u) console.log("DB Client OK. User:", u.phone);
  else console.log("Empty DB");
}).catch(console.error).finally(() => prisma.$disconnect());
