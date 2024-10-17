// src/infrastructure/security/TokenCleanup.ts

import { Response } from 'express';

export const clearExpiredToken = (res: Response): void => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const handleTokenError = (error: Error, res: Response): void => {
  if (error.name === 'TokenExpiredError') {
    clearExpiredToken(res);
    res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
  } else {
    res.status(401).json({ error: 'Invalid access token', code: 'INVALID_TOKEN' });
  }
};