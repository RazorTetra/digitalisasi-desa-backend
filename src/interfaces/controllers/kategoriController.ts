// src/interfaces/controllers/kategoriController.ts

import { Request, Response, NextFunction } from 'express';
import { KategoriUseCase } from '../../application/use-cases/kategori/KategoriUseCase';
import { KategoriRepository } from '../../infrastructure/repositories/KategoriRepository';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

const kategoriRepository = new KategoriRepository();
const kategoriUseCase = new KategoriUseCase(kategoriRepository);

const kategoriSchema = z.object({
  nama: z.string().min(1),
});

export const getKategori = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kategori = await kategoriUseCase.getKategori();
    res.json(kategori);
  } catch (error) {
    next(error);
  }
};

export const getKategoriById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const kategori = await kategoriUseCase.getKategoriById(id);
    res.json(kategori);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const createKategori = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = kategoriSchema.parse(req.body);
    const newKategori = await kategoriUseCase.createKategori(validatedData);
    res.status(201).json(newKategori);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateKategori = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = kategoriSchema.parse(req.body);
    const updatedKategori = await kategoriUseCase.updateKategori(id, validatedData);
    res.json(updatedKategori);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteKategori = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await kategoriUseCase.deleteKategori(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};