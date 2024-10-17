// src/infrastructure/routes/v1/userRoutes.ts

import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../../../interfaces/controllers/userController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export { router as userRouter };