// src/infrastructure/routes/v1/authRoutes.ts

import express from 'express';
import { login, logout } from '../../../interfaces/controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

export { router as authRouter };