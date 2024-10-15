// src/infrastructure/routes/v1/protectedRoutes.ts

import express, { Request, Response } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export { router as protectedRouter };