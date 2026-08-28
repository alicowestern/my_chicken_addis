import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@mychickenaddis.com'
  const adminPassword = 'password123'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })
  
  if (existingAdmin) {
    console.log('Admin user already exists!')
    return
  }
  
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: adminEmail,
      password: hashSync(adminPassword, 10),
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  })
  
  console.log('Admin user created successfully!')
  console.log('Email:', adminEmail)
  console.log('Password:', adminPassword)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
