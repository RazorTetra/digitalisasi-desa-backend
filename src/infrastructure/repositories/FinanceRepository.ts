// src/infrastructure/repositories/FinanceRepository.ts

import {
  PrismaClient,
  FinancePeriod,
  FinanceIncome,
  FinanceExpense,
  FinanceFinancing,
  Prisma,
  FinanceBanner,
  FinanceInfo,
} from "@prisma/client";
import { FinancePeriodWithDetails } from "../../types/finance";

const prisma = new PrismaClient();

export class FinanceRepository {
  // Period Methods
  async findAllPeriods(): Promise<FinancePeriod[]> {
    return prisma.financePeriod.findMany({
      orderBy: { tahun: "desc" },
      include: {
        incomes: true,
        expenses: true,
        financings: true,
      },
    });
  }

  async findPeriodById(id: string): Promise<FinancePeriodWithDetails | null> {
    return prisma.financePeriod.findUnique({
      where: { id },
      include: {
        incomes: true,
        expenses: true,
        financings: true,
      },
    });
  }

  async findPeriodByYear(tahun: number): Promise<
    | (FinancePeriod & {
        incomes: FinanceIncome[];
        expenses: FinanceExpense[];
        financings: FinanceFinancing[];
      })
    | null
  > {
    return prisma.financePeriod.findUnique({
      where: { tahun },
      include: {
        incomes: true,
        expenses: true,
        financings: true,
      },
    });
  }

  async findActivePeriod(): Promise<
    | (FinancePeriod & {
        incomes: FinanceIncome[];
        expenses: FinanceExpense[];
        financings: FinanceFinancing[];
      })
    | null
  > {
    return prisma.financePeriod.findFirst({
      where: { isActive: true },
      include: {
        incomes: true,
        expenses: true,
        financings: true,
      },
    });
  }

  async createPeriod(tahun: number): Promise<FinancePeriod> {
    return prisma.financePeriod.create({
      data: { tahun },
      include: {
        incomes: true,
        expenses: true,
        financings: true,
      },
    });
  }

  async updatePeriod(id: string, tahun: number): Promise<FinancePeriod> {
    return prisma.financePeriod.update({
      where: { id },
      data: { tahun },
      include: {
        incomes: true,
        expenses: true,
        financings: true,
      },
    });
  }

  async deletePeriod(id: string): Promise<void> {
    // Prisma akan otomatis menghapus semua records yang terkait
    // karena kita sudah setting onDelete: Cascade di schema
    await prisma.financePeriod.delete({
      where: { id },
    });
  }

  // Income Methods
  async createIncome(
    data: Prisma.FinanceIncomeCreateInput
  ): Promise<FinanceIncome> {
    return prisma.financeIncome.create({ data });
  }

  async updateIncome(
    id: string,
    data: Prisma.FinanceIncomeUpdateInput
  ): Promise<FinanceIncome> {
    return prisma.financeIncome.update({
      where: { id },
      data,
    });
  }

  async deleteIncome(id: string): Promise<void> {
    await prisma.financeIncome.delete({
      where: { id },
    });
  }

  // Expense Methods
  async createExpense(
    data: Prisma.FinanceExpenseCreateInput
  ): Promise<FinanceExpense> {
    return prisma.financeExpense.create({ data });
  }

  async updateExpense(
    id: string,
    data: Prisma.FinanceExpenseUpdateInput
  ): Promise<FinanceExpense> {
    return prisma.financeExpense.update({
      where: { id },
      data,
    });
  }

  async deleteExpense(id: string): Promise<void> {
    await prisma.financeExpense.delete({
      where: { id },
    });
  }

  // Financing Methods
  async createFinancing(
    data: Prisma.FinanceFinancingCreateInput
  ): Promise<FinanceFinancing> {
    return prisma.financeFinancing.create({ data });
  }

  async updateFinancing(
    id: string,
    data: Prisma.FinanceFinancingUpdateInput
  ): Promise<FinanceFinancing> {
    return prisma.financeFinancing.update({
      where: { id },
      data,
    });
  }

  async deleteFinancing(id: string): Promise<void> {
    await prisma.financeFinancing.delete({
      where: { id },
    });
  }

  // Banner Methods (unchanged)
  async getFinanceBanner(): Promise<FinanceBanner | null> {
    return prisma.financeBanner.findFirst();
  }

  async updateFinanceBanner(data: {
    imageUrl: string | null;
  }): Promise<FinanceBanner> {
    const banner = await prisma.financeBanner.findFirst();
    if (banner) {
      return prisma.financeBanner.update({
        where: { id: banner.id },
        data,
      });
    }
    return prisma.financeBanner.create({ data });
  }

  // Info Methods (unchanged)
  async getFinanceInfo(): Promise<FinanceInfo | null> {
    return prisma.financeInfo.findFirst();
  }

  async updateFinanceInfo(data: { content: string }): Promise<FinanceInfo> {
    const info = await prisma.financeInfo.findFirst();
    if (info) {
      return prisma.financeInfo.update({
        where: { id: info.id },
        data,
      });
    }
    return prisma.financeInfo.create({ data });
  }
}
