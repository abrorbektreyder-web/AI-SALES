const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedLessons() {
  console.log('Seeding lessons...');
  await prisma.lesson.createMany({
    data: [
      {
        title: "E'tirozlarni yengish va agressiv mijoz bilan ishlash",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "E'tiroz",
      },
      {
        title: "Cross-sell: Qo'shimcha savdo sirlari",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "Cross-sell",
      },
      {
        title: "Sotuv qoidalari va ishonch",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "Ishonch",
      },
      {
        title: "Mijozni eshitish san'ati",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "Eshitish",
      }
    ]
  });
  console.log('Lessons seeded!');
}

seedLessons().catch(e => console.error(e)).finally(() => prisma.$disconnect());
