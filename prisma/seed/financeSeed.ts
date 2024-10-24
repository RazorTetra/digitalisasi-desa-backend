// src/prisma/seed/financeSeed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedFinance() {
  await prisma.financeBanner.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      imageUrl: null,
    },
  });

  await prisma.financeInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      content: 'Informasi keuangan desa akan ditampilkan di sini',
    },
  });
}
