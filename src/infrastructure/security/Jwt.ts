// src/infrastructure/security/Jwt.ts

import jwt from 'jsonwebtoken';

export type JwtSignPayload = {
  id: string;
  nama: string;
  email: string;
  is_super: boolean;
}

export class Jwt {
  constructor(
    private readonly accessTokenKey: string = process.env.ACCESS_TOKEN_KEY as string,
    private readonly refreshTokenKey: string = process.env.REFRESH_TOKEN_KEY as string,
    private readonly accessTokenAge: string = process.env.ACCESS_TOKEN_AGE as string,
    private readonly refreshTokenAge: string = process.env.REFRESH_TOKEN_AGE as string
  ) {}

  async createAccessToken(payload: JwtSignPayload): Promise<string> {
    return jwt.sign(
      this.mapJwtSignPayload(payload),
      this.accessTokenKey,
      { expiresIn: this.accessTokenAge }
    );
  }

  async verifyAccessToken(token: string): Promise<jwt.JwtPayload> {
    return jwt.verify(token, this.accessTokenKey) as jwt.JwtPayload;
  }

  async createRefreshToken(payload: JwtSignPayload): Promise<string> {
    return jwt.sign(
      this.mapJwtSignPayload(payload),
      this.refreshTokenKey,
      { expiresIn: this.refreshTokenAge }
    );
  }

  async verifyRefreshToken(token: string): Promise<jwt.JwtPayload> {
    return jwt.verify(token, this.refreshTokenKey) as jwt.JwtPayload;
  }

  async decode(token: string): Promise<jwt.JwtPayload | null> {
    return jwt.decode(token) as jwt.JwtPayload | null;
  }

  private mapJwtSignPayload(payload: JwtSignPayload): JwtSignPayload {
    return {
      id: payload.id,
      nama: payload.nama,
      email: payload.email,
      is_super: payload.is_super,
    };
  }
}