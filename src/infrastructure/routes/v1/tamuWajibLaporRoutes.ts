// src/infrastructure/routes/v1/tamuWajibLaporRoutes.ts

import express from 'express';
import {
  createLaporan,
  getPublicStatus,
  getRecentStatuses,
  getMySubmissions,
  getAllLaporan,
  getLaporanById,
  updateStatus,
  deleteLaporan
} from '../../../interfaces/controllers/tamuWajibLaporController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

// Public routes
router.post('/', createLaporan);
router.get('/status/:trackingCode', getPublicStatus);
router.get('/recent', getRecentStatuses);
router.get('/my-submissions', getMySubmissions);

// Protected routes (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllLaporan);
router.get('/:id', authMiddleware, adminMiddleware, getLaporanById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteLaporan);

export { router as tamuWajibLaporRouter };