/*
  Warnings:

  - You are about to drop the column `kategori` on the `Pengumuman` table. All the data in the column will be lost.
  - Added the required column `kategoriId` to the `Pengumuman` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengumuman" DROP COLUMN "kategori",
ADD COLUMN     "kategoriId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Kategori" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_nama_key" ON "Kategori"("nama");

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
