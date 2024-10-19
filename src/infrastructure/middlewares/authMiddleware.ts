// src/infrastructure/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { Jwt } from '../security/Jwt';
import { UserPayload } from '../../types/auth';
import { handleTokenError } from '../security/TokenCleanup';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const jwt = new Jwt();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ error: 'Access token not found', code: 'TOKEN_MISSING' });
    return;
  }

  try {
    const payload = await jwt.verifyAccessToken(accessToken);
    req.user = payload as UserPayload;
    next();
  } catch (error) {
    handleTokenError(error as Error, res);
  }
};