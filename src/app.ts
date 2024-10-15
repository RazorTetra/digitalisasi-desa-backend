// src/app.ts

import express from 'express';
import dotenv from 'dotenv';
import { apiV1Router } from './infrastructure/routes/v1';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
import { setupDatabase } from './infrastructure/database/setupDatabase';
import { corsMiddleware } from './infrastructure/config/corsConfig';
import session from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}));

setupDatabase();

app.use('/api/v1', apiV1Router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});