// src/interfaces/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../application/use-cases/auth/AuthUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AuthenticationError } from '../../common/error/AuthenticationError';
import { z } from 'zod';

const userRepository = new UserRepository();
const authUseCase = new AuthUseCase(userRepository);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { accessToken } = await authUseCase.login(email, password);
    
    // Set the access token in an HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
    } else if (error instanceof AuthenticationError) {
      res.status(401).json({ error: error.message });
    } else {
      next(error);
    }
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authUseCase.logout();

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
      });
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};