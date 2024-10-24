// src/application/use-cases/finance/FinanceUseCase.ts

import { FinanceRepository } from '../../../infrastructure/repositories/FinanceRepository';
import { FinanceBanner, FinanceInfo, FinanceIncomeItem, FinanceExpenseItem, FinanceFinancingItem, Prisma } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

interface FinanceSummary {
  totalPendapatan: {
    anggaran: number;
    realisasi: number;
    sisa: number;
  };
  totalBelanja: {
    anggaran: number;
    realisasi: number;
    sisa: number;
    jumlahPendapatan: number;
    surplusDefisit: number;
  };
  totalPembiayaan: {
    anggaran: number;
    realisasi: number;
    sisa: number;
    pembiayaanNetto: number;
    sisaLebihPembiayaanAnggaran: number;
  };
}

export class FinanceUseCase {
  constructor(private financeRepository: FinanceRepository) {}

  // Banner Methods
  async getFinanceBanner(): Promise<FinanceBanner | null> {
    return this.financeRepository.getFinanceBanner();
  }

  private async uploadToCloudinary(file: UploadedFile): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'finance_banners',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async updateFinanceBanner(file?: UploadedFile): Promise<FinanceBanner> {
    const banner = await this.financeRepository.getFinanceBanner();
    if (!banner) {
      throw new NotFoundError('Finance banner not found');
    }

    if (file) {
      // Delete old image if exists
      if (banner.imageUrl) {
        const publicId = banner.imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error('Error deleting old banner:', error);
          }
        }
      }

      const imageUrl = await this.uploadToCloudinary(file);
      return this.financeRepository.updateFinanceBanner({ imageUrl });
    } else {
      // If no file provided, clear the image
      return this.financeRepository.updateFinanceBanner({ imageUrl: null });
    }
  }

  // Info Methods
  async getFinanceInfo(): Promise<FinanceInfo | null> {
    return this.financeRepository.getFinanceInfo();
  }

  async updateFinanceInfo(content: string): Promise<FinanceInfo> {
    const info = await this.financeRepository.getFinanceInfo();
    if (!info) {
      throw new NotFoundError('Finance info not found');
    }
    return this.financeRepository.updateFinanceInfo({ content });
  }

  // Income Methods
  async getIncomeItems(): Promise<FinanceIncomeItem[]> {
    return this.financeRepository.getIncomeItems();
  }

  async createIncomeItem(data: Prisma.FinanceIncomeItemCreateInput): Promise<FinanceIncomeItem> {
    return this.financeRepository.createIncomeItem(data);
  }

  async updateIncomeItem(id: string, data: Prisma.FinanceIncomeItemUpdateInput): Promise<FinanceIncomeItem> {
    const item = await this.financeRepository.getIncomeItemById(id);
    if (!item) {
      throw new NotFoundError('Income item not found');
    }
    return this.financeRepository.updateIncomeItem(id, data);
  }

  async deleteIncomeItem(id: string): Promise<void> {
    const item = await this.financeRepository.getIncomeItemById(id);
    if (!item) {
      throw new NotFoundError('Income item not found');
    }
    await this.financeRepository.deleteIncomeItem(id);
  }

  // Expense Methods
  async getExpenseItems(): Promise<FinanceExpenseItem[]> {
    return this.financeRepository.getExpenseItems();
  }

  async createExpenseItem(data: Prisma.FinanceExpenseItemCreateInput): Promise<FinanceExpenseItem> {
    return this.financeRepository.createExpenseItem(data);
  }

  async updateExpenseItem(id: string, data: Prisma.FinanceExpenseItemUpdateInput): Promise<FinanceExpenseItem> {
    const item = await this.financeRepository.getExpenseItemById(id);
    if (!item) {
      throw new NotFoundError('Expense item not found');
    }
    return this.financeRepository.updateExpenseItem(id, data);
  }

  async deleteExpenseItem(id: string): Promise<void> {
    const item = await this.financeRepository.getExpenseItemById(id);
    if (!item) {
      throw new NotFoundError('Expense item not found');
    }
    await this.financeRepository.deleteExpenseItem(id);
  }

  // Financing Methods
  async getFinancingItems(): Promise<FinanceFinancingItem[]> {
    return this.financeRepository.getFinancingItems();
  }

  async createFinancingItem(data: Prisma.FinanceFinancingItemCreateInput): Promise<FinanceFinancingItem> {
    return this.financeRepository.createFinancingItem(data);
  }

  async updateFinancingItem(id: string, data: Prisma.FinanceFinancingItemUpdateInput): Promise<FinanceFinancingItem> {
    const item = await this.financeRepository.getFinancingItemById(id);
    if (!item) {
      throw new NotFoundError('Financing item not found');
    }
    return this.financeRepository.updateFinancingItem(id, data);
  }

  async deleteFinancingItem(id: string): Promise<void> {
    const item = await this.financeRepository.getFinancingItemById(id);
    if (!item) {
      throw new NotFoundError('Financing item not found');
    }
    await this.financeRepository.deleteFinancingItem(id);
  }

  // Summary Methods
  async getFinanceSummary(): Promise<FinanceSummary> {
    const [incomeItems, expenseItems, financingItems] = await Promise.all([
      this.getIncomeItems(),
      this.getExpenseItems(),
      this.getFinancingItems(),
    ]);

    // Calculate Income Totals
    const totalPendapatan = {
      anggaran: this.sumDecimal(incomeItems.map(item => item.anggaran)),
      realisasi: this.sumDecimal(incomeItems.map(item => item.realisasi)),
      sisa: this.sumDecimal(incomeItems.map(item => item.anggaran.sub(item.realisasi))),
    };

    // Calculate Expense Totals
    const totalBelanja = {
      anggaran: this.sumDecimal(expenseItems.map(item => item.anggaran)),
      realisasi: this.sumDecimal(expenseItems.map(item => item.realisasi)),
      sisa: this.sumDecimal(expenseItems.map(item => item.anggaran.sub(item.realisasi))),
      jumlahPendapatan: this.sumDecimal(expenseItems.map(item => item.anggaran.sub(item.realisasi))),
      surplusDefisit: totalPendapatan.realisasi - this.sumDecimal(expenseItems.map(item => item.realisasi)),
    };

    // Calculate Financing Totals
    const totalPembiayaan = {
      anggaran: this.sumDecimal(financingItems.map(item => item.anggaran)),
      realisasi: this.sumDecimal(financingItems.map(item => item.realisasi)),
      sisa: this.sumDecimal(financingItems.map(item => item.anggaran.sub(item.realisasi))),
      pembiayaanNetto: this.calculatePembiayaanNetto(financingItems),
      sisaLebihPembiayaanAnggaran: 0, // Will be calculated based on all totals
    };

    // Calculate SILPA
    totalPembiayaan.sisaLebihPembiayaanAnggaran = 
      totalBelanja.surplusDefisit + totalPembiayaan.pembiayaanNetto;

    return {
      totalPendapatan,
      totalBelanja,
      totalPembiayaan,
    };
  }

  private sumDecimal(numbers: Prisma.Decimal[]): number {
    return numbers.reduce((sum, num) => sum + Number(num), 0);
  }

  private calculatePembiayaanNetto(items: FinanceFinancingItem[]): number {
    const penerimaan = items
      .filter(item => item.uraian.toLowerCase().includes('penerimaan'))
      .reduce((sum, item) => sum + Number(item.realisasi), 0);

    const pengeluaran = items
      .filter(item => item.uraian.toLowerCase().includes('pengeluaran'))
      .reduce((sum, item) => sum + Number(item.realisasi), 0);

    return penerimaan - pengeluaran;
  }
}