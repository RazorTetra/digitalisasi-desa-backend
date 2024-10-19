// src/infrastructure/repositories/KategoriRepository.ts

import { PrismaClient, Kategori, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class KategoriRepository {
  async findMany(): Promise<Kategori[]> {
    return prisma.kategori.findMany();
  }

  async findById(id: string): Promise<Kategori | null> {
    return prisma.kategori.findUnique({
      where: { id }
    });
  }

  async findByNama(nama: string): Promise<Kategori | null> {
    return prisma.kategori.findUnique({
      where: { nama }
    });
  }

  async create(data: Prisma.KategoriCreateInput): Promise<Kategori> {
    return prisma.kategori.create({ data });
  }

  async update(id: string, data: Prisma.KategoriUpdateInput): Promise<Kategori> {
    return prisma.kategori.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.kategori.delete({
      where: { id }
    });
  }
}