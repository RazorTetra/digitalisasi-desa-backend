// src/infrastructure/repositories/TourismRepository.ts

import { PrismaClient, Tourism, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TourismRepository {
  async findMany(): Promise<Tourism[]> {
    return prisma.tourism.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: string): Promise<Tourism | null> {
    return prisma.tourism.findUnique({
      where: { id }
    });
  }

  async create(data: Prisma.TourismCreateInput): Promise<Tourism> {
    return prisma.tourism.create({ data });
  }

  async update(id: string, data: Prisma.TourismUpdateInput): Promise<Tourism> {
    return prisma.tourism.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.tourism.delete({
      where: { id }
    });
  }
}