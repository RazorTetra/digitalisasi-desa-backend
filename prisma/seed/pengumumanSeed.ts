// prisma/seed/pengumumanSeed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPengumuman() {
  const pengumumanData = [
    {
      judul: "Jadwal Vaksinasi COVID-19",
      isi: "Vaksinasi COVID-19 tahap kedua akan dilaksanakan pada tanggal 15 Juli 2024 di Balai Desa. Semua warga berusia di atas 18 tahun yang belum mendapatkan vaksin dosis kedua diharapkan hadir. Jangan lupa membawa KTP dan kartu vaksin (jika ada).",
      tanggal: new Date("2024-07-01"),
      kategoriNama: "Kesehatan"
    },
    {
      judul: "Pembukaan Pendaftaran UMKM",
      isi: "Pendaftaran UMKM untuk program bantuan modal usaha dibuka mulai 1 Agustus 2024. Program ini bertujuan untuk membantu pengusaha kecil dan menengah di desa kita. Syarat dan ketentuan dapat dilihat di kantor desa atau website resmi desa.",
      tanggal: new Date("2024-07-15"),
      kategoriNama: "Ekonomi"
    },
    {
      judul: "Perayaan HUT Desa",
      isi: "Dalam rangka HUT Desa ke-50, akan diadakan berbagai lomba dan kegiatan mulai tanggal 10 Agustus 2024. Acara puncak akan dilaksanakan pada tanggal 17 Agustus 2024 dengan parade budaya dan pesta rakyat. Ayo ikut memeriahkan!",
      tanggal: new Date("2024-07-20"),
      kategoriNama: "Acara"
    },
    {
      judul: "Pembangunan Jembatan",
      isi: "Proyek pembangunan jembatan penghubung antar dusun akan dimulai pada 1 September 2024. Diharapkan warga dapat berhati-hati saat melewati area konstruksi. Pembangunan diperkirakan akan selesai dalam waktu 3 bulan.",
      tanggal: new Date("2024-08-01"),
      kategoriNama: "Infrastruktur"
    },
    {
      judul: "Pelatihan Keterampilan Digital",
      isi: "Pelatihan keterampilan digital untuk pemuda desa akan diadakan pada 5-7 September 2024 di Balai Desa. Pelatihan ini mencakup dasar-dasar komputer, internet, dan media sosial. Pendaftaran dibuka mulai 1 Agustus 2024 di kantor desa.",
      tanggal: new Date("2024-08-15"),
      kategoriNama: "Pendidikan"
    }
  ];

  for (const pengumuman of pengumumanData) {
    const { kategoriNama, ...pengumumanDetails } = pengumuman;
    
    let kategori = await prisma.kategori.findUnique({
      where: { nama: kategoriNama }
    });

    if (!kategori) {
      kategori = await prisma.kategori.create({
        data: { nama: kategoriNama }
      });
    }

    const existingPengumuman = await prisma.pengumuman.findFirst({
      where: { judul: pengumuman.judul }
    });

    if (existingPengumuman) {
      await prisma.pengumuman.update({
        where: { id: existingPengumuman.id },
        data: {
          ...pengumumanDetails,
          kategori: { connect: { id: kategori.id } }
        }
      });
    } else {
      await prisma.pengumuman.create({
        data: {
          ...pengumumanDetails,
          kategori: { connect: { id: kategori.id } }
        }
      });
    }
  }

  console.log('Pengumuman seeded successfully');
}

export { seedPengumuman };