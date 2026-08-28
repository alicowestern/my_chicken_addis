import { prisma } from './src/lib/database/prisma'
import { hashSync } from 'bcryptjs'

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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
