-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "TamuWajibLapor" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "alamatAsal" TEXT NOT NULL,
    "tujuan" TEXT NOT NULL,
    "lamaMenginap" TEXT NOT NULL,
    "tempatMenginap" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TamuWajibLapor_pkey" PRIMARY KEY ("id")
);
