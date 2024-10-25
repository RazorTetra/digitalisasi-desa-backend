// src/docs/generateBeritaDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas
const BeritaKategoriSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BeritaSchema = z.object({
  id: z.string().uuid(),
  judul: z.string(),
  slug: z.string(),
  ringkasan: z.string(),
  isi: z.string(),
  gambarUrl: z.string().url(),
  isHighlight: z.boolean(),
  penulis: z.string(),
  tanggal: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  kategori: z.array(BeritaKategoriSchema),
});

type Berita = z.infer<typeof BeritaSchema>;
type BeritaKategori = z.infer<typeof BeritaKategoriSchema>;

function generateApiDocs() {
  let markdown = "# Berita Management API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Get All Berita
  markdown += "### Get All Berita\n";
  markdown += "Endpoint: GET /api/v1/berita\n";
  markdown += "Description: Mendapatkan daftar semua berita yang tersedia\n";
  markdown += "Authentication: Not Required\n\n";

  const sampleKategori: BeritaKategori = {
    id: uuidv4(),
    nama: "Pembangunan",
    slug: "pembangunan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleBerita: Berita = {
    id: uuidv4(),
    judul: "Pembangunan Taman Kota Dimulai",
    slug: "pembangunan-taman-kota-dimulai",
    ringkasan: "Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini...",
    isi: "<p>Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini. Taman seluas 5 hektar ini akan menjadi pusat rekreasi baru bagi warga kota.</p>",
    gambarUrl: "https://res.cloudinary.com/example/image/upload/v1234567890/berita/taman-kota.jpg",
    isHighlight: true,
    penulis: "John Doe",
    tanggal: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kategori: [sampleKategori],
  };

  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify([sampleBerita], null, 2);
  markdown += "\n```\n\n";

  // Get Highlighted Berita
  markdown += "### Get Highlighted Berita\n";
  markdown += "Endpoint: GET /api/v1/berita/highlighted\n";
  markdown += "Description: Mendapatkan daftar berita yang di-highlight\n";
  markdown += "Authentication: Not Required\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify([sampleBerita], null, 2);
  markdown += "\n```\n\n";

  // Get Single Berita
  markdown += "### Get Single Berita\n";
  markdown += "Endpoint: GET /api/v1/berita/:slug\n";
  markdown += "Description: Mendapatkan detail berita berdasarkan slug\n";
  markdown += "Authentication: Not Required\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleBerita, null, 2);
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Create Berita
  markdown += "### Create Berita\n";
  markdown += "Endpoint: POST /api/v1/berita\n";
  markdown += "Description: Membuat berita baru\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body:\n";
  markdown += "```\n";
  markdown += "judul: string (Judul berita)\n";
  markdown += "ringkasan: string (Ringkasan berita)\n";
  markdown += "isi: string (Konten berita dalam format HTML)\n";
  markdown += "penulis: string (Nama penulis)\n";
  markdown += "tanggal: string (Format ISO 8601)\n";
  markdown += "isHighlight: boolean (Optional)\n";
  markdown += "kategoriIds: string (JSON array of kategori IDs)\n";
  markdown += "gambar: File (Gambar berita - jpg, jpeg, png, atau webp)\n";
  markdown += "```\n\n";
  
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify(sampleBerita, null, 2);
  markdown += "\n```\n\n";

  // Update Berita
  markdown += "### Update Berita\n";
  markdown += "Endpoint: PUT /api/v1/berita/:id\n";
  markdown += "Description: Mengupdate berita yang sudah ada\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body (all fields are optional):\n";
  markdown += "```\n";
  markdown += "judul: string\n";
  markdown += "ringkasan: string\n";
  markdown += "isi: string\n";
  markdown += "penulis: string\n";
  markdown += "tanggal: string\n";
  markdown += "isHighlight: boolean\n";
  markdown += "kategoriIds: string (JSON array)\n";
  markdown += "gambar: File\n";
  markdown += "```\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleBerita, null, 2);
  markdown += "\n```\n\n";

  // Delete Berita
  markdown += "### Delete Berita\n";
  markdown += "Endpoint: DELETE /api/v1/berita/:id\n";
  markdown += "Description: Menghapus berita (hard delete)\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Error Responses
  markdown += "## Error Responses\n\n";
  
  markdown += "### Validation Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Invalid input",
      details: [
        { message: "Judul harus diisi" },
        { message: "Minimal satu kategori harus dipilih" },
        { message: "Gambar berita harus diunggah" }
      ]
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### File Type Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "File harus berupa gambar"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Not Found Error (404 Not Found)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Berita not found"
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

  // Cache Control Information
  markdown += "## Cache Control\n\n";
  markdown += "The API implements Redis caching with the following TTLs:\n";
  markdown += "- List berita: 1 hour\n";
  markdown += "- Detail berita: 1 day\n";
  markdown += "- Highlighted berita: 1 hour\n\n";
  markdown += "Cache is automatically invalidated when:\n";
  markdown += "- New berita is created\n";
  markdown += "- Existing berita is updated\n";
  markdown += "- Berita is deleted\n";

  // Write to file
  const outputPath = path.join(__dirname, "berita-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();