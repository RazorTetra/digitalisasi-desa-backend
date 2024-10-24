// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { seedVillageHistory } from './seed/villageHistorySeed';
import { seedSocialMedia } from './seed/socialMediaSeed';
import { seedFinance } from './seed/financeSeed'; 

// import { seedPengumuman } from './seed/pengumumanSeed';

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      namaDepan: 'Admin',
      namaBelakang: 'User',
      nomorHp: '081234567890',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log({ admin })

  await seedVillageHistory();
  await seedSocialMedia();
  await seedFinance(); 
  // await seedPengumuman();
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
