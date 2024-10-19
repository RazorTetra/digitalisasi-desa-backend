// src/app.ts

import express from 'express';
import dotenv from 'dotenv';
import { apiV1Router } from './infrastructure/routes/v1';
import { v2 as cloudinary } from 'cloudinary';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
import { setupDatabase } from './infrastructure/database/setupDatabase';
import { corsMiddleware } from './infrastructure/config/corsConfig';
import session from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

// For local development only
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}

export default app;