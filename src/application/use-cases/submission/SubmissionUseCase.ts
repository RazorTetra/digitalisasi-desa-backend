// src/application/use-cases/submission/SubmissionUseCase.ts

import { SubmissionRepository } from '../../../infrastructure/repositories/SubmissionRepository';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { SubmissionInput, SubmissionStats, SubmissionStatus } from '../../../types/submission';
import { NotFoundError } from '../../../common/error/NotFoundError';
import { v2 as cloudinary } from 'cloudinary';
import { EmailService } from '../../../infrastructure/services/EmailService';
import streamifier from 'streamifier';
import { Role, User } from '@prisma/client';

interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export class SubmissionUseCase {
  private emailService: EmailService;
  private readonly ALLOWED_MIME_TYPES = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  constructor(
    private submissionRepository: SubmissionRepository,
    private userRepository: UserRepository
  ) {
    this.emailService = new EmailService();
  }

  private validateFile(file: UploadedFile): void {
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error('Format file tidak valid. Hanya file .doc dan .docx yang diperbolehkan.');
    }

    if (file.buffer.length > 5 * 1024 * 1024) { // 5MB
      throw new Error('Ukuran file melebihi batas 5MB.');
    }
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
  }

  private async uploadToCloudinary(file: UploadedFile): Promise<{ url: string; filename: string }> {
    this.validateFile(file);
    const sanitizedName = this.sanitizeFileName(file.originalname);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'submissions',
          resource_type: 'raw',
          public_id: sanitizedName
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result!.secure_url,
            filename: sanitizedName
          });
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private async getAdminUsers(): Promise<User[]> {
    const users = await this.userRepository.findMany();
    return users.filter(user => user.role === Role.ADMIN);
  }

  private async notifyAdmins(submission: {
    pengirim: string;
    kategori: string;
    whatsapp: string;
    fileUrl: string;
  }): Promise<void> {
    const adminUsers = await this.getAdminUsers();
    await this.emailService.sendSubmissionNotification(adminUsers, submission);
  }

  async submit(data: SubmissionInput, file: UploadedFile): Promise<{ id: string }> {
    const { url: fileUrl, filename } = await this.uploadToCloudinary(file);

    const submission = await this.submissionRepository.create({
      pengirim: data.pengirim,
      whatsapp: data.whatsapp,
      kategori: data.kategori,
      keterangan: data.keterangan,
      fileUrl,
      fileName: filename
    });

    await this.notifyAdmins({
      pengirim: data.pengirim,
      kategori: data.kategori,
      whatsapp: data.whatsapp,
      fileUrl
    });

    return { id: submission.id };
  }

  async getSubmission(id: string) {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError('Data submission tidak ditemukan');
    }
    return submission;
  }

  async getAllSubmissions() {
    return this.submissionRepository.findAll();
  }

  async deleteSubmission(id: string): Promise<void> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError('Data submission tidak ditemukan');
    }

    const publicId = submission.fileUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (error) {
        console.error('Error saat menghapus file dari Cloudinary:', error);
      }
    }

    await this.submissionRepository.delete(id);
  }

  async getStats(): Promise<SubmissionStats[]> {
    return this.submissionRepository.getStats();
  }

  async getSubmissionsByWhatsapp(whatsapp: string) {
    return this.submissionRepository.findByPengirimWhatsapp(whatsapp);
  }

  async updateStatus(id: string, status: SubmissionStatus): Promise<void> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError('Data submission tidak ditemukan');
    }
  
    await this.submissionRepository.updateStatus(id, status);
      
    // Kirim notifikasi ke pengirim jika status berubah menjadi selesai
    if (status === SubmissionStatus.SELESAI) {
      try {
        await this.emailService.sendStatusUpdateNotification({
          to: submission.whatsapp,
          pengirim: submission.pengirim,
          kategori: submission.kategori
        });
      } catch (error) {
        // Log error tapi jangan throw
        console.error('Failed to send status update notification:', error);
      }
    }
  }
}