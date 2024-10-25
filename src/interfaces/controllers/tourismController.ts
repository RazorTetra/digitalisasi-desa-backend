// src/interfaces/controllers/tourismController.ts

import { Request, Response, NextFunction } from 'express';
import { TourismUseCase } from '../../application/use-cases/tourism/TourismUseCase';
import { TourismRepository } from '../../infrastructure/repositories/TourismRepository';
import { NotFoundError } from '../../common/error/NotFoundError';
import { z } from 'zod';

// Extend Express Request type with multer
declare module 'express-serve-static-core' {
  interface Request {
    files?: {
      [fieldname: string]: Express.Multer.File[];
    };
  }
}

const tourismRepository = new TourismRepository();
const tourismUseCase = new TourismUseCase(tourismRepository);

const tourismSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
});

export const getAllTourism = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tourism = await tourismUseCase.getAllTourism();
    res.json(tourism);
  } catch (error) {
    next(error);
  }
};

export const getTourismById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const tourism = await tourismUseCase.getTourismById(id);
    res.json(tourism);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const createTourism = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files?.mainImage?.[0] || !req.files?.gallery?.length) {
      res.status(400).json({ error: 'Main image and gallery images are required' });
      return;
    }

    const validatedData = tourismSchema.parse(req.body);
    
    const mainImage = req.files.mainImage[0];
    const galleryImages = req.files.gallery;

    const tourism = await tourismUseCase.createTourism(
      validatedData,
      mainImage,
      galleryImages
    );

    res.status(201).json(tourism);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateTourism = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = tourismSchema.partial().parse(req.body);
    
    const mainImage = req.files?.mainImage?.[0];
    const galleryImages = req.files?.gallery;

    const tourism = await tourismUseCase.updateTourism(
      id,
      validatedData,
      mainImage,
      galleryImages
    );

    res.json(tourism);
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

export const deleteTourism = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await tourismUseCase.deleteTourism(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};