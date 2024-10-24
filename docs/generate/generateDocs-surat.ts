// src/docs/generateSuratDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FormatSuratSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
  fileUrl: z.string().url(),
  filename: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type FormatSurat = z.infer<typeof FormatSuratSchema>;

function generateApiDocs() {
  let markdown = "# Surat Management API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Get All Format Surat
  markdown += "### Get All Format Surat\n";
  markdown += "Endpoint: GET /api/v1/surat/format\n";
  markdown += "Description: Mendapatkan daftar semua format surat yang tersedia\n";
  markdown += "Authentication: Not Required\n\n";
  
  const sampleFormatSurat: FormatSurat = {
    id: uuidv4(),
    nama: "Surat Keterangan Domisili",
    fileUrl: "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx",
    filename: "surat-keterangan-domisili.docx",
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

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Upload Format Surat
  markdown += "### Upload Format Surat\n";
  markdown += "Endpoint: POST /api/v1/surat/format\n";
  markdown += "Description: Upload template surat baru\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body:\n";
  markdown += "```\n";
  markdown += "nama: string (Nama surat)\n";
  markdown += "file: File (Template dokumen - .doc, .docx, atau .pdf)\n";
  markdown += "```\n\n";
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify({
    ...sampleFormatSurat,
    downloadUrl: sampleFormatSurat.fileUrl
  }, null, 2);
  markdown += "\n```\n\n";

  // Delete Format Surat
  markdown += "### Delete Format Surat\n";
  markdown += "Endpoint: DELETE /api/v1/surat/format/:id\n";
  markdown += "Description: Menghapus format surat (hard delete)\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Error Responses
  markdown += "## Error Responses\n\n";
  
  markdown += "### Validation Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Invalid input",
      details: [
        { message: "Nama is required" },
        { message: "File template is required" }
      ]
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### File Type Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Invalid file type. Only .doc, .docx, and .pdf files are allowed."
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Not Found Error (404 Not Found)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Format surat not found"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Authentication Error (401 Unauthorized)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Access token not found",
      code: "TOKEN_MISSING"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Authorization Error (403 Forbidden)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Access denied. Admin privileges required."
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // File size limit error
  markdown += "### File Size Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "File too large. Maximum size is 5MB"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Write to file
  const outputPath = path.join(__dirname, "surat-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();