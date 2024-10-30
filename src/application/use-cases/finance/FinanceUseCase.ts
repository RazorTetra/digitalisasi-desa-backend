// src/application/use-cases/finance/FinanceUseCase.ts

import { FinanceRepository } from "../../../infrastructure/repositories/FinanceRepository";
import {
  FinancePeriod,
  FinanceIncome,
  FinanceExpense,
  FinanceFinancing,
  FinanceBanner,
  FinanceInfo,
  Prisma,
  FinancingType,
} from "@prisma/client";
import { NotFoundError } from "../../../common/error/NotFoundError";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import {
  FinanceSummary,
  FinanceItemInput,
  FinanceFinancingInput,
  CreatePeriodInput,
  FinancePeriodWithDetails,
} from "../../../types/finance";

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export class FinanceUseCase {
  constructor(private financeRepository: FinanceRepository) {}

  // Period Management
  async createPeriod(data: CreatePeriodInput): Promise<FinancePeriod> {
    const existingPeriod = await this.financeRepository.findPeriodByYear(
      data.tahun
    );
    if (existingPeriod) {
      throw new Error(`Period for year ${data.tahun} already exists`);
    }
    return this.financeRepository.createPeriod(data.tahun);
  }

  async getAllPeriods(): Promise<FinancePeriod[]> {
    return this.financeRepository.findAllPeriods();
  }

  async getPeriodById(id: string): Promise<FinancePeriodWithDetails> {
    const period = await this.financeRepository.findPeriodById(id);
    if (!period) {
      throw new NotFoundError("Period not found");
    }
    return period;
  }

  async getActivePeriod(): Promise<FinancePeriodWithDetails> {
    const period = await this.financeRepository.findActivePeriod();
    if (!period) {
      throw new NotFoundError("No active period found");
    }
    return period;
  }

  async updatePeriod(id: string, tahun: number): Promise<FinancePeriod> {
    const existingPeriod = await this.financeRepository.findPeriodById(id);
    if (!existingPeriod) {
      throw new NotFoundError("Period not found");
    }

    const periodWithYear = await this.financeRepository.findPeriodByYear(tahun);
    if (periodWithYear && periodWithYear.id !== id) {
      throw new Error(`Period for year ${tahun} already exists`);
    }

    return this.financeRepository.updatePeriod(id, tahun);
  }

  async deletePeriod(id: string): Promise<void> {
    const period = await this.financeRepository.findPeriodById(id);
    if (!period) {
      throw new NotFoundError("Period not found");
    }

    await this.financeRepository.deletePeriod(id);
  }

  // Financial Items Management
  async addIncome(
    periodId: string,
    data: FinanceItemInput
  ): Promise<FinanceIncome> {
    const period = await this.financeRepository.findPeriodById(periodId);
    if (!period) {
      throw new NotFoundError("Period not found");
    }

    return this.financeRepository.createIncome({
      uraian: data.uraian,
      dana: new Prisma.Decimal(data.dana.toString()),
      period: { connect: { id: periodId } },
    });
  }

  async addExpense(
    periodId: string,
    data: FinanceItemInput
  ): Promise<FinanceExpense> {
    const period = await this.financeRepository.findPeriodById(periodId);
    if (!period) {
      throw new NotFoundError("Period not found");
    }

    return this.financeRepository.createExpense({
      uraian: data.uraian,
      dana: new Prisma.Decimal(data.dana.toString()),
      period: { connect: { id: periodId } },
    });
  }

  async addFinancing(
    periodId: string,
    data: FinanceFinancingInput
  ): Promise<FinanceFinancing> {
    const period = await this.financeRepository.findPeriodById(periodId);
    if (!period) {
      throw new NotFoundError("Period not found");
    }

    return this.financeRepository.createFinancing({
      uraian: data.uraian,
      dana: new Prisma.Decimal(data.dana.toString()),
      jenis: data.jenis as FinancingType,
      period: { connect: { id: periodId } },
    });
  }

  // Calculation Methods
  private calculateTotalDana(items: { dana: Prisma.Decimal }[]): number {
    return items.reduce((sum, item) => sum + Number(item.dana), 0);
  }

  private calculatePembiayaanNeto(financings: FinanceFinancing[]): number {
    const penerimaan = financings
      .filter((item) => item.jenis === FinancingType.PENERIMAAN)
      .reduce((sum, item) => sum + Number(item.dana), 0);

    const pengeluaran = financings
      .filter((item) => item.jenis === FinancingType.PENGELUARAN)
      .reduce((sum, item) => sum + Number(item.dana), 0);

    return penerimaan - pengeluaran;
  }

  async calculatePeriodSummary(periodId: string): Promise<FinanceSummary> {
    const period = await this.getPeriodById(periodId);

    const jumlahPendapatan = this.calculateTotalDana(period.incomes);
    const jumlahBelanja = this.calculateTotalDana(period.expenses);
    const surplusDefisit = jumlahPendapatan - jumlahBelanja;
    const pembiayaanNeto = this.calculatePembiayaanNeto(period.financings);

    return {
      jumlahPendapatan,
      jumlahBelanja,
      surplusDefisit,
      pembiayaanNeto,
    };
  }

  // Income Management
  async updateIncome(
    id: string,
    data: FinanceItemInput
  ): Promise<FinanceIncome> {
    return this.financeRepository.updateIncome(id, {
      uraian: data.uraian,
      dana: new Prisma.Decimal(data.dana.toString()),
    });
  }

  async deleteIncome(id: string): Promise<void> {
    await this.financeRepository.deleteIncome(id);
  }

  // Expense Management
  async updateExpense(
    id: string,
    data: FinanceItemInput
  ): Promise<FinanceExpense> {
    return this.financeRepository.updateExpense(id, {
      uraian: data.uraian,
      dana: new Prisma.Decimal(data.dana.toString()),
    });
  }

  async deleteExpense(id: string): Promise<void> {
    await this.financeRepository.deleteExpense(id);
  }

  // Financing Management
  async updateFinancing(
    id: string,
    data: FinanceFinancingInput
  ): Promise<FinanceFinancing> {
    return this.financeRepository.updateFinancing(id, {
      uraian: data.uraian,
      dana: new Prisma.Decimal(data.dana.toString()),
      jenis: data.jenis as FinancingType,
    });
  }

  async deleteFinancing(id: string): Promise<void> {
    await this.financeRepository.deleteFinancing(id);
  }

  // Banner Methods (unchanged)
  private async uploadToCloudinary(file: UploadedFile): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "finance_banners",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async getFinanceBanner(): Promise<FinanceBanner | null> {
    return this.financeRepository.getFinanceBanner();
  }

  async updateFinanceBanner(file?: UploadedFile): Promise<FinanceBanner> {
    if (file) {
      const imageUrl = await this.uploadToCloudinary(file);
      return this.financeRepository.updateFinanceBanner({ imageUrl });
    }
    return this.financeRepository.updateFinanceBanner({ imageUrl: null });
  }

  // Info Methods (unchanged)
  async getFinanceInfo(): Promise<FinanceInfo | null> {
    return this.financeRepository.getFinanceInfo();
  }

  async updateFinanceInfo(content: string): Promise<FinanceInfo> {
    return this.financeRepository.updateFinanceInfo({ content });
  }
}
