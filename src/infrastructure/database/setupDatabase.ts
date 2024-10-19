// src/infrastructure/database/setupDatabase.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setupDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed', error);
    // Tambahkan logika retry di sini jika diperlukan
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export { prisma };