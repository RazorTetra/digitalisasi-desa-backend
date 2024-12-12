// src/infrastructure/services/EmailService.ts

import nodemailer from 'nodemailer';
import { User } from '@prisma/client';

interface StatusUpdateNotification {
  to: string;
  pengirim: string;
  kategori: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // Atau gunakan SMTP settings lain
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // App Password untuk Gmail
      }
    });
  }

  async sendSubmissionNotification(
    adminUsers: User[],
    submission: {
      pengirim: string;
      kategori: string;
      whatsapp: string;
      fileUrl: string;
    }
  ): Promise<void> {
    const emailPromises = adminUsers.map(admin => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: 'Pemberitahuan Pengajuan Surat Baru',
        html: `
          <h2>Pemberitahuan Pengajuan Surat Baru</h2>
          
          <p>Telah diterima pengajuan surat baru dengan detail:</p>
          
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nama Pengirim:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${submission.pengirim}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Kategori Surat:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${submission.kategori}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>WhatsApp:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">
                <a href="https://wa.me/${submission.whatsapp}">${submission.whatsapp}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Dokumen:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">
                <a href="${submission.fileUrl}">Lihat Dokumen</a>
              </td>
            </tr>
          </table>
          
          <p style="margin-top: 20px;">
            <small>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</small>
          </p>
        `
      };

      return this.transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendStatusUpdateNotification(data: StatusUpdateNotification): Promise<void> {
    try {
      // Di sini kita bisa mengimplementasikan pengiriman notifikasi yang sebenarnya
      // Misalnya menggunakan WhatsApp Business API atau layanan notifikasi lainnya
      
      // Untuk sementara kita skip dulu sampai ada implementasi notifikasi yang sebenarnya
      return;

      /* 
      Contoh implementasi email notification (uncomment jika diperlukan):
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${data.to}@whatsapp.com`,
        subject: 'Status Pengajuan Surat Diperbarui',
        html: `
          <h2>Status Pengajuan Surat Diperbarui</h2>
          
          <p>Pengajuan surat Anda dengan detail berikut telah selesai diproses:</p>
          
          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nama Pengirim:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.pengirim}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Kategori Surat:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.kategori}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">SELESAI</td>
            </tr>
          </table>
          
          <p>Silakan kunjungi kantor desa untuk mengambil surat Anda.</p>
          
          <p style="margin-top: 20px;">
            <small>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</small>
          </p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      */
    } catch (error) {
      // Hanya log error yang benar-benar penting
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending status update notification:', error);
      }
    }
  }
}