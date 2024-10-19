// src/infrastructure/routes/v1/kategoriRoutes.ts

import express from 'express';
import { getKategori, getKategoriById, createKategori, updateKategori, deleteKategori } from '../../../interfaces/controllers/kategoriController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

// Public routes
router.get('/', getKategori);
router.get('/:id', getKategoriById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, createKategori);
router.put('/:id', authMiddleware, adminMiddleware, updateKategori);
router.delete('/:id', authMiddleware, adminMiddleware, deleteKategori);

export { router as kategoriRouter };