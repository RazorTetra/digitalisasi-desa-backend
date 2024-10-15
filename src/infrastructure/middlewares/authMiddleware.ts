// src/infrastructure/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { Jwt } from '../security/Jwt';
import { UserPayload } from '../../types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const jwt = new Jwt();

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ error: 'Access token not found' });
    return;
  }

  jwt.verifyAccessToken(accessToken)
    .then((payload) => {
      req.user = payload as UserPayload;
      next();
    })
    .catch((error) => {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Access token expired', shouldRefresh: true });
      } else {
        res.status(401).json({ error: 'Invalid access token' });
      }
    });
};