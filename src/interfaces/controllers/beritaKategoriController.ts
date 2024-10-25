// src/interfaces/controllers/beritaKategoriController.ts

import { Request, Response, NextFunction } from 'express';
import { BeritaKategoriUseCase } from '../../application/use-cases/berita/BeritaKategoriUseCase';
import { BeritaKategoriRepository } from '../../infrastructure/repositories/BeritaKategoriRepository';
import { getRedisService } from '../../infrastructure/config/redisConfig';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

const beritaKategoriRepository = new BeritaKategoriRepository();
const beritaKategoriUseCase = new BeritaKategoriUseCase(
  beritaKategoriRepository,
  getRedisService()
);

const kategoriSchema = z.object({
  nama: z.string().min(1, 'Nama kategori harus diisi'),
});

export const getAllKategori = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const kategori = await beritaKategoriUseCase.getAllKategori();
    res.json(kategori);
  } catch (error) {
    next(error);
  }
};

export const getKategoriById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const kategori = await beritaKategoriUseCase.getKategoriById(id);
    res.json(kategori);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const getKategoriBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const kategori = await beritaKategoriUseCase.getKategoriBySlug(slug);
    res.json(kategori);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const createKategori = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = kategoriSchema.parse(req.body);
    const kategori = await beritaKategoriUseCase.createKategori(validatedData);
    res.status(201).json(kategori);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Data tidak valid', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateKategori = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = kategoriSchema.parse(req.body);
    const kategori = await beritaKategoriUseCase.updateKategori(id, validatedData);
    res.json(kategori);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Data tidak valid', details: error.errors });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteKategori = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await beritaKategoriUseCase.deleteKategori(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};