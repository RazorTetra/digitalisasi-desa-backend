// src/infrastructure/repositories/FormatSuratRepository.ts

import { PrismaClient, FormatSurat, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class FormatSuratRepository {
  async findMany(params: {
    orderBy?: Prisma.FormatSuratOrderByWithRelationInput;
  }): Promise<FormatSurat[]> {
    return prisma.formatSurat.findMany(params);
  }

  async findById(id: string): Promise<FormatSurat | null> {
    return prisma.formatSurat.findUnique({
      where: { id }
    });
  }

  async create(data: Prisma.FormatSuratCreateInput): Promise<FormatSurat> {
    return prisma.formatSurat.create({ data });
  }

  async delete(id: string): Promise<void> {
    await prisma.formatSurat.delete({
      where: { id }
    });
  }
}