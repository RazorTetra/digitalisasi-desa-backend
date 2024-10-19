// src/infrastructure/repositories/PengumumanRepository.ts

import { PrismaClient, Pengumuman, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class PengumumanRepository {
  async findMany(): Promise<Pengumuman[]> {
    return prisma.pengumuman.findMany({
      orderBy: {
        tanggal: 'desc'
      }
    });
  }

  async findById(id: string): Promise<Pengumuman | null> {
    return prisma.pengumuman.findUnique({
      where: { id }
    });
  }

  async create(data: Prisma.PengumumanCreateInput): Promise<Pengumuman> {
    return prisma.pengumuman.create({ data });
  }

  async update(id: string, data: Prisma.PengumumanUpdateInput): Promise<Pengumuman> {
    return prisma.pengumuman.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.pengumuman.delete({
      where: { id }
    });
  }
}