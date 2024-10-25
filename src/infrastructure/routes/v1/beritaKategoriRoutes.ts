// src/infrastructure/routes/v1/beritaKategoriRoutes.ts

import express from 'express';
import {
  getAllKategori,
  getKategoriById,
  getKategoriBySlug,
  createKategori,
  updateKategori,
  deleteKategori
} from '../../../interfaces/controllers/beritaKategoriController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllKategori);
router.get('/id/:id', getKategoriById);
router.get('/:slug', getKategoriBySlug);

// Protected routes (admin only)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  createKategori
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  updateKategori
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteKategori
);

export { router as beritaKategoriRouter };