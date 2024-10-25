// src/infrastructure/repositories/BeritaKategoriRepository.ts

import { PrismaClient, BeritaKategori, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class BeritaKategoriRepository {
  async findMany(): Promise<BeritaKategori[]> {
    return prisma.beritaKategori.findMany({
      orderBy: {
        nama: 'asc'
      }
    });
  }

  async findById(id: string): Promise<BeritaKategori | null> {
    return prisma.beritaKategori.findUnique({
      where: { id }
    });
  }

  async findBySlug(slug: string): Promise<BeritaKategori | null> {
    return prisma.beritaKategori.findUnique({
      where: { slug }
    });
  }

  async create(data: Prisma.BeritaKategoriCreateInput): Promise<BeritaKategori> {
    return prisma.beritaKategori.create({
      data
    });
  }

  async update(id: string, data: Prisma.BeritaKategoriUpdateInput): Promise<BeritaKategori> {
    return prisma.beritaKategori.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.beritaKategori.delete({
      where: { id }
    });
  }
}