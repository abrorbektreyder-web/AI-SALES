import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log('Success:', users.length)
  } catch (e) {
    console.error('Failure:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
