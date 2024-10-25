// src/interfaces/controllers/heroBannerController.ts

import { Request, Response, NextFunction } from 'express';
import { HeroBannerUseCase } from '../../application/use-cases/hero-banner/HeroBannerUseCase';
import { HeroBannerRepository } from '../../infrastructure/repositories/HeroBannerRepository';

const heroBannerRepository = new HeroBannerRepository();
const heroBannerUseCase = new HeroBannerUseCase(heroBannerRepository);

export const getBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const banner = await heroBannerUseCase.getBanner();
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const banner = await heroBannerUseCase.updateBanner(req.file || null);
    res.json(banner);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid file type')) {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
};