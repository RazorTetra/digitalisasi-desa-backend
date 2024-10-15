// src/interfaces/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import { UserUseCase } from '../../application/use-cases/user/UserUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

const createUserSchema = z.object({
  namaDepan: z.string().min(1),
  namaBelakang: z.string().min(1),
  kelas: z.string().optional(),
  nomorHp: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'SISWA']).optional(),
});

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userUseCase.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const newUser = await userUseCase.createUser(validatedData);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).json({ error: 'Email already exists' });
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};