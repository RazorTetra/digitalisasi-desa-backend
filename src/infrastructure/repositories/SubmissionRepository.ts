// src/infrastructure/repositories/SubmissionRepository.ts

import { PrismaClient, Submission, SubmissionStatus } from '@prisma/client';
import { SubmissionStats } from '../../types/submission';

const prisma = new PrismaClient();

export class SubmissionRepository {
  async create(data: {
    pengirim: string;
    whatsapp: string;
    kategori: string;
    keterangan: string;
    fileUrl: string;
    fileName: string;
  }): Promise<Submission> {
    return prisma.submission.create({
      data: {
        ...data,
        kategori: data.kategori.toLowerCase(),
        status: 'DIPROSES' // Default status
      }
    });
  }

  async findById(id: string): Promise<Submission | null> {
    return prisma.submission.findUnique({
      where: { id }
    });
  }

  async findAll(): Promise<Submission[]> {
    return prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: SubmissionStatus): Promise<Submission> {
    return prisma.submission.update({
      where: { id },
      data: { status }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.submission.delete({
      where: { id }
    });
  }

  async getStats(): Promise<SubmissionStats[]> {
    const basicStats = await prisma.submission.groupBy({
      by: ['kategori'],
      _count: {
        id: true
      }
    });

    const statusStats = await prisma.submission.groupBy({
      by: ['kategori', 'status'],
      _count: {
        id: true
      }
    });

    return basicStats.map(stat => {
      const categoryStatusStats = statusStats.filter(s => s.kategori === stat.kategori);
      
      return {
        kategori: stat.kategori,
        total: stat._count.id,
        statusCount: {
          DIPROSES: categoryStatusStats.find(s => s.status === 'DIPROSES')?._count.id ?? 0,
          SELESAI: categoryStatusStats.find(s => s.status === 'SELESAI')?._count.id ?? 0
        }
      };
    });
  }

  async findByPengirimWhatsapp(whatsapp: string): Promise<Submission[]> {
    return prisma.submission.findMany({
      where: { whatsapp },
      orderBy: { createdAt: 'desc' }
    });
  }
}