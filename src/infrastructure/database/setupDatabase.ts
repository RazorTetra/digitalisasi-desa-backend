// src/infrastructure/database/setupDatabase.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setupDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};