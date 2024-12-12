// src/infrastructure/middlewares/rateLimitMiddleware.ts

import { Request, Response, NextFunction } from 'express';

interface RequestStore {
  [key: string]: number[];
}

const requestStore: RequestStore = {};

export const createRateLimiter = (windowMs: number, maxRequests: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const ipAddress = req.ip || 'unknown';
    
    // Initialize or clean up old requests
    requestStore[ipAddress] = (requestStore[ipAddress] || [])
      .filter(time => now - time < windowMs);
      
    if ((requestStore[ipAddress]?.length || 0) >= maxRequests) {
      res.status(429).json({ 
        error: 'Terlalu banyak pengiriman. Silakan tunggu sebelum mengirim lagi.' 
      });
      return;
    }

    requestStore[ipAddress] = [...(requestStore[ipAddress] || []), now];
    next();
  };
};