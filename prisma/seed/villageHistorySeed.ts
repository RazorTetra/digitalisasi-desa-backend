// prisma/seed/villageHistorySeed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVillageHistory() {
  const villageHistory = `Dibentuknya sebuah wanua (atau wilayah pemukiman) di lokasi Desa Tandengan saat ini bermula dari kedatangan tiga orang bernama Oroh, Tumonggor, dan Lumempow dari daerah Minawanua (sekarang daerah Kelurahan Toulour di Kecamatan Tondano Timur). Setelah beberapa lama menjadi tempat hilir mudik perahu dari Minawanua maupun Remboken, pada tahun 1809 dibentuk menjadi sebuah wanua dengan nama Timadeng (yang berarti semenanjung). Nama wanua ini kemudian berubah menjadi Tandengan.

Saat ini Desa Tandengan terbagi menjadi lima jaga dan memiliki luas desa kurang lebih 128 Ha (1.280.000 m²) dengan jumlah penduduk 1.267 jiwa. Sampai saat ini penduduk dan Pemerintah Desa mengupayakan supaya Desa menjadi salah satu Desa Wisata di Kabupaten Minahasa dan di Sulawesi Utara. Beberapa 'potensi' Objek Wisata bisa kita temui di Desa ini yakni Wisata Teluk Sumalangka, Teluk Sinawu, Air terjun Tuunan, Tanjung Watu dan Pulau likri.`;

  await prisma.villageInfo.upsert({
    where: { id: '1' }, // Assuming we'll always have only one VillageInfo record
    update: { history: villageHistory },
    create: {
      id: '1',
      history: villageHistory,
    },
  });

  console.log('Village history seeded successfully');
}

export { seedVillageHistory };