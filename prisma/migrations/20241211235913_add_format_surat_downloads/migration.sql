-- CreateTable
CREATE TABLE "FormatSuratDownload" (
    "id" TEXT NOT NULL,
    "formatSuratId" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormatSuratDownload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormatSuratDownload_formatSuratId_downloadedAt_idx" ON "FormatSuratDownload"("formatSuratId", "downloadedAt");

-- AddForeignKey
ALTER TABLE "FormatSuratDownload" ADD CONSTRAINT "FormatSuratDownload_formatSuratId_fkey" FOREIGN KEY ("formatSuratId") REFERENCES "FormatSurat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
