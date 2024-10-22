/*
  Warnings:

  - You are about to drop the column `active` on the `FormatSurat` table. All the data in the column will be lost.
  - You are about to drop the column `deskripsi` on the `FormatSurat` table. All the data in the column will be lost.
  - You are about to drop the column `fieldSchema` on the `FormatSurat` table. All the data in the column will be lost.
  - You are about to drop the column `kode` on the `FormatSurat` table. All the data in the column will be lost.
  - You are about to drop the column `templateUrl` on the `FormatSurat` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `FormatSurat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `FormatSurat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FormatSurat_kode_key";

-- AlterTable
ALTER TABLE "FormatSurat" DROP COLUMN "active",
DROP COLUMN "deskripsi",
DROP COLUMN "fieldSchema",
DROP COLUMN "kode",
DROP COLUMN "templateUrl",
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL;
