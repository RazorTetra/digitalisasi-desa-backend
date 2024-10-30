/* eslint-disable @typescript-eslint/no-unused-vars */
// src/docs/generateFinanceDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Define Zod schemas
const FinancePeriodSchema = z.object({
  id: z.string().uuid(),
  tahun: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const FinanceItemSchema = z.object({
  id: z.string().uuid(),
  uraian: z.string(),
  dana: z.number(),
  periodId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const FinanceFinancingSchema = FinanceItemSchema.extend({
  jenis: z.enum(["PENERIMAAN", "PENGELUARAN"]),
});

const FinanceSummarySchema = z.object({
  jumlahPendapatan: z.number(),
  jumlahBelanja: z.number(),
  surplusDefisit: z.number(),
  pembiayaanNeto: z.number(),
});

function generateApiDocs() {
  let markdown = "# Finance Management API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Get Banner
  markdown += "### Get Finance Banner\n";
  markdown += "Endpoint: GET /api/v1/finance/banner\n";
  markdown += "Description: Mendapatkan banner keuangan\n";
  markdown += "Authentication: Not Required\n\n";

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(
    {
      id: uuidv4(),
      imageUrl: "https://example.com/banner.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Get Info
  markdown += "### Get Finance Info\n";
  markdown += "Endpoint: GET /api/v1/finance/info\n";
  markdown += "Description: Mendapatkan informasi dasar keuangan\n";
  markdown += "Authentication: Not Required\n\n";

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(
    {
      id: uuidv4(),
      content: "Informasi keuangan desa",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Get All Periods
  markdown += "### Get All Periods\n";
  markdown += "Endpoint: GET /api/v1/finance/periods\n";
  markdown += "Description: Mendapatkan daftar semua periode keuangan\n";
  markdown += "Authentication: Not Required\n\n";

  const samplePeriod = {
    id: uuidv4(),
    tahun: 2024,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify([samplePeriod], null, 2);
  markdown += "\n```\n\n";

  // Get Latest Period
  markdown += "### Get Latest Period\n";
  markdown += "Endpoint: GET /api/v1/finance/periods/latest\n";
  markdown +=
    "Description: Mendapatkan periode terbaru dengan ringkasan keuangan\n";
  markdown += "Authentication: Not Required\n\n";

  const sampleIncome = {
    id: uuidv4(),
    uraian: "Pendapatan Asli Desa",
    dana: 50000000,
    periodId: samplePeriod.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleExpense = {
    id: uuidv4(),
    uraian: "Belanja Pegawai",
    dana: 25000000,
    periodId: samplePeriod.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleFinancing = {
    id: uuidv4(),
    uraian: "Penerimaan Pembiayaan",
    dana: 10000000,
    jenis: "PENERIMAAN",
    periodId: samplePeriod.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleSummary = {
    jumlahPendapatan: 50000000,
    jumlahBelanja: 25000000,
    surplusDefisit: 25000000,
    pembiayaanNeto: 10000000,
  };

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(
    {
      ...samplePeriod,
      incomes: [sampleIncome],
      expenses: [sampleExpense],
      financings: [sampleFinancing],
      summary: sampleSummary,
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Get Period By Id
  markdown += "### Get Period By Id\n";
  markdown += "Endpoint: GET /api/v1/finance/periods/:id\n";
  markdown +=
    "Description: Mendapatkan detail periode keuangan dengan ringkasan\n";
  markdown += "Authentication: Not Required\n\n";

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(
    {
      ...samplePeriod,
      incomes: [sampleIncome],
      expenses: [sampleExpense],
      financings: [sampleFinancing],
      summary: sampleSummary,
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Update Banner
  markdown += "### Update Finance Banner\n";
  markdown += "Endpoint: PUT /api/v1/finance/banner\n";
  markdown += "Description: Mengubah banner keuangan\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body: multipart/form-data\n";
  markdown += "- file: Image file (jpg, png, webp)\n\n";
  markdown += "Response: Same as Get Finance Banner\n\n";

  // Update Info
  markdown += "### Update Finance Info\n";
  markdown += "Endpoint: PUT /api/v1/finance/info\n";
  markdown += "Description: Mengubah informasi dasar keuangan\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({ content: "Informasi keuangan desa" }, null, 2);
  markdown += "\n```\n\n";

  markdown += "Response: Same as Get Finance Info\n\n";

  // Create Period
  markdown += "### Create Period\n";
  markdown += "Endpoint: POST /api/v1/finance/periods\n";
  markdown += "Description: Membuat periode keuangan baru\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({ tahun: 2024 }, null, 2);
  markdown += "\n```\n\n";

  markdown += "Response Body (201 Created):\n```json\n";
  markdown += JSON.stringify(
    {
      ...samplePeriod,
      incomes: [],
      expenses: [],
      financings: [],
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Add Income
  markdown += "### Add Income\n";
  markdown += "Endpoint: POST /api/v1/finance/periods/:periodId/income\n";
  markdown += "Description: Menambah item pendapatan\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      uraian: "Pendapatan Asli Desa",
      dana: 50000000,
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "Response Body (201 Created):\n```json\n";
  markdown += JSON.stringify(sampleIncome, null, 2);
  markdown += "\n```\n\n";

  // Add Expense
  markdown += "### Add Expense\n";
  markdown += "Endpoint: POST /api/v1/finance/periods/:periodId/expense\n";
  markdown += "Description: Menambah item belanja\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      uraian: "Belanja Pegawai",
      dana: 25000000,
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "Response Body (201 Created):\n```json\n";
  markdown += JSON.stringify(sampleExpense, null, 2);
  markdown += "\n```\n\n";

  // Add Financing
  markdown += "### Add Financing\n";
  markdown += "Endpoint: POST /api/v1/finance/periods/:periodId/financing\n";
  markdown += "Description: Menambah item pembiayaan\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      uraian: "Penerimaan Pembiayaan",
      dana: 10000000,
      jenis: "PENERIMAAN",
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "Response Body (201 Created):\n```json\n";
  markdown += JSON.stringify(sampleFinancing, null, 2);
  markdown += "\n```\n\n";

  // Update Period
  markdown += "### Update Period\n";
  markdown += "Endpoint: PUT /api/v1/finance/periods/:id\n";
  markdown += "Description: Mengubah tahun periode\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({ tahun: 2024 }, null, 2);
  markdown += "\n```\n\n";

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(samplePeriod, null, 2);
  markdown += "\n```\n\n";

  markdown += "Error Responses:\n";
  markdown += "- 404 Not Found: Period tidak ditemukan\n";
  markdown += "- 409 Conflict: Tahun periode sudah ada\n\n";

  // Update Income
  markdown += "### Update Income\n";
  markdown += "Endpoint: PUT /api/v1/finance/income/:id\n";
  markdown += "Description: Mengubah item pendapatan\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      uraian: "Pendapatan Asli Desa",
      dana: 50000000,
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(sampleIncome, null, 2);
  markdown += "\n```\n\n";

  // Update Expense
  markdown += "### Update Expense\n";
  markdown += "Endpoint: PUT /api/v1/finance/expense/:id\n";
  markdown += "Description: Mengubah item belanja\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      uraian: "Belanja Pegawai",
      dana: 25000000,
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(sampleExpense, null, 2);
  markdown += "\n```\n\n";

  // Update Financing
  markdown += "### Update Financing\n";
  markdown += "Endpoint: PUT /api/v1/finance/financing/:id\n";
  markdown += "Description: Mengubah item pembiayaan\n";
  markdown += "Authentication: Required (Admin)\n\n";

  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      uraian: "Penerimaan Pembiayaan",
      dana: 10000000,
      jenis: "PENERIMAAN",
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "Response Body (200 OK):\n```json\n";
  markdown += JSON.stringify(sampleFinancing, null, 2);
  markdown += "\n```\n\n";

  // Delete Period
  markdown += "### Delete Period\n";
  markdown += "Endpoint: DELETE /api/v1/finance/periods/:id\n";
  markdown +=
    "Description: Menghapus periode beserta semua data terkait (cascade delete)\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";
  markdown += "Error Responses:\n";
  markdown += "- 404 Not Found: Period tidak ditemukan\n\n";

  // Delete Income
  markdown += "### Delete Income\n";
  markdown += "Endpoint: DELETE /api/v1/finance/income/:id\n";
  markdown += "Description: Menghapus item pendapatan\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Delete Expense
  markdown += "### Delete Expense\n";
  markdown += "Endpoint: DELETE /api/v1/finance/expense/:id\n";
  markdown += "Description: Menghapus item belanja\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";
  // Delete Financing
  markdown += "### Delete Financing\n";
  markdown += "Endpoint: DELETE /api/v1/finance/financing/:id\n";
  markdown += "Description: Menghapus item pembiayaan\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";
  markdown += "Error Responses:\n";
  markdown += "- 404 Not Found: Item tidak ditemukan\n\n";

  // Write to file
  const outputPath = path.join(__dirname, "finance-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();
