// src/interfaces/controllers/suratController.ts

import { Request, Response, NextFunction } from "express";
import { FormatSuratUseCase } from "../../application/use-cases/surat/FormatSuratUseCase";
import { FormatSuratRepository } from "../../infrastructure/repositories/FormatSuratRepository";
import { NotFoundError } from "../../common/error/NotFoundError";
import { z } from "zod";

const formatSuratRepository = new FormatSuratRepository();
const formatSuratUseCase = new FormatSuratUseCase(formatSuratRepository);

const createFormatSuratSchema = z.object({
  nama: z.string().min(1),
});

const yearQuerySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/)
    .transform(Number)
    .optional(),
});

export const getAllFormatSurat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const formats = await formatSuratUseCase.getAllFormatsWithStats();
    const formattedFormats = formats.map((format) => ({
      ...format,
      downloadUrl: format.fileUrl,
      totalDownloads: Number(format.totalDownloads),
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
      res.status(400).json({ error: "File template is required" });
      return;
    }

    const validatedData = createFormatSuratSchema.parse(req.body);
    const newFormat = await formatSuratUseCase.createFormatSurat(
      validatedData.nama,
      req.file
    );

    res.status(201).json({
      ...newFormat,
      downloadUrl: newFormat.fileUrl,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: err.errors });
      return;
    }

    if (err instanceof Error && err.message.includes("Invalid file type")) {
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

// New controller methods for download tracking

export const trackDownload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await formatSuratUseCase.trackDownload(id);
    res.status(200).json({ message: "Download tracked successfully" });
  } catch (err: unknown) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
};

export const getFormatSuratStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { year } = yearQuerySchema.parse(req.query);

    const stats = await formatSuratUseCase.getMonthlyDownloads(id, year);

    // Ensure all numbers are properly converted from BigInt
    const safeStats = stats.map((stat) => ({
      ...stat,
      downloadCount: Number(stat.downloadCount),
    }));

    res.json(safeStats);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid year format" });
      return;
    }
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
};
