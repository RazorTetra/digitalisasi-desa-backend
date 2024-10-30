// src/types/finance.ts

import { FinancePeriod, Prisma } from "@prisma/client";

export interface FinanceSummary {
  jumlahPendapatan: number;
  jumlahBelanja: number;
  surplusDefisit: number;
  pembiayaanNeto: number;
}

export interface PeriodSummary extends FinanceSummary {
  tahun: number;
}

export type FinanceItemInput = {
  uraian: string;
  dana: number | string;
};

export type FinanceFinancingInput = FinanceItemInput & {
  jenis: "PENERIMAAN" | "PENGELUARAN";
};

export type CreatePeriodInput = {
  tahun: number;
};

// Custom Prisma types with decimal handling
export type FinanceIncome = Prisma.FinanceIncomeGetPayload<{
  select: {
    id: true;
    uraian: true;
    dana: true;
    periodId: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type FinanceExpense = Prisma.FinanceExpenseGetPayload<{
  select: {
    id: true;
    uraian: true;
    dana: true;
    periodId: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type FinanceFinancing = Prisma.FinanceFinancingGetPayload<{
  select: {
    id: true;
    uraian: true;
    dana: true;
    jenis: true;
    periodId: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export interface FinancePeriodWithDetails extends FinancePeriod {
  incomes: FinanceIncome[];
  expenses: FinanceExpense[];
  financings: FinanceFinancing[];
}
