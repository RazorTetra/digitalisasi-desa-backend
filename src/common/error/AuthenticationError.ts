// src/common/error/AuthenticationError.ts

export class AuthenticationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthenticationError';
    }
  }