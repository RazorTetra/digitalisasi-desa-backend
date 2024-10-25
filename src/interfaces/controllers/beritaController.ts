// src/interfaces/controllers/beritaController.ts

import { Request, Response, NextFunction } from 'express';
import { BeritaUseCase } from '../../application/use-cases/berita/BeritaUseCase';
import { BeritaRepository } from '../../infrastructure/repositories/BeritaRepository';
import { getRedisService } from '../../infrastructure/config/redisConfig';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

const beritaRepository = new BeritaRepository();
const beritaUseCase = new BeritaUseCase(beritaRepository, getRedisService());

const beritaSchema = z.object({
  judul: z.string().min(1, 'Judul harus diisi'),
  ringkasan: z.string().min(1, 'Ringkasan harus diisi'),
  isi: z.string().min(1, 'Isi berita harus diisi'),
  penulis: z.string().min(1, 'Penulis harus diisi'),
  tanggal: z.string().datetime(),
  isHighlight: z.boolean().optional(),
  kategoriIds: z.array(z.string().uuid()).min(1, 'Minimal satu kategori harus dipilih'),
});


const updateBeritaSchema = beritaSchema.partial();

export const getAllBerita = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const berita = await beritaUseCase.getAllBerita();
    res.json(berita);
  } catch (error) {
    next(error);
  }
};

export const getBeritaBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    const berita = await beritaUseCase.getBeritaBySlug(slug);
    res.json(berita);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const getHighlightedBerita = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const berita = await beritaUseCase.getHighlightedBerita();
    res.json(berita);
  } catch (error) {
    next(error);
  }
};

export const createBerita = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Gambar berita harus diunggah' });
      return;
    }

    const validatedData = beritaSchema.parse({
      ...req.body,
      kategoriIds: JSON.parse(req.body.kategoriIds),
      isHighlight: req.body.isHighlight === 'true'
    });

    const berita = await beritaUseCase.createBerita({
      ...validatedData,
      file: req.file
    });

    res.status(201).json(berita);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Data tidak valid', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateBerita = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateBeritaSchema.parse({
      ...req.body,
      kategoriIds: req.body.kategoriIds ? JSON.parse(req.body.kategoriIds) : undefined,
      isHighlight: req.body.isHighlight ? req.body.isHighlight === 'true' : undefined
    });

    const berita = await beritaUseCase.updateBerita(id, {
      ...validatedData,
      file: req.file
    });

    res.json(berita);
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

export const deleteBerita = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await beritaUseCase.deleteBerita(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};