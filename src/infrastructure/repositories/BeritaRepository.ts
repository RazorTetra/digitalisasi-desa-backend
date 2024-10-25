// src/infrastructure/repositories/BeritaRepository.ts

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class BeritaRepository {
  async findMany() {
    return prisma.berita.findMany({
      include: {
        kategori: {
          include: {
            kategori: true
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    });
  }

  async findById(id: string) {
    return prisma.berita.findUnique({
      where: { id },
      include: {
        kategori: {
          include: {
            kategori: true
          }
        }
      }
    });
  }

  async findBySlug(slug: string) {
    return prisma.berita.findUnique({
      where: { slug },
      include: {
        kategori: {
          include: {
            kategori: true
          }
        }
      }
    });
  }

  async findHighlighted() {
    return prisma.berita.findMany({
      where: {
        isHighlight: true
      },
      include: {
        kategori: {
          include: {
            kategori: true
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      }
    });
  }

  async create(data: Prisma.BeritaCreateInput) {
    return prisma.berita.create({
      data,
      include: {
        kategori: {
          include: {
            kategori: true
          }
        }
      }
    });
  }

  async update(id: string, data: Prisma.BeritaUpdateInput) {
    return prisma.berita.update({
      where: { id },
      data,
      include: {
        kategori: {
          include: {
            kategori: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    await prisma.berita.delete({
      where: { id }
    });
  }
}