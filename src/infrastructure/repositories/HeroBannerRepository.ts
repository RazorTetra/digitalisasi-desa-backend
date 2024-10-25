// src/infrastructure/repositories/HeroBannerRepository.ts

import { PrismaClient, HeroBanner } from '@prisma/client';

const prisma = new PrismaClient();

export class HeroBannerRepository {
  async getBanner(): Promise<HeroBanner | null> {
    return prisma.heroBanner.findFirst();
  }

  async updateBanner(imageUrl: string | null): Promise<HeroBanner> {
    const banner = await prisma.heroBanner.findFirst();

    if (banner) {
      return prisma.heroBanner.update({
        where: { id: banner.id },
        data: { imageUrl }
      });
    }

    return prisma.heroBanner.create({
      data: { imageUrl }
    });
  }
}