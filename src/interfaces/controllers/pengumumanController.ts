// src/interfaces/controllers/pengumumanController.ts

import { Request, Response, NextFunction } from 'express';
import { PengumumanUseCase } from '../../application/use-cases/pengumuman/PengumumanUseCase';
import { PengumumanRepository } from '../../infrastructure/repositories/PengumumanRepository';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const pengumumanRepository = new PengumumanRepository();
const pengumumanUseCase = new PengumumanUseCase(pengumumanRepository);

const pengumumanSchema = z.object({
  judul: z.string().min(1),
  isi: z.string().min(1),
  tanggal: z.string().datetime(),
  kategoriId: z.string().uuid(),
});
export const getPengumuman = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pengumuman = await pengumumanUseCase.getPengumuman();
    res.json(pengumuman);
  } catch (error) {
    next(error);
  }
};

export const getPengumumanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const pengumuman = await pengumumanUseCase.getPengumumanById(id);
    res.json(pengumuman);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const createPengumuman = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = pengumumanSchema.parse(req.body);
      const newPengumuman = await pengumumanUseCase.createPengumuman({
        judul: validatedData.judul,
        isi: validatedData.isi,
        tanggal: new Date(validatedData.tanggal),
        kategori: { connect: { id: validatedData.kategoriId } }
      });
      res.status(201).json(newPengumuman);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid input', details: error.errors });
      } else {
        next(error);
      }
    }
  };
  
  export const updatePengumuman = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedData = pengumumanSchema.partial().parse(req.body);
      const updateData: Prisma.PengumumanUpdateInput = {
        judul: validatedData.judul,
        isi: validatedData.isi,
        tanggal: validatedData.tanggal ? new Date(validatedData.tanggal) : undefined,
      };
      if (validatedData.kategoriId) {
        updateData.kategori = { connect: { id: validatedData.kategoriId } };
      }
      const updatedPengumuman = await pengumumanUseCase.updatePengumuman(id, updateData);
      res.json(updatedPengumuman);
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

export const deletePengumuman = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await pengumumanUseCase.deletePengumuman(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};