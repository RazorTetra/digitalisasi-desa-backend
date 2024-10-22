/*
  Warnings:

  - A unique constraint covering the columns `[trackingCode]` on the table `TamuWajibLapor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trackingCode` to the `TamuWajibLapor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TamuWajibLapor" ADD COLUMN     "statusMessage" TEXT,
ADD COLUMN     "trackingCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TamuWajibLapor_trackingCode_key" ON "TamuWajibLapor"("trackingCode");

-- CreateIndex
CREATE INDEX "TamuWajibLapor_trackingCode_idx" ON "TamuWajibLapor"("trackingCode");
