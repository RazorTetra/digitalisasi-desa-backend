// src/infrastructure/middlewares/errorHandler.ts

import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};