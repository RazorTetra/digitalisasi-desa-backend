// src/infrastructure/repositories/VillageRepository.ts

import {
  PrismaClient,
  VillageInfo,
  VillageStructure,
  Gallery,
  SocialMedia,
  Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

export class VillageRepository {
  async getVillageInfo(): Promise<VillageInfo | null> {
    return prisma.villageInfo.findFirst();
  }

  async updateVillageInfo(
    data: Prisma.VillageInfoUpdateInput
  ): Promise<VillageInfo> {
    const existingInfo = await prisma.villageInfo.findFirst();
    if (existingInfo) {
      return prisma.villageInfo.update({
        where: { id: existingInfo.id },
        data,
      });
    } else {
      return prisma.villageInfo.create({
        data: data as Prisma.VillageInfoCreateInput,
      });
    }
  }

  async getVillageStructure(): Promise<VillageStructure[]> {
    return prisma.villageStructure.findMany();
  }

  async createVillageStructure(
    data: Prisma.VillageStructureCreateInput
  ): Promise<VillageStructure> {
    return prisma.villageStructure.create({ data });
  }

  async updateVillageStructure(
    id: string,
    data: Prisma.VillageStructureUpdateInput
  ): Promise<VillageStructure> {
    return prisma.villageStructure.update({
      where: { id },
      data,
    });
  }

  async deleteVillageStructure(id: string): Promise<void> {
    await prisma.villageStructure.delete({
      where: { id },
    });
  }

  async getGallery(): Promise<Gallery[]> {
    return prisma.gallery.findMany();
  }

  async addGalleryImage(data: Prisma.GalleryCreateInput): Promise<Gallery> {
    return prisma.gallery.create({ data });
  }

  async deleteGalleryImage(id: string): Promise<void> {
    await prisma.gallery.delete({
      where: { id },
    });
  }

  async getSocialMedia(): Promise<SocialMedia[]> {
    return prisma.socialMedia.findMany();
  }

  async findSocialMediaById(id: string): Promise<SocialMedia | null> {
    return prisma.socialMedia.findUnique({ where: { id } });
  }

  async updateSocialMedia(
    id: string,
    data: { url: string }
  ): Promise<SocialMedia> {
    return prisma.socialMedia.update({
      where: { id },
      data: { url: data.url },
    });
  }
}
