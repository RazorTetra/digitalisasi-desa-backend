// src/infrastructure/repositories/RefreshTokenRepository.ts

import { PrismaClient, RefreshToken, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class RefreshTokenRepository {
  async create(userId: string, token: string): Promise<RefreshToken> {
    if (token.length > 500) {
      throw new Error('Token length exceeds maximum allowed length of 500 characters');
    }

    try {
      return await prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('A refresh token for this user already exists');
        }
      }
      throw error;
    }
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async delete(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}