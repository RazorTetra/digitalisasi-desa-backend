// src/application/use-cases/tamu-wajib-lapor/TamuWajibLaporUseCase.ts

import { TamuWajibLaporRepository } from '../../../infrastructure/repositories/TamuWajibLaporRepository';
import { TamuWajibLapor, Prisma } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';
import { generateTrackingCode } from '../../../utils/trackingCode';

export class TamuWajibLaporUseCase {
  constructor(private tamuWajibLaporRepository: TamuWajibLaporRepository) {}

  async createLaporan(data: Omit<Prisma.TamuWajibLaporCreateInput, 'trackingCode'>): Promise<{ 
    trackingCode: string;
    status: string;
    createdAt: Date;
  }> {
    const trackingCode = await generateTrackingCode();
    const laporan = await this.tamuWajibLaporRepository.create({
      ...data,
      trackingCode,
    });

    return {
      trackingCode: laporan.trackingCode,
      status: laporan.status,
      createdAt: laporan.createdAt
    };
  }

  async getPublicStatus(trackingCode: string): Promise<{
    status: string;
    statusMessage?: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const laporan = await this.tamuWajibLaporRepository.findByTrackingCode(trackingCode);
    if (!laporan) {
      throw new NotFoundError('Laporan not found');
    }

    return {
      status: laporan.status,
      statusMessage: laporan.statusMessage ?? undefined,
      createdAt: laporan.createdAt,
      updatedAt: laporan.updatedAt
    };
  }

  async getAllLaporan(): Promise<TamuWajibLapor[]> {
    return this.tamuWajibLaporRepository.findMany();
  }

  async getLaporanById(id: string): Promise<TamuWajibLapor> {
    const laporan = await this.tamuWajibLaporRepository.findById(id);
    if (!laporan) {
      throw new NotFoundError('Laporan not found');
    }
    return laporan;
  }

  async getRecentPublicStatuses(limit = 10): Promise<Array<{
    trackingCode: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>> {
    const laporan = await this.tamuWajibLaporRepository.findRecent(limit);
    return laporan.map(item => ({
      trackingCode: item.trackingCode,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  }

  async updateStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', statusMessage?: string): Promise<TamuWajibLapor> {
    const laporan = await this.tamuWajibLaporRepository.findById(id);
    if (!laporan) {
      throw new NotFoundError('Laporan not found');
    }
    return this.tamuWajibLaporRepository.update(id, { status, statusMessage });
  }

  async deleteLaporan(id: string): Promise<void> {
    const laporan = await this.tamuWajibLaporRepository.findById(id);
    if (!laporan) {
      throw new NotFoundError('Laporan not found');
    }
    await this.tamuWajibLaporRepository.delete(id);
  }
}