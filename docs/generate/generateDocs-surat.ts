/* eslint-disable @typescript-eslint/no-unused-vars */
// src/docs/generateSuratDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas
const FormatSuratSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
  fileUrl: z.string().url(),
  filename: z.string(),
  totalDownloads: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const MonthlyStatsSchema = z.object({
  month: z.string(),
  year: z.number(),
  downloadCount: z.number(),
});

type FormatSurat = z.infer<typeof FormatSuratSchema>;
type MonthlyStats = z.infer<typeof MonthlyStatsSchema>;

function generateApiDocs() {
  let markdown = "# Surat Management API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Get All Format Surat (Updated with download stats)
  markdown += "### Get All Format Surat\n";
  markdown += "Endpoint: `GET /api/v1/surat/format`\n\n";
  markdown += "Description: Mendapatkan daftar semua format surat yang tersedia beserta jumlah unduhan\n\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Parameters: None\n\n";
  
  const sampleFormatSurat: FormatSurat = {
    id: uuidv4(),
    nama: "Surat Keterangan Domisili",
    fileUrl: "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx",
    filename: "surat-keterangan-domisili.docx",
    totalDownloads: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify([
    {
      ...sampleFormatSurat,
      downloadUrl: sampleFormatSurat.fileUrl
    }
  ], null, 2);
  markdown += "\n```\n\n";

  // Track Download
  markdown += "### Track Format Surat Download\n";
  markdown += "Endpoint: `POST /api/v1/surat/format/:id/download`\n\n";
  markdown += "Description: Mencatat unduhan format surat. Harus dipanggil setiap kali user mengunduh dokumen.\n\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "URL Parameters:\n";
  markdown += "- id: string (UUID format surat)\n\n";
  markdown += "Request Body: None\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify({
    message: "Download tracked successfully"
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "Error Responses:\n";
  markdown += "1. Format Surat Not Found (404):\n```json\n";
  markdown += JSON.stringify({
    error: "Format surat not found"
  }, null, 2);
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Get Download Statistics
  markdown += "### Get Format Surat Download Statistics\n";
  markdown += "Endpoint: `GET /api/v1/surat/format/:id/stats`\n\n";
  markdown += "Description: Mendapatkan statistik unduhan format surat per bulan\n\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "URL Parameters:\n";
  markdown += "- id: string (UUID format surat)\n\n";
  markdown += "Query Parameters:\n";
  markdown += "- year (optional): number (Filter statistik berdasarkan tahun, format: YYYY)\n\n";

  const sampleStats: MonthlyStats[] = [
    { month: "January", year: 2024, downloadCount: 45 },
    { month: "February", year: 2024, downloadCount: 38 },
    { month: "March", year: 2024, downloadCount: 67 }
  ];

  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleStats, null, 2);
  markdown += "\n```\n\n";

  markdown += "Error Responses:\n";
  markdown += "1. Format Surat Not Found (404):\n```json\n";
  markdown += JSON.stringify({
    error: "Format surat not found"
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "2. Invalid Year Format (400):\n```json\n";
  markdown += JSON.stringify({
    error: "Invalid year format"
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "3. Authentication Error (401):\n```json\n";
  markdown += JSON.stringify({
    error: "Access token not found",
    code: "TOKEN_MISSING"
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "4. Authorization Error (403):\n```json\n";
  markdown += JSON.stringify({
    error: "Access denied. Admin privileges required."
  }, null, 2);
  markdown += "\n```\n\n";

  // Upload Format Surat
  markdown += "### Upload Format Surat\n";
  markdown += "Endpoint: `POST /api/v1/surat/format`\n\n";
  markdown += "Description: Upload template surat baru\n\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body:\n";
  markdown += "```\n";
  markdown += "nama: string (Nama surat)\n";
  markdown += "file: File (Template dokumen - .doc, .docx, atau .pdf, max 5MB)\n";
  markdown += "```\n\n";
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify({
    ...sampleFormatSurat,
    downloadUrl: sampleFormatSurat.fileUrl
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "Error Responses:\n";
  markdown += "1. Validation Error (400):\n```json\n";
  markdown += JSON.stringify({
    error: "Invalid input",
    details: [
      { message: "Nama is required" },
      { message: "File template is required" }
    ]
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "2. File Type Error (400):\n```json\n";
  markdown += JSON.stringify({
    error: "Invalid file type. Only .doc, .docx, and .pdf files are allowed."
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "3. File Size Error (400):\n```json\n";
  markdown += JSON.stringify({
    error: "File too large. Maximum size is 5MB"
  }, null, 2);
  markdown += "\n```\n\n";

  // Delete Format Surat
  markdown += "### Delete Format Surat\n";
  markdown += "Endpoint: `DELETE /api/v1/surat/format/:id`\n\n";
  markdown += "Description: Menghapus format surat (hard delete)\n\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "URL Parameters:\n";
  markdown += "- id: string (UUID format surat)\n\n";
  markdown += "Request Body: None\n\n";
  markdown += "Response: 204 No Content\n\n";

  markdown += "Error Responses:\n";
  markdown += "1. Format Not Found (404):\n```json\n";
  markdown += JSON.stringify({
    error: "Format surat not found"
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "2. Authentication Error (401):\n```json\n";
  markdown += JSON.stringify({
    error: "Access token not found",
    code: "TOKEN_MISSING"
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "3. Authorization Error (403):\n```json\n";
  markdown += JSON.stringify({
    error: "Access denied. Admin privileges required."
  }, null, 2);
  markdown += "\n```\n\n";

  // General Notes
  markdown += "## General Notes\n\n";
  markdown += "1. Semua endpoint yang memerlukan autentikasi harus menyertakan token dalam cookie 'accessToken'\n";
  markdown += "2. Statistik download diperbarui secara real-time setiap kali endpoint track download dipanggil\n";
  markdown += "3. Statistik bulanan dihitung berdasarkan zona waktu server\n";
  markdown += "4. Total downloads di response GET format surat mencakup seluruh unduhan sejak format diunggah\n\n";

  // Write to file
  const outputPath = path.join(__dirname, "surat-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();