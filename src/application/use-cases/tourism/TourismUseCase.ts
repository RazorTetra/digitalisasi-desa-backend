// src/application/use-cases/tourism/TourismUseCase.ts

import { TourismRepository } from '../../../infrastructure/repositories/TourismRepository';
import { Tourism } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export class TourismUseCase {
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  constructor(private tourismRepository: TourismRepository) {}

  private async uploadToCloudinary(file: UploadedFile): Promise<string> {
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tourism',
          allowed_formats: ['jpg', 'png', 'webp'],
          transformation: [
            { width: 1200, height: 800, crop: 'fill' },
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

  private async uploadMultipleToCloudinary(files: UploadedFile[]): Promise<string[]> {
    if (files.length > 10) {
      throw new Error('Maximum 10 images allowed in gallery');
    }

    return Promise.all(files.map(file => this.uploadToCloudinary(file)));
  }

  async getAllTourism(): Promise<Tourism[]> {
    return this.tourismRepository.findMany();
  }

  async getTourismById(id: string): Promise<Tourism> {
    const tourism = await this.tourismRepository.findById(id);
    if (!tourism) {
      throw new NotFoundError('Tourism destination not found');
    }
    return tourism;
  }

  async createTourism(
    data: { 
      name: string; 
      description: string; 
      location: string; 
    },
    mainImage: UploadedFile,
    galleryImages: UploadedFile[]
  ): Promise<Tourism> {
    const imageUrl = await this.uploadToCloudinary(mainImage);
    const galleryUrls = await this.uploadMultipleToCloudinary(galleryImages);

    return this.tourismRepository.create({
      ...data,
      image: imageUrl,
      gallery: galleryUrls,
    });
  }

  async updateTourism(
    id: string,
    data: { 
      name?: string; 
      description?: string; 
      location?: string; 
    },
    mainImage?: UploadedFile,
    galleryImages?: UploadedFile[]
  ): Promise<Tourism> {
    const tourism = await this.getTourismById(id);

    let imageUrl = tourism.image;
    if (mainImage) {
      // Delete old image from Cloudinary
      const publicId = tourism.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`tourism/${publicId}`);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      imageUrl = await this.uploadToCloudinary(mainImage);
    }

    let galleryUrls = tourism.gallery;
    if (galleryImages) {
      // Delete old gallery images from Cloudinary
      for (const galleryUrl of tourism.gallery) {
        const publicId = galleryUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`tourism/${publicId}`);
          } catch (error) {
            console.error('Error deleting old gallery image:', error);
          }
        }
      }
      galleryUrls = await this.uploadMultipleToCloudinary(galleryImages);
    }

    return this.tourismRepository.update(id, {
      ...data,
      image: imageUrl,
      gallery: galleryUrls,
    });
  }

  async deleteTourism(id: string): Promise<void> {
    const tourism = await this.getTourismById(id);

    // Delete main image from Cloudinary
    const mainImageId = tourism.image.split('/').pop()?.split('.')[0];
    if (mainImageId) {
      try {
        await cloudinary.uploader.destroy(`tourism/${mainImageId}`);
      } catch (error) {
        console.error('Error deleting main image:', error);
      }
    }

    // Delete gallery images from Cloudinary
    for (const galleryUrl of tourism.gallery) {
      const publicId = galleryUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`tourism/${publicId}`);
        } catch (error) {
          console.error('Error deleting gallery image:', error);
        }
      }
    }

    await this.tourismRepository.delete(id);
  }
}