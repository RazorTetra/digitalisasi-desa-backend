// src/docs/generateTamuWajibLaporDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas
// Kita menambahkan eslint-disable untuk schema yang akan digunakan sebagai type reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TamuWajibLaporSchema = z.object({
  id: z.string().uuid(),
  trackingCode: z.string(),
  nama: z.string(),
  nik: z.string(),
  alamatAsal: z.string(),
  tujuan: z.string(),
  lamaMenginap: z.string(),
  tempatMenginap: z.string(),
  nomorTelepon: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  statusMessage: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Type untuk response status publik
type PublicStatus = {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  statusMessage?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Type untuk full laporan
type TamuWajibLapor = z.infer<typeof TamuWajibLaporSchema>;

function generateApiDocs() {
  let markdown = "# Tamu Wajib Lapor API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Submit Laporan
  markdown += "### Submit Laporan Tamu\n";
  markdown += "Endpoint: POST /api/v1/tamu-wajib-lapor\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      nama: "John Doe",
      nik: "1234567890123456",
      alamatAsal: "Jl. Contoh No. 123, Jakarta",
      tujuan: "Liburan",
      lamaMenginap: "4-7",
      tempatMenginap: "Villa Indah, Jl. Danau No. 45",
      nomorTelepon: "08123456789"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  const samplePublicStatus: PublicStatus = {
    status: "APPROVED",
    statusMessage: "Dokumen lengkap dan valid",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleFullLaporan: TamuWajibLapor = {
    id: uuidv4(),
    trackingCode: "TWL1234ABCD",
    nama: "John Doe",
    nik: "1234567890123456",
    alamatAsal: "Jl. Contoh No. 123, Jakarta",
    tujuan: "Liburan",
    lamaMenginap: "4-7",
    tempatMenginap: "Villa Indah, Jl. Danau No. 45",
    nomorTelepon: "08123456789",
    status: "PENDING",
    statusMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Get Public Status
  markdown += "### Check Status by Tracking Code\n";
  markdown += "Endpoint: GET /api/v1/tamu-wajib-lapor/status/:trackingCode\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(samplePublicStatus, null, 2);
  markdown += "\n```\n\n";

  // Get Recent Submissions
  markdown += "### Get Recent Submissions\n";
  markdown += "Endpoint: GET /api/v1/tamu-wajib-lapor/recent?limit=10\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify([samplePublicStatus], null, 2);
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Get All Laporan
  markdown += "### Get All Laporan\n";
  markdown += "Endpoint: GET /api/v1/tamu-wajib-lapor\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify([sampleFullLaporan], null, 2);
  markdown += "\n```\n\n";

  // Get Laporan by ID
  markdown += "### Get Laporan by ID\n";
  markdown += "Endpoint: GET /api/v1/tamu-wajib-lapor/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleFullLaporan, null, 2);
  markdown += "\n```\n\n";

  // Update Status
  markdown += "### Update Status\n";
  markdown += "Endpoint: PUT /api/v1/tamu-wajib-lapor/:id/status\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      status: "APPROVED",
      statusMessage: "Dokumen lengkap dan valid"
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    {
      ...sampleFullLaporan,
      status: "APPROVED",
      statusMessage: "Dokumen lengkap dan valid",
    }, 
    null, 
    2
  );
  markdown += "\n```\n\n";

  // Delete Laporan
  markdown += "### Delete Laporan\n";
  markdown += "Endpoint: DELETE /api/v1/tamu-wajib-lapor/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Error Responses
  markdown += "## Error Responses\n\n";
  
  markdown += "### Validation Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Invalid input",
      details: [
        { message: "NIK harus terdiri dari 16 digit" },
        { message: "Nomor telepon minimal 10 digit" }
      ]
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Not Found Error (404 Not Found)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Laporan not found"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Write to file
  const outputPath = path.join(__dirname, "tamu-wajib-lapor-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();