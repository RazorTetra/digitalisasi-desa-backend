// src/application/use-cases/auth/AuthUseCase.ts

import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { Jwt, JwtSignPayload } from '../../../infrastructure/security/Jwt';
import { AuthenticationError } from '../../../common/error/AuthenticationError';
import { Bcrypt } from '../../../infrastructure/security/Bcrypt';

export class AuthUseCase {
  private bcrypt: Bcrypt;
  private jwt: Jwt;

  constructor(private userRepository: UserRepository) {
    this.bcrypt = new Bcrypt();
    this.jwt = new Jwt();
  }

  async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Email atau password salah');
    }

    await this.bcrypt.compare(password, user.password);

    const payload: JwtSignPayload = {
      id: user.id,
      nama: `${user.namaDepan} ${user.namaBelakang}`,
      email: user.email,
      is_super: user.role === 'ADMIN',
    };

    const accessToken = await this.jwt.createAccessToken(payload);
    const refreshToken = await this.jwt.createRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const payload = await this.jwt.verifyRefreshToken(refreshToken);
    const newAccessToken = await this.jwt.createAccessToken(payload as JwtSignPayload);
    return newAccessToken;
  }
}