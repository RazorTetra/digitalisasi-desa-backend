// src/interfaces/controllers/tamuWajibLaporController.ts

import { Request, Response, NextFunction } from 'express';
import { TamuWajibLaporUseCase } from '../../application/use-cases/tamu-wajib-lapor/TamuWajibLaporUseCase';
import { TamuWajibLaporRepository } from '../../infrastructure/repositories/TamuWajibLaporRepository';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

const tamuWajibLaporRepository = new TamuWajibLaporRepository();
const tamuWajibLaporUseCase = new TamuWajibLaporUseCase(tamuWajibLaporRepository);

const tamuWajibLaporSchema = z.object({
  nama: z.string().min(2),
  nik: z.string().length(16),
  alamatAsal: z.string().min(5),
  tujuan: z.string().min(2),
  lamaMenginap: z.string().min(1),
  tempatMenginap: z.string().min(5),
  nomorTelepon: z.string().min(10),
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  statusMessage: z.string().optional(),
});

// Public Controllers
export const createLaporan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = tamuWajibLaporSchema.parse(req.body);
    const result = await tamuWajibLaporUseCase.createLaporan(validatedData);
    
    res.cookie('twl_tracking', result.trackingCode, {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      path: '/'
    });

    res.status(201).json({
      message: 'Laporan berhasil dikirim',
      trackingCode: result.trackingCode,
      status: result.status,
      createdAt: result.createdAt
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const getPublicStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { trackingCode } = req.params;
    const status = await tamuWajibLaporUseCase.getPublicStatus(trackingCode);
    res.status(200).json(status);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const getRecentStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const statuses = await tamuWajibLaporUseCase.getRecentPublicStatuses(limit);
    res.status(200).json(statuses);
  } catch (error) {
    next(error);
  }
};

export const getMySubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trackingCode = req.cookies.twl_tracking;
    if (!trackingCode) {
      res.status(404).json({ message: 'Tidak ada riwayat pengiriman form' });
      return;
    }

    const status = await tamuWajibLaporUseCase.getPublicStatus(trackingCode);
    res.status(200).json({
      trackingCode,
      ...status
    });
  } catch (error) {
    next(error);
  }
};

// Admin Controllers
export const getAllLaporan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const laporan = await tamuWajibLaporUseCase.getAllLaporan();
    res.status(200).json(laporan);
  } catch (error) {
    next(error);
  }
};

export const getLaporanById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const laporan = await tamuWajibLaporUseCase.getLaporanById(id);
    res.status(200).json(laporan);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateStatusSchema.parse(req.body);
    const updatedLaporan = await tamuWajibLaporUseCase.updateStatus(
      id,
      validatedData.status,
      validatedData.statusMessage
    );
    res.status(200).json(updatedLaporan);
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

export const deleteLaporan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await tamuWajibLaporUseCase.deleteLaporan(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};