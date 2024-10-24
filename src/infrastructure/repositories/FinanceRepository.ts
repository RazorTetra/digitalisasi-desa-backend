// src/infrastructure/repositories/FinanceRepository.ts

import {
  PrismaClient,
  FinanceBanner,
  FinanceInfo,
  FinanceIncomeItem,
  FinanceExpenseItem,
  FinanceFinancingItem,
  Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

export class FinanceRepository {
  // Banner Methods
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
        data: {
          imageUrl: data.imageUrl,
          updatedAt: new Date(),
        },
      });
    }
    return prisma.financeBanner.create({
      data: {
        imageUrl: data.imageUrl,
      },
    });
  }

  // Info Methods
  async getFinanceInfo(): Promise<FinanceInfo | null> {
    return prisma.financeInfo.findFirst();
  }

  async updateFinanceInfo(data: { content: string }): Promise<FinanceInfo> {
    const info = await prisma.financeInfo.findFirst();
    if (info) {
      return prisma.financeInfo.update({
        where: { id: info.id },
        data: {
          content: data.content,
          updatedAt: new Date(),
        },
      });
    }
    return prisma.financeInfo.create({
      data: {
        content: data.content,
      },
    });
  }

  // Income Methods
  async getIncomeItems(): Promise<FinanceIncomeItem[]> {
    return prisma.financeIncomeItem.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async getIncomeItemById(id: string): Promise<FinanceIncomeItem | null> {
    return prisma.financeIncomeItem.findUnique({
      where: { id },
    });
  }

  async createIncomeItem(
    data: Prisma.FinanceIncomeItemCreateInput
  ): Promise<FinanceIncomeItem> {
    return prisma.financeIncomeItem.create({ data });
  }

  async updateIncomeItem(
    id: string,
    data: Prisma.FinanceIncomeItemUpdateInput
  ): Promise<FinanceIncomeItem> {
    return prisma.financeIncomeItem.update({
      where: { id },
      data,
    });
  }

  async deleteIncomeItem(id: string): Promise<void> {
    await prisma.financeIncomeItem.delete({
      where: { id },
    });
  }

  // Expense Methods
  async getExpenseItems(): Promise<FinanceExpenseItem[]> {
    return prisma.financeExpenseItem.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async getExpenseItemById(id: string): Promise<FinanceExpenseItem | null> {
    return prisma.financeExpenseItem.findUnique({
      where: { id },
    });
  }

  async createExpenseItem(
    data: Prisma.FinanceExpenseItemCreateInput
  ): Promise<FinanceExpenseItem> {
    return prisma.financeExpenseItem.create({ data });
  }

  async updateExpenseItem(
    id: string,
    data: Prisma.FinanceExpenseItemUpdateInput
  ): Promise<FinanceExpenseItem> {
    return prisma.financeExpenseItem.update({
      where: { id },
      data,
    });
  }

  async deleteExpenseItem(id: string): Promise<void> {
    await prisma.financeExpenseItem.delete({
      where: { id },
    });
  }

  // Financing Methods
  async getFinancingItems(): Promise<FinanceFinancingItem[]> {
    return prisma.financeFinancingItem.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async getFinancingItemById(id: string): Promise<FinanceFinancingItem | null> {
    return prisma.financeFinancingItem.findUnique({
      where: { id },
    });
  }

  async createFinancingItem(
    data: Prisma.FinanceFinancingItemCreateInput
  ): Promise<FinanceFinancingItem> {
    return prisma.financeFinancingItem.create({ data });
  }

  async updateFinancingItem(
    id: string,
    data: Prisma.FinanceFinancingItemUpdateInput
  ): Promise<FinanceFinancingItem> {
    return prisma.financeFinancingItem.update({
      where: { id },
      data,
    });
  }

  async deleteFinancingItem(id: string): Promise<void> {
    await prisma.financeFinancingItem.delete({
      where: { id },
    });
  }
}
