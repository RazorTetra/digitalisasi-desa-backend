-- CreateTable
CREATE TABLE "BeritaKategori" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeritaKategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ringkasan" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "gambarUrl" TEXT NOT NULL,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "penulis" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeritaToKategori" (
    "beritaId" TEXT NOT NULL,
    "kategoriId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeritaToKategori_pkey" PRIMARY KEY ("beritaId","kategoriId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeritaKategori_nama_key" ON "BeritaKategori"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "BeritaKategori_slug_key" ON "BeritaKategori"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");

-- CreateIndex
CREATE INDEX "Berita_slug_idx" ON "Berita"("slug");

-- CreateIndex
CREATE INDEX "Berita_tanggal_idx" ON "Berita"("tanggal");

-- AddForeignKey
ALTER TABLE "BeritaToKategori" ADD CONSTRAINT "BeritaToKategori_beritaId_fkey" FOREIGN KEY ("beritaId") REFERENCES "Berita"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeritaToKategori" ADD CONSTRAINT "BeritaToKategori_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "BeritaKategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;
