// src/infrastructure/routes/v1/userRoutes.ts

import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../../../interfaces/controllers/userController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { adminMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.post('/', authMiddleware, adminMiddleware, createUser);
router.put('/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export { router as userRouter };