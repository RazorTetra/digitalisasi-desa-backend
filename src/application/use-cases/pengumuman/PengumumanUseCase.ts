// src/application/use-cases/pengumuman/PengumumanUseCase.ts

import { PengumumanRepository } from '../../../infrastructure/repositories/PengumumanRepository';
import { Pengumuman, Prisma } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';

export class PengumumanUseCase {
  constructor(private pengumumanRepository: PengumumanRepository) {}

  async getPengumuman(): Promise<Pengumuman[]> {
    return this.pengumumanRepository.findMany();
  }

  async getPengumumanById(id: string): Promise<Pengumuman> {
    const pengumuman = await this.pengumumanRepository.findById(id);
    if (!pengumuman) {
      throw new NotFoundError('Pengumuman not found');
    }
    return pengumuman;
  }

  async createPengumuman(data: Prisma.PengumumanCreateInput): Promise<Pengumuman> {
    return this.pengumumanRepository.create(data);
  }

  async updatePengumuman(id: string, data: Prisma.PengumumanUpdateInput): Promise<Pengumuman> {
    const pengumuman = await this.pengumumanRepository.findById(id);
    if (!pengumuman) {
      throw new NotFoundError('Pengumuman not found');
    }
    return this.pengumumanRepository.update(id, data);
  }

  async deletePengumuman(id: string): Promise<void> {
    const pengumuman = await this.pengumumanRepository.findById(id);
    if (!pengumuman) {
      throw new NotFoundError('Pengumuman not found');
    }
    await this.pengumumanRepository.delete(id);
  }
}