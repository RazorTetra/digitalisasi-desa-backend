// src/types/submission.ts

import { z } from 'zod';

export const SubmissionStatus = {
  DIPROSES: 'DIPROSES',
  SELESAI: 'SELESAI'
} as const;

export type SubmissionStatus = typeof SubmissionStatus[keyof typeof SubmissionStatus];

export interface SubmissionBase {
  id: string;
  pengirim: string;
  whatsapp: string;
  kategori: string;
  keterangan: string;
  fileUrl: string;    
  fileName: string;   
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const submissionSchema = z.object({
  pengirim: z.string().min(2, 'Nama pengirim minimal 2 karakter'),
  whatsapp: z
    .string()
    .regex(/^([0-9]{10,13})$/, 'Nomor WhatsApp harus 10-13 digit')
    .transform(val => val.startsWith('0') ? `62${val.slice(1)}` : val),
  kategori: z.string().min(1, 'Kategori harus diisi')
    .transform(val => val.toLowerCase()),
  keterangan: z.string().min(10, 'Keterangan minimal 10 karakter'),
});

export const updateStatusSchema = z.object({
  status: z.enum([SubmissionStatus.DIPROSES, SubmissionStatus.SELESAI])
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

export interface SubmissionStats {
  kategori: string;
  total: number;
  statusCount: {
    [key in SubmissionStatus]: number;
  };
}