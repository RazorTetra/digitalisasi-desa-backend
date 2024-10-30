/*
  Warnings:

  - You are about to drop the `FinanceExpenseItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinanceFinancingItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinanceIncomeItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FinancingType" AS ENUM ('PENERIMAAN', 'PENGELUARAN');

-- DropTable
DROP TABLE "FinanceExpenseItem";

-- DropTable
DROP TABLE "FinanceFinancingItem";

-- DropTable
DROP TABLE "FinanceIncomeItem";

-- CreateTable
CREATE TABLE "FinancePeriod" (
    "id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceIncome" (
    "id" TEXT NOT NULL,
    "uraian" TEXT NOT NULL,
    "dana" DECIMAL(15,2) NOT NULL,
    "periodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceIncome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceExpense" (
    "id" TEXT NOT NULL,
    "uraian" TEXT NOT NULL,
    "dana" DECIMAL(15,2) NOT NULL,
    "periodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceFinancing" (
    "id" TEXT NOT NULL,
    "uraian" TEXT NOT NULL,
    "dana" DECIMAL(15,2) NOT NULL,
    "jenis" "FinancingType" NOT NULL,
    "periodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceFinancing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancePeriod_tahun_key" ON "FinancePeriod"("tahun");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceIncome_uraian_periodId_key" ON "FinanceIncome"("uraian", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceExpense_uraian_periodId_key" ON "FinanceExpense"("uraian", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceFinancing_uraian_periodId_key" ON "FinanceFinancing"("uraian", "periodId");

-- AddForeignKey
ALTER TABLE "FinanceIncome" ADD CONSTRAINT "FinanceIncome_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "FinancePeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceExpense" ADD CONSTRAINT "FinanceExpense_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "FinancePeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceFinancing" ADD CONSTRAINT "FinanceFinancing_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "FinancePeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
