// src/interfaces/controllers/submissionController.ts

import { Request, Response, NextFunction } from "express";
import { SubmissionUseCase } from "../../application/use-cases/submission/SubmissionUseCase";
import { SubmissionRepository } from "../../infrastructure/repositories/SubmissionRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { submissionSchema, updateStatusSchema } from "../../types/submission";
import { NotFoundError } from "../../common/error/NotFoundError";
import { createRateLimiter } from "../../infrastructure/middlewares/rateLimitMiddleware";
import { z } from "zod";

const submissionRepository = new SubmissionRepository();
const userRepository = new UserRepository();

const submissionUseCase = new SubmissionUseCase(
  submissionRepository,
  userRepository
);

export const submissionLimiter = createRateLimiter(60 * 1000, 1); // 1 request per minute

export const submitDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "File surat wajib diunggah" });
      return;
    }

    const validatedData = submissionSchema.parse(req.body);
    const result = await submissionUseCase.submit(validatedData, req.file);

    res.status(201).json({
      message: "Surat berhasil dikirim",
      id: result.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Data tidak valid",
        details: error.errors,
      });
      return;
    }

    if (
      error instanceof Error &&
      (error.message.includes("Format file tidak valid") ||
        error.message.includes("Ukuran file"))
    ) {
      res.status(400).json({ error: error.message });
      return;
    }

    next(error);
  }
};

export const getSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const submission = await submissionUseCase.getSubmission(id);
    res.json(submission);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getAllSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const submissions = await submissionUseCase.getAllSubmissions();
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await submissionUseCase.deleteSubmission(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await submissionUseCase.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByWhatsapp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { whatsapp } = req.params;
    const submissions = await submissionUseCase.getSubmissionsByWhatsapp(
      whatsapp
    );
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export const updateSubmissionStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = updateStatusSchema.parse(req.body);
      
      await submissionUseCase.updateStatus(id, validatedData.status);
      
      res.json({ 
        message: 'Status berhasil diperbarui',
        status: validatedData.status 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Status tidak valid',
          details: error.errors 
        });
        return;
      }
      
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      
      next(error);
    }
  };
