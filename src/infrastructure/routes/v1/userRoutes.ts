// src/infrastructure/routes/v1/userRoutes.ts

import express from 'express';
import { getUsers, createUser } from '../../../interfaces/controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);

export { router as userRouter };