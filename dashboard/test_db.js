
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Testing user creation...");
  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        phone: "9982223344" + Math.floor(Math.random() * 100),
        email: "test@example.com",
        company: "Test Co",
        password: "hashed_password",
        role: "ROP"
      }
    });
    console.log("User created successfully:", user.id);
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
