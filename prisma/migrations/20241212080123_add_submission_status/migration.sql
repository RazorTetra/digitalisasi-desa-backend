-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DIPROSES', 'SELESAI');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'DIPROSES';
