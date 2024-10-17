// src/infrastructure/routes/v1/authRoutes.ts

import express from 'express';
import { login, logout, register, registerAdmin } from '../../../interfaces/controllers/authController';
import { adminMiddleware } from '../../middlewares/adminMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/register-admin', authMiddleware, adminMiddleware, registerAdmin);

export { router as authRouter };