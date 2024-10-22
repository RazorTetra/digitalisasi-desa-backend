// src/infrastructure/routes/v1/suratRoutes.ts

import express from 'express';
import multer from 'multer';
import { 
  getAllFormatSurat,
  createFormatSurat,
  deleteFormatSurat,
} from '../../../interfaces/controllers/suratController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.get('/format', getAllFormatSurat);

router.post(
  '/format',
  authMiddleware,
  adminMiddleware,
  upload.single('file'),
  createFormatSurat
);

router.delete(
  '/format/:id',
  authMiddleware,
  adminMiddleware,
  deleteFormatSurat
);

export { router as suratRouter };