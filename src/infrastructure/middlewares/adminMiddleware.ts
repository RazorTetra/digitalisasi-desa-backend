// src/infrastructure/middlewares/adminMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { UserPayload } from '../../types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === Role.ADMIN) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};