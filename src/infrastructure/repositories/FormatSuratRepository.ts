// src/infrastructure/repositories/FormatSuratRepository.ts

import { PrismaClient, FormatSurat, Prisma } from '@prisma/client';

interface MonthlyDownloadStats {
  month: string;
  year: number;
  downloadCount: number;
}

interface FormatSuratWithStats extends FormatSurat {
  totalDownloads: number;
}

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
  async recordDownload(formatSuratId: string): Promise<void> {
    await prisma.formatSuratDownload.create({
      data: {
        formatSuratId
      }
    });
  }

  async getMonthlyDownloads(formatSuratId: string, year?: number): Promise<MonthlyDownloadStats[]> {
    const monthlyStats = await prisma.$queryRaw<Array<{ month: number; year: number; downloadCount: bigint }>>`
      SELECT 
        EXTRACT(MONTH FROM "downloadedAt")::integer as month,
        EXTRACT(YEAR FROM "downloadedAt")::integer as year,
        COUNT(*)::bigint as "downloadCount"
      FROM "FormatSuratDownload"
      WHERE "formatSuratId" = ${formatSuratId}
      ${year ? Prisma.sql`AND EXTRACT(YEAR FROM "downloadedAt") = ${year}` : Prisma.sql``}
      GROUP BY 
        EXTRACT(MONTH FROM "downloadedAt"),
        EXTRACT(YEAR FROM "downloadedAt")
      ORDER BY 
        year, month
    `;

    // Convert BigInt to Number and map month numbers to names
    return monthlyStats.map(stat => ({
      month: this.getMonthName(stat.month),
      year: stat.year,
      downloadCount: Number(stat.downloadCount)
    }));
  }

  private getMonthName(monthNumber: number): string {
    const months = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  }

  async findManyWithDownloadStats(): Promise<FormatSuratWithStats[]> {
    const formats = await prisma.formatSurat.findMany({
      include: {
        _count: {
          select: {
            downloads: true
          }
        }
      }
    });

    return formats.map(format => ({
      ...format,
      totalDownloads: Number(format._count.downloads)
    }));
  }
}