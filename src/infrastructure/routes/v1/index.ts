// src/infrastructure/routes/v1/index.ts

import express from 'express';
import { userRouter } from './userRoutes';
import { authRouter } from './authRoutes';
import { protectedRouter } from './protectedRoutes';
import { villageRouter } from './villageRoutes';
import { pengumumanRouter } from './pengumumanRoutes';
import { kategoriRouter } from './kategoriRoutes';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/protected', protectedRouter);
router.use('/village', villageRouter);
router.use('/pengumuman', pengumumanRouter);
router.use('/kategori', kategoriRouter);

export { router as apiV1Router };