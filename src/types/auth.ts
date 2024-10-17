// src/types/auth.ts

import { Role } from "@prisma/client";

export interface UserPayload {
  id: string;
  nama: string;
  email: string;
  is_super: boolean;
  role: Role;
}