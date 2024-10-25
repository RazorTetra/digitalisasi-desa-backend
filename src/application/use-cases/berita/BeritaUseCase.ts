// src/application/use-cases/berita/BeritaUseCase.ts

import { BeritaRepository } from '../../../infrastructure/repositories/BeritaRepository';
import { Berita, BeritaKategori, Prisma } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { RedisService } from '../../../infrastructure/config/redisConfig';
import slugify from 'slugify';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

type BeritaWithKategori = Berita & {
  kategori: Array<{
    kategori: BeritaKategori;
  }>;
};

type BeritaResponse = Omit<Berita, 'kategori'> & {
  kategori: BeritaKategori[];
};

export class BeritaUseCase {
  private readonly CACHE_TTL = {
    LIST: 3600,      // 1 hour
    DETAIL: 86400,   // 1 day
    KATEGORI: 86400  // 1 day
  };

  constructor(
    private beritaRepository: BeritaRepository,
    private redisService: RedisService
  ) {}

  private async uploadToCloudinary(file: UploadedFile): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'berita',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private generateSlug(judul: string): string {
    return slugify(judul, {
      lower: true,
      strict: true
    });
  }

  private transformBeritaResponse(berita: BeritaWithKategori): BeritaResponse {
    return {
      ...berita,
      kategori: berita.kategori.map(k => k.kategori)
    };
  }

  async getAllBerita(): Promise<BeritaResponse[]> {
    const cacheKey = 'berita:all';
    const cachedData = await this.redisService.get<BeritaResponse[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const berita = await this.beritaRepository.findMany();
    const transformedBerita = berita.map(this.transformBeritaResponse);
    await this.redisService.set(cacheKey, transformedBerita, this.CACHE_TTL.LIST);
    
    return transformedBerita;
  }

  async getBeritaBySlug(slug: string): Promise<BeritaResponse> {
    const cacheKey = `berita:${slug}`;
    const cachedData = await this.redisService.get<BeritaResponse>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const berita = await this.beritaRepository.findBySlug(slug);
    if (!berita) {
      throw new NotFoundError('Berita not found');
    }

    const transformedBerita = this.transformBeritaResponse(berita);
    await this.redisService.set(cacheKey, transformedBerita, this.CACHE_TTL.DETAIL);
    return transformedBerita;
  }

  async getHighlightedBerita(): Promise<BeritaResponse[]> {
    const cacheKey = 'berita:highlighted';
    const cachedData = await this.redisService.get<BeritaResponse[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const berita = await this.beritaRepository.findHighlighted();
    const transformedBerita = berita.map(this.transformBeritaResponse);
    await this.redisService.set(cacheKey, transformedBerita, this.CACHE_TTL.LIST);
    
    return transformedBerita;
  }

  async createBerita(
    data: Omit<Prisma.BeritaCreateInput, 'slug' | 'gambarUrl'> & 
    { kategoriIds: string[], file: UploadedFile }
  ): Promise<BeritaResponse> {
    const gambarUrl = await this.uploadToCloudinary(data.file);
    const slug = this.generateSlug(data.judul);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { kategoriIds, file, ...restData } = data;

    const berita = await this.beritaRepository.create({
      ...restData,
      slug,
      gambarUrl,
      kategori: {
        create: kategoriIds.map(kategoriId => ({
          kategori: {
            connect: { id: kategoriId }
          }
        }))
      }
    });

    await this.redisService.delete('berita:all');
    if (data.isHighlight) {
      await this.redisService.delete('berita:highlighted');
    }

    return this.transformBeritaResponse(berita);
  }

  async updateBerita(
    id: string,
    data: Partial<Omit<Prisma.BeritaUpdateInput, 'slug' | 'gambarUrl'>> & 
    { kategoriIds?: string[], file?: UploadedFile }
  ): Promise<BeritaResponse> {
    const berita = await this.beritaRepository.findById(id);
    if (!berita) {
      throw new NotFoundError('Berita not found');
    }

    let gambarUrl = berita.gambarUrl;
    if (data.file) {
      // Delete old image
      const publicId = berita.gambarUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      gambarUrl = await this.uploadToCloudinary(data.file);
    }

    const slug = data.judul ? this.generateSlug(data.judul as string) : berita.slug;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { kategoriIds, file, ...restData } = data;
    const updateData: Prisma.BeritaUpdateInput = {
      ...restData,
      slug,
      gambarUrl,
    };

    if (kategoriIds) {
      updateData.kategori = {
        deleteMany: {},
        create: kategoriIds.map(kategoriId => ({
          kategori: {
            connect: { id: kategoriId }
          }
        }))
      };
    }

    const updatedBerita = await this.beritaRepository.update(id, updateData);

    // Clear related caches
    await Promise.all([
      this.redisService.delete('berita:all'),
      this.redisService.delete(`berita:${berita.slug}`),
      this.redisService.delete(`berita:${slug}`),
      this.redisService.delete('berita:highlighted')
    ]);

    return this.transformBeritaResponse(updatedBerita);
  }

  async deleteBerita(id: string): Promise<void> {
    const berita = await this.beritaRepository.findById(id);
    if (!berita) {
      throw new NotFoundError('Berita not found');
    }

    // Delete image from Cloudinary
    const publicId = berita.gambarUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await this.beritaRepository.delete(id);

    // Clear related caches
    await Promise.all([
      this.redisService.delete('berita:all'),
      this.redisService.delete(`berita:${berita.slug}`),
      this.redisService.delete('berita:highlighted')
    ]);
  }
}