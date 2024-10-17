// src/interfaces/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import { UserUseCase } from '../../application/use-cases/user/UserUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { NotFoundError } from '../../common/error/NotFoundError';

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

const userSchema = z.object({
  namaDepan: z.string().min(1),
  namaBelakang: z.string().min(1),
  nomorHp: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userUseCase.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userUseCase.getUserById(id);
    res.json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userSchema.parse(req.body);
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

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = userSchema.partial().parse(req.body);
    const updatedUser = await userUseCase.updateUser(id, validatedData);
    res.json(updatedUser);
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

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await userUseCase.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      next(error);
    }
  }
};