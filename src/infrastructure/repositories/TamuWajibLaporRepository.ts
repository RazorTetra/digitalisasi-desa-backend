// src/infrastructure/repositories/TamuWajibLaporRepository.ts

import { PrismaClient, TamuWajibLapor, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TamuWajibLaporRepository {
  async findMany(): Promise<TamuWajibLapor[]> {
    return prisma.tamuWajibLapor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: string): Promise<TamuWajibLapor | null> {
    return prisma.tamuWajibLapor.findUnique({
      where: { id }
    });
  }

  async findByTrackingCode(trackingCode: string): Promise<TamuWajibLapor | null> {
    return prisma.tamuWajibLapor.findUnique({
      where: { trackingCode }
    });
  }

  async findRecent(limit: number): Promise<TamuWajibLapor[]> {
    return prisma.tamuWajibLapor.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async create(data: Prisma.TamuWajibLaporCreateInput): Promise<TamuWajibLapor> {
    return prisma.tamuWajibLapor.create({ data });
  }

  async update(id: string, data: Prisma.TamuWajibLaporUpdateInput): Promise<TamuWajibLapor> {
    return prisma.tamuWajibLapor.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.tamuWajibLapor.delete({
      where: { id }
    });
  }
}