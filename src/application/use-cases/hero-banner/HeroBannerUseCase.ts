// src/application/use-cases/hero-banner/HeroBannerUseCase.ts

import { HeroBannerRepository } from '../../../infrastructure/repositories/HeroBannerRepository';
import { HeroBanner } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export class HeroBannerUseCase {
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  constructor(private heroBannerRepository: HeroBannerRepository) {}

  private async uploadToCloudinary(file: UploadedFile): Promise<string> {
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'hero_banner',
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 1080, crop: 'fill' },
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async getBanner(): Promise<HeroBanner | null> {
    return this.heroBannerRepository.getBanner();
  }

  async updateBanner(file: UploadedFile | null): Promise<HeroBanner> {
    const currentBanner = await this.heroBannerRepository.getBanner();
    
    // Jika ada file baru, upload ke Cloudinary
    let newImageUrl: string | null = null;
    if (file) {
      newImageUrl = await this.uploadToCloudinary(file);
    }

    // Jika ada banner lama dan imageUrl-nya berbeda, hapus dari Cloudinary
    if (currentBanner?.imageUrl && newImageUrl !== currentBanner.imageUrl) {
      const publicId = currentBanner.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`hero_banner/${publicId}`);
        } catch (error) {
          console.error('Error deleting old banner:', error);
        }
      }
    }

    return this.heroBannerRepository.updateBanner(newImageUrl);
  }
}