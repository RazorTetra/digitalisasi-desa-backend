// src/infrastructure/routes/v1/authRoutes.ts

import express from 'express';
import { login, refresh } from '../../../interfaces/controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);

export { router as authRouter };