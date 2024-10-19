// src/interfaces/controllers/villageController.ts

import { Request, Response, NextFunction } from "express";
import { VillageUseCase } from "../../application/use-cases/village/VillageUseCase";
import { VillageRepository } from "../../infrastructure/repositories/VillageRepository";
import { NotFoundError } from "../../common/error/NotFoundError";
import { z } from "zod";

const villageRepository = new VillageRepository();
const villageUseCase = new VillageUseCase(villageRepository);

const villageInfoSchema = z.object({
  history: z.string().min(1),
});

const villageStructureSchema = z.object({
  position: z.string().min(1),
  name: z.string().min(1),
});

const socialMediaUpdateSchema = z.object({
  url: z.string().url(),
});

export const getVillageInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const info = await villageUseCase.getVillageInfo();
    res.json(info);
  } catch (error) {
    next(error);
  }
};

export const updateVillageInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = villageInfoSchema.parse(req.body);
    const updatedInfo = await villageUseCase.updateVillageInfo(validatedData);
    res.json(updatedInfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      next(error);
    }
  }
};

export const getVillageStructure = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const structure = await villageUseCase.getVillageStructure();
    res.json(structure);
  } catch (error) {
    next(error);
  }
};

export const createVillageStructure = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = villageStructureSchema.parse(req.body);
    const newStructure = await villageUseCase.createVillageStructure(
      validatedData
    );
    res.status(201).json(newStructure);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      next(error);
    }
  }
};

export const updateVillageStructure = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = villageStructureSchema.parse(req.body);
    const updatedStructure = await villageUseCase.updateVillageStructure(
      id,
      validatedData
    );
    res.json(updatedStructure);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteVillageStructure = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await villageUseCase.deleteVillageStructure(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getGallery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gallery = await villageUseCase.getGallery();
    res.json(gallery);
  } catch (error) {
    next(error);
  }
};

export const addGalleryImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
  imageUrl: string,
  description?: string
): Promise<void> => {
  try {
    const newImage = await villageUseCase.addGalleryImage(
      imageUrl,
      description
    );
    res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await villageUseCase.deleteGalleryImage(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getSocialMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const socialMedia = await villageUseCase.getSocialMedia();
    res.json(socialMedia);
  } catch (error) {
    next(error);
  }
};

export const updateSocialMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = socialMediaUpdateSchema.parse(req.body);
    const updatedSocialMedia = await villageUseCase.updateSocialMedia(
      id,
      validatedData
    );
    res.json(updatedSocialMedia);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      next(error);
    }
  }
};
