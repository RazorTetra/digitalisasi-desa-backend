// src/docs/generateBeritaKategoriDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BeritaKategoriSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type BeritaKategori = z.infer<typeof BeritaKategoriSchema>;

function generateApiDocs() {
  let markdown = "# Berita Kategori Management API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  const sampleKategori: BeritaKategori = {
    id: uuidv4(),
    nama: "Pembangunan",
    slug: "pembangunan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Get All Kategori
  markdown += "### Get All Kategori\n";
  markdown += "Endpoint: GET /api/v1/berita-kategori\n";
  markdown += "Description: Mendapatkan daftar semua kategori berita\n";
  markdown += "Authentication: Not Required\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify([sampleKategori], null, 2);
  markdown += "\n```\n\n";

  // Get Kategori by ID
  markdown += "### Get Kategori by ID\n";
  markdown += "Endpoint: GET /api/v1/berita-kategori/id/:id\n";
  markdown += "Description: Mendapatkan detail kategori berdasarkan ID\n";
  markdown += "Authentication: Not Required\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleKategori, null, 2);
  markdown += "\n```\n\n";

  // Get Kategori by Slug
  markdown += "### Get Kategori by Slug\n";
  markdown += "Endpoint: GET /api/v1/berita-kategori/:slug\n";
  markdown += "Description: Mendapatkan detail kategori berdasarkan slug\n";
  markdown += "Authentication: Not Required\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleKategori, null, 2);
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Create Kategori
  markdown += "### Create Kategori\n";
  markdown += "Endpoint: POST /api/v1/berita-kategori\n";
  markdown += "Description: Membuat kategori berita baru\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: application/json\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      nama: "Nama Kategori"
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify(sampleKategori, null, 2);
  markdown += "\n```\n\n";

  // Update Kategori
  markdown += "### Update Kategori\n";
  markdown += "Endpoint: PUT /api/v1/berita-kategori/:id\n";
  markdown += "Description: Mengupdate kategori berita yang sudah ada\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: application/json\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      nama: "Nama Kategori Baru"
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleKategori, null, 2);
  markdown += "\n```\n\n";

  // Delete Kategori
  markdown += "### Delete Kategori\n";
  markdown += "Endpoint: DELETE /api/v1/berita-kategori/:id\n";
  markdown += "Description: Menghapus kategori berita (hard delete)\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Error Responses
  markdown += "## Error Responses\n\n";
  
  markdown += "### Validation Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Data tidak valid",
      details: [
        { message: "Nama kategori harus diisi" }
      ]
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Not Found Error (404 Not Found)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Kategori not found"
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

  // Duplicate Entry Error
  markdown += "### Duplicate Entry Error (409 Conflict)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Kategori dengan nama tersebut sudah ada"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Cache Control Information
  markdown += "## Cache Control\n\n";
  markdown += "The API implements Redis caching with the following TTLs:\n";
  markdown += "- List kategori: 1 day\n\n";
  markdown += "Cache is automatically invalidated when:\n";
  markdown += "- New kategori is created\n";
  markdown += "- Existing kategori is updated\n";
  markdown += "- Kategori is deleted\n\n";

  markdown += "## Important Notes\n\n";
  markdown += "1. Slug akan digenerate secara otomatis dari nama kategori\n";
  markdown += "2. Nama kategori bersifat unique\n";
  markdown += "3. Penghapusan kategori perlu mempertimbangkan relasi dengan berita yang menggunakan kategori tersebut\n";

  // Write to file
  const outputPath = path.join(__dirname, "berita-kategori-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();