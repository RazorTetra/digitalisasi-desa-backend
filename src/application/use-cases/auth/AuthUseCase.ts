// src/application/use-cases/auth/AuthUseCase.ts

import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { Jwt, JwtSignPayload } from "../../../infrastructure/security/Jwt";
import { AuthenticationError } from "../../../common/error/AuthenticationError";
import { Bcrypt } from "../../../infrastructure/security/Bcrypt";
import { User, Prisma, Role } from "@prisma/client";

export class AuthUseCase {
  private bcrypt: Bcrypt;
  private jwt: Jwt;

  constructor(private userRepository: UserRepository) {
    this.bcrypt = new Bcrypt();
    this.jwt = new Jwt();
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string }> {
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

    return { accessToken };
  }

  async register(userData: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AuthenticationError("Email sudah terdaftar");
    }

    const hashedPassword = await this.bcrypt.hash(userData.password);
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }

  async registerAdmin(
    userData: Omit<Prisma.UserCreateInput, "role">
  ): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AuthenticationError("Email sudah terdaftar");
    }

    const hashedPassword = await this.bcrypt.hash(userData.password);
    const newAdmin = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    return newAdmin;
  }

  async logout(): Promise<void> {
    // No need to do anything here since we're not storing tokens
  }
}
