// src/interfaces/controllers/suratController.ts

import { Request, Response, NextFunction } from 'express';
import { FormatSuratUseCase } from '../../application/use-cases/surat/FormatSuratUseCase';
import { FormatSuratRepository } from '../../infrastructure/repositories/FormatSuratRepository';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

const formatSuratRepository = new FormatSuratRepository();
const formatSuratUseCase = new FormatSuratUseCase(formatSuratRepository);

const createFormatSuratSchema = z.object({
  nama: z.string().min(1)
});

export const getAllFormatSurat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const formats = await formatSuratUseCase.getAllFormatSurat();
    const formattedFormats = formats.map(format => ({
      ...format,
      downloadUrl: format.fileUrl
    }));
    res.json(formattedFormats);
  } catch (err: unknown) {
    next(err);
  }
};

export const createFormatSurat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File template is required' });
      return;
    }

    const validatedData = createFormatSuratSchema.parse(req.body);
    const newFormat = await formatSuratUseCase.createFormatSurat(
      validatedData.nama,
      req.file
    );

    res.status(201).json({
      ...newFormat,
      downloadUrl: newFormat.fileUrl
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: err.errors });
      return;
    }
    
    if (err instanceof Error && err.message.includes('Invalid file type')) {
      res.status(400).json({ error: err.message });
      return;
    }
    
    next(err);
  }
};

export const deleteFormatSurat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await formatSuratUseCase.deleteFormatSurat(id);
    res.status(204).send();
  } catch (err: unknown) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
};