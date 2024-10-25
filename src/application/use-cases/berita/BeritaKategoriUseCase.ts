// src/application/use-cases/berita/BeritaKategoriUseCase.ts

import { BeritaKategoriRepository } from '../../../infrastructure/repositories/BeritaKategoriRepository';
import { BeritaKategori, Prisma } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';
import { RedisService } from '../../../infrastructure/config/redisConfig';
import slugify from 'slugify';

export class BeritaKategoriUseCase {
  private readonly CACHE_KEY = 'berita-kategori:all';
  private readonly CACHE_TTL = 86400; // 1 day

  constructor(
    private beritaKategoriRepository: BeritaKategoriRepository,
    private redisService: RedisService
  ) {}

  private generateSlug(nama: string): string {
    return slugify(nama, {
      lower: true,
      strict: true
    });
  }

  async getAllKategori(): Promise<BeritaKategori[]> {
    const cachedData = await this.redisService.get<BeritaKategori[]>(this.CACHE_KEY);
    
    if (cachedData) {
      return cachedData;
    }

    const kategori = await this.beritaKategoriRepository.findMany();
    await this.redisService.set(this.CACHE_KEY, kategori, this.CACHE_TTL);
    
    return kategori;
  }

  async getKategoriById(id: string): Promise<BeritaKategori> {
    const kategori = await this.beritaKategoriRepository.findById(id);
    if (!kategori) {
      throw new NotFoundError('Kategori not found');
    }
    return kategori;
  }

  async getKategoriBySlug(slug: string): Promise<BeritaKategori> {
    const kategori = await this.beritaKategoriRepository.findBySlug(slug);
    if (!kategori) {
      throw new NotFoundError('Kategori not found');
    }
    return kategori;
  }

  async createKategori(data: Omit<Prisma.BeritaKategoriCreateInput, 'slug'>): Promise<BeritaKategori> {
    const slug = this.generateSlug(data.nama);
    
    const kategori = await this.beritaKategoriRepository.create({
      ...data,
      slug,
    });

    await this.redisService.delete(this.CACHE_KEY);
    return kategori;
  }

  async updateKategori(
    id: string, 
    data: Omit<Prisma.BeritaKategoriUpdateInput, 'slug'>
  ): Promise<BeritaKategori> {
    const kategori = await this.beritaKategoriRepository.findById(id);
    if (!kategori) {
      throw new NotFoundError('Kategori not found');
    }

    const slug = data.nama ? this.generateSlug(data.nama as string) : kategori.slug;

    const updatedKategori = await this.beritaKategoriRepository.update(id, {
      ...data,
      slug,
    });

    await this.redisService.delete(this.CACHE_KEY);
    return updatedKategori;
  }

  async deleteKategori(id: string): Promise<void> {
    const kategori = await this.beritaKategoriRepository.findById(id);
    if (!kategori) {
      throw new NotFoundError('Kategori not found');
    }

    await this.beritaKategoriRepository.delete(id);
    await this.redisService.delete(this.CACHE_KEY);
  }
}