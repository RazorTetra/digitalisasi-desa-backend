// src/infrastructure/routes/v1/pengumumanRoutes.ts

import express from 'express';
import { getPengumuman, getPengumumanById, createPengumuman, updatePengumuman, deletePengumuman } from '../../../interfaces/controllers/pengumumanController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

// Public routes
router.get('/', getPengumuman);
router.get('/:id', getPengumumanById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, createPengumuman);
router.put('/:id', authMiddleware, adminMiddleware, updatePengumuman);
router.delete('/:id', authMiddleware, adminMiddleware, deletePengumuman);

export { router as pengumumanRouter };