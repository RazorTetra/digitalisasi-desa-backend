-- CreateTable
CREATE TABLE "FinanceBanner" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceInfo" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceIncomeItem" (
    "id" TEXT NOT NULL,
    "uraian" TEXT NOT NULL,
    "anggaran" DECIMAL(15,2) NOT NULL,
    "realisasi" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceIncomeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceExpenseItem" (
    "id" TEXT NOT NULL,
    "uraian" TEXT NOT NULL,
    "anggaran" DECIMAL(15,2) NOT NULL,
    "realisasi" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceExpenseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceFinancingItem" (
    "id" TEXT NOT NULL,
    "uraian" TEXT NOT NULL,
    "anggaran" DECIMAL(15,2) NOT NULL,
    "realisasi" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceFinancingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinanceIncomeItem_uraian_key" ON "FinanceIncomeItem"("uraian");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceExpenseItem_uraian_key" ON "FinanceExpenseItem"("uraian");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceFinancingItem_uraian_key" ON "FinanceFinancingItem"("uraian");
