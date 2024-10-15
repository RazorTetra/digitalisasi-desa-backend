// src/application/use-cases/auth/AuthUseCase.ts

import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { RefreshTokenRepository } from "../../../infrastructure/repositories/RefreshTokenRepository";
import { Jwt, JwtSignPayload } from "../../../infrastructure/security/Jwt";
import { AuthenticationError } from "../../../common/error/AuthenticationError";
import { Bcrypt } from "../../../infrastructure/security/Bcrypt";

export class AuthUseCase {
  private bcrypt: Bcrypt;
  private jwt: Jwt;

  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository
  ) {
    this.bcrypt = new Bcrypt();
    this.jwt = new Jwt();
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("Email atau password salah");
    }

    await this.bcrypt.compare(password, user.password);

    const payload: JwtSignPayload = {
      id: user.id,
      nama: `${user.namaDepan} ${user.namaBelakang}`,
      email: user.email,
      is_super: user.role === "ADMIN",
    };

    const accessToken = await this.jwt.createAccessToken(payload);
    const refreshToken = await this.jwt.createRefreshToken(payload);

    // Save refresh token to database
    await this.refreshTokenRepository.create(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(
    oldRefreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwt.verifyRefreshToken(oldRefreshToken);
      const storedRefreshToken = await this.refreshTokenRepository.findByToken(
        oldRefreshToken
      );

      if (!storedRefreshToken) {
        throw new AuthenticationError("Refresh token not found in database");
      }

      if (storedRefreshToken.userId !== payload.id) {
        throw new AuthenticationError("Refresh token does not match user");
      }

      // Delete old refresh token
      await this.refreshTokenRepository.delete(oldRefreshToken);

      // Create new tokens
      const newPayload: JwtSignPayload = {
        id: payload.id,
        nama: payload.nama,
        email: payload.email,
        is_super: payload.is_super,
      };

      const newAccessToken = await this.jwt.createAccessToken(newPayload);
      const newRefreshToken = await this.jwt.createRefreshToken(newPayload);

      // Save new refresh token to database
      await this.refreshTokenRepository.create(payload.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Error in refreshToken:", error);
      if (error instanceof Error) {
        throw new AuthenticationError(
          `Invalid refresh token: ${error.message}`
        );
      } else {
        throw new AuthenticationError("Invalid refresh token");
      }
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.delete(refreshToken);
  }
}
