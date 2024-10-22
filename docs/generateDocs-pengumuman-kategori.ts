// src/docs/generateApiDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas
const KategoriSchema = z.object({
  id: z.string().uuid(),
  nama: z.string(),
});

const PengumumanSchema = z.object({
  id: z.string().uuid(),
  judul: z.string(),
  isi: z.string(),
  tanggal: z.string().datetime(),
  kategoriId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorResponse = z.object({
  error: z.string(),
  details: z.array(
    z.object({
      message: z.string(),
    })
  ).optional(),
});

// Function to generate Markdown documentation
function generateApiDocs() {
  let markdown = "# API Specification\n\n";

  // Kategori API
  markdown += "## Kategori API\n\n";

  // Get All Kategori
  markdown += "### Get All Kategori\n";
  markdown += "Endpoint: GET /api/v1/kategori\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    [
      KategoriSchema.parse({
        id: uuidv4(),
        nama: "Kesehatan",
      }),
    ],
    null,
    2
  );
  markdown += "\n```\n\n";

  // Create Kategori
  markdown += "### Create Kategori\n";
  markdown += "Endpoint: POST /api/v1/kategori\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      nama: "Ekonomi",
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify(
    KategoriSchema.parse({
      id: uuidv4(),
      nama: "Ekonomi",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Update Kategori
  markdown += "### Update Kategori\n";
  markdown += "Endpoint: PUT /api/v1/kategori/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      nama: "Ekonomi dan Bisnis",
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    KategoriSchema.parse({
      id: uuidv4(),
      nama: "Ekonomi dan Bisnis",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Delete Kategori
  markdown += "### Delete Kategori\n";
  markdown += "Endpoint: DELETE /api/v1/kategori/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Response (Success - 204 No Content): No body\n\n";

  // Pengumuman API
  markdown += "## Pengumuman API\n\n";

  // Get All Pengumuman
  markdown += "### Get All Pengumuman\n";
  markdown += "Endpoint: GET /api/v1/pengumuman\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    [
      PengumumanSchema.parse({
        id: uuidv4(),
        judul: "Jadwal Vaksinasi COVID-19",
        isi: "Vaksinasi COVID-19 tahap kedua akan dilaksanakan pada tanggal 15 Juli 2024...",
        tanggal: new Date().toISOString(),
        kategoriId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    ],
    null,
    2
  );
  markdown += "\n```\n\n";

  // Get Pengumuman by ID
  markdown += "### Get Pengumuman by ID\n";
  markdown += "Endpoint: GET /api/v1/pengumuman/:id\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    PengumumanSchema.parse({
      id: uuidv4(),
      judul: "Jadwal Vaksinasi COVID-19",
      isi: "Vaksinasi COVID-19 tahap kedua akan dilaksanakan pada tanggal 15 Juli 2024...",
      tanggal: new Date().toISOString(),
      kategoriId: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Create Pengumuman
  markdown += "### Create Pengumuman\n";
  markdown += "Endpoint: POST /api/v1/pengumuman\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      judul: "Pembukaan Pendaftaran UMKM",
      isi: "Pendaftaran UMKM untuk program bantuan modal usaha dibuka mulai 1 Agustus 2024...",
      tanggal: new Date().toISOString(),
      kategoriId: uuidv4(),
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify(
    PengumumanSchema.parse({
      id: uuidv4(),
      judul: "Pembukaan Pendaftaran UMKM",
      isi: "Pendaftaran UMKM untuk program bantuan modal usaha dibuka mulai 1 Agustus 2024...",
      tanggal: new Date().toISOString(),
      kategoriId: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Update Pengumuman
  markdown += "### Update Pengumuman\n";
  markdown += "Endpoint: PUT /api/v1/pengumuman/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      judul: "Update: Pembukaan Pendaftaran UMKM",
      isi: "Pendaftaran UMKM untuk program bantuan modal usaha diperpanjang hingga 15 Agustus 2024...",
      kategoriId: uuidv4(),
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    PengumumanSchema.parse({
      id: uuidv4(),
      judul: "Update: Pembukaan Pendaftaran UMKM",
      isi: "Pendaftaran UMKM untuk program bantuan modal usaha diperpanjang hingga 15 Agustus 2024...",
      tanggal: new Date().toISOString(),
      kategoriId: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Delete Pengumuman
  markdown += "### Delete Pengumuman\n";
  markdown += "Endpoint: DELETE /api/v1/pengumuman/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Response (Success - 204 No Content): No body\n\n";

  // Write to file
  const outputPath = path.join(__dirname, "pengumuman-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();