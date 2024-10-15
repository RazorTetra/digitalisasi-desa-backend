// src/application/use-cases/user/UserUseCase.ts

import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { User, Prisma } from '@prisma/client';
import { Bcrypt } from '../../../infrastructure/security/Bcrypt';

export class UserUseCase {
  private bcrypt: Bcrypt;

  constructor(private userRepository: UserRepository) {
    this.bcrypt = new Bcrypt();
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await this.bcrypt.hash(data.password);

    const userData: Prisma.UserCreateInput = {
      ...data,
      password: hashedPassword,
    };

    return this.userRepository.create(userData);
  }
}