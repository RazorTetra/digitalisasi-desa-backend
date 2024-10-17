// src/application/use-cases/user/UserUseCase.ts

import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { User, Prisma } from '@prisma/client';
import { Bcrypt } from '../../../infrastructure/security/Bcrypt';
import { NotFoundError } from '../../../common/error/NotFoundError';

export class UserUseCase {
  private bcrypt: Bcrypt;

  constructor(private userRepository: UserRepository) {
    this.bcrypt = new Bcrypt();
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await this.bcrypt.hash(data.password);
    const userData: Prisma.UserCreateInput = {
      ...data,
      password: hashedPassword,
    };
    return this.userRepository.create(userData);
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (data.password) {
      data.password = await this.bcrypt.hash(data.password as string);
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    await this.userRepository.delete(id);
  }
}