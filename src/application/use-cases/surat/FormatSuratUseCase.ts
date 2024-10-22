// src/application/use-cases/surat/FormatSuratUseCase.ts

import { FormatSuratRepository } from '../../../infrastructure/repositories/FormatSuratRepository';
import { FormatSurat } from '@prisma/client';
import { NotFoundError } from '../../../common/error/NotFoundError';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export class FormatSuratUseCase {
  private readonly ALLOWED_MIME_TYPES = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
  ];

  constructor(private formatSuratRepository: FormatSuratRepository) {}

  private getFileExtension(mimetype: string): string {
    const mimeToExt: Record<string, string> = {
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/pdf': 'pdf'
    };
    return mimeToExt[mimetype] || 'docx';
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
  }

  private async uploadToCloudinary(
    buffer: Buffer,
    originalname: string,
    mimetype: string
  ): Promise<{ url: string; filename: string }> {
    const ext = this.getFileExtension(mimetype);
    const sanitizedName = this.sanitizeFileName(originalname);
    const finalName = sanitizedName.endsWith(`.${ext}`) 
      ? sanitizedName 
      : `${sanitizedName}.${ext}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'surat-templates',
          resource_type: 'raw',
          public_id: finalName.replace(`.${ext}`, ''),
          format: ext
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({ 
            url: result!.secure_url,
            filename: finalName
          });
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async getAllFormatSurat(): Promise<FormatSurat[]> {
    return this.formatSuratRepository.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createFormatSurat(nama: string, file: UploadedFile): Promise<FormatSurat> {
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only .doc, .docx, and .pdf files are allowed.');
    }

    const { url: fileUrl, filename } = await this.uploadToCloudinary(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    return this.formatSuratRepository.create({
      nama,
      fileUrl,
      filename
    });
  }

  async deleteFormatSurat(id: string): Promise<void> {
    const format = await this.formatSuratRepository.findById(id);
    if (!format) {
      throw new NotFoundError('Format surat not found');
    }

    const publicId = format.fileUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
      }
    }

    await this.formatSuratRepository.delete(id);
  }
}