// prisma/seed/socialMediaSeed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSocialMedia() {
  const socialMediaData = [
    {
      platform: 'Facebook',
      url: 'https://facebook.com/desatandengan',
    },
    {
      platform: 'Instagram',
      url: 'https://instagram.com/desatandengan',
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/desatandengan',
    },
    {
      platform: 'Email',
      url: 'mailto:info@desatandengan.com',
    },
  ];

  for (const data of socialMediaData) {
    await prisma.socialMedia.upsert({
      where: { platform: data.platform },
      update: { url: data.url },
      create: data,
    });
  }

  console.log('Social media seeded successfully');
}

export { seedSocialMedia };