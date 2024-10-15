// src/infrastructure/repositories/UserRepository.ts

import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findMany(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }
}