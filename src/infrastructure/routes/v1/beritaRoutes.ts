// src/infrastructure/routes/v1/beritaRoutes.ts

import express from 'express';
import multer from 'multer';
import {
  getAllBerita,
  getBeritaBySlug,
  getHighlightedBerita,
  createBerita,
  updateBerita,
  deleteBerita
} from '../../../interfaces/controllers/beritaController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

// Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File harus berupa gambar'));
    }
  }
});

// Public routes
router.get('/', getAllBerita);
router.get('/highlighted', getHighlightedBerita);
router.get('/:slug', getBeritaBySlug);

// Protected routes (admin only)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.single('gambar'),
  createBerita
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  upload.single('gambar'),
  updateBerita
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteBerita
);

export { router as beritaRouter };