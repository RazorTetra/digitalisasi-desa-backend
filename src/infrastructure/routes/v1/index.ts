// src/infrastructure/routes/v1/index.ts

import express from 'express';
import { userRouter } from './userRoutes';
import { authRouter } from './authRoutes';
import { protectedRouter } from './protectedRoutes';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/protected', protectedRouter);

export { router as apiV1Router };