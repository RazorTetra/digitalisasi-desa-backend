// src/application/use-cases/village/VillageUseCase.ts

import { VillageRepository } from "../../../infrastructure/repositories/VillageRepository";
import {
  VillageInfo,
  VillageStructure,
  Gallery,
  SocialMedia,
  Prisma,
} from "@prisma/client";
import { NotFoundError } from "../../../common/error/NotFoundError";
import { v2 as cloudinary } from "cloudinary";

export class VillageUseCase {
  constructor(private villageRepository: VillageRepository) {}

  async getVillageInfo(): Promise<VillageInfo | null> {
    return this.villageRepository.getVillageInfo();
  }

  async updateVillageInfo(
    data: Prisma.VillageInfoUpdateInput
  ): Promise<VillageInfo> {
    return this.villageRepository.updateVillageInfo(data);
  }

  async getVillageStructure(): Promise<VillageStructure[]> {
    return this.villageRepository.getVillageStructure();
  }

  async createVillageStructure(
    data: Prisma.VillageStructureCreateInput
  ): Promise<VillageStructure> {
    return this.villageRepository.createVillageStructure(data);
  }

  async updateVillageStructure(
    id: string,
    data: Prisma.VillageStructureUpdateInput
  ): Promise<VillageStructure> {
    const structure = await this.villageRepository.updateVillageStructure(
      id,
      data
    );
    if (!structure) {
      throw new NotFoundError("Village structure not found");
    }
    return structure;
  }

  async deleteVillageStructure(id: string): Promise<void> {
    await this.villageRepository.deleteVillageStructure(id);
  }

  async getGallery(): Promise<Gallery[]> {
    return this.villageRepository.getGallery();
  }

  async addGalleryImage(
    imageUrl: string,
    description?: string
  ): Promise<Gallery> {
    return this.villageRepository.addGalleryImage({
      imageUrl,
      description,
    });
  }

  async deleteGalleryImage(id: string): Promise<void> {
    const image = await this.villageRepository
      .getGallery()
      .then((gallery) => gallery.find((img) => img.id === id));
    if (image) {
      const publicId = image.imageUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    await this.villageRepository.deleteGalleryImage(id);
  }

  async getSocialMedia(): Promise<SocialMedia[]> {
    return this.villageRepository.getSocialMedia();
  }

  async updateSocialMedia(
    id: string,
    data: { url: string }
  ): Promise<SocialMedia> {
    const socialMedia = await this.villageRepository.findSocialMediaById(id);
    if (!socialMedia) {
      throw new NotFoundError("Social media not found");
    }
    return this.villageRepository.updateSocialMedia(id, data);
  }
}
