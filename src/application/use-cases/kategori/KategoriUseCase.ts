// src/application/use-cases/kategori/KategoriUseCase.ts

import { KategoriRepository } from '../../../infrastructure/repositories/KategoriRepository';
import { Kategori, Prisma } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';

export class KategoriUseCase {
  constructor(private kategoriRepository: KategoriRepository) {}

  async getKategori(): Promise<Kategori[]> {
    return this.kategoriRepository.findMany();
  }

  async getKategoriById(id: string): Promise<Kategori> {
    const kategori = await this.kategoriRepository.findById(id);
    if (!kategori) {
      throw new NotFoundError('Kategori not found');
    }
    return kategori;
  }

  async createKategori(data: Prisma.KategoriCreateInput): Promise<Kategori> {
    return this.kategoriRepository.create(data);
  }

  async updateKategori(id: string, data: Prisma.KategoriUpdateInput): Promise<Kategori> {
    const kategori = await this.kategoriRepository.findById(id);
    if (!kategori) {
      throw new NotFoundError('Kategori not found');
    }
    return this.kategoriRepository.update(id, data);
  }

  async deleteKategori(id: string): Promise<void> {
    const kategori = await this.kategoriRepository.findById(id);
    if (!kategori) {
      throw new NotFoundError('Kategori not found');
    }
    await this.kategoriRepository.delete(id);
  }
}