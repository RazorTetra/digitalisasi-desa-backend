// src/docs/generateFinanceDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FinanceItemSchema = z.object({
  id: z.string().uuid(),
  uraian: z.string(),
  anggaran: z.number(),
  realisasi: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Type for banner
type FinanceBanner = {
  id: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// Type for info
type FinanceInfo = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// Type for finance items
type FinanceItem = z.infer<typeof FinanceItemSchema>;

// Type for summary
type FinanceSummary = {
  totalPendapatan: {
    anggaran: number;
    realisasi: number;
    sisa: number;
  };
  totalBelanja: {
    anggaran: number;
    realisasi: number;
    sisa: number;
    jumlahPendapatan: number;
    surplusDefisit: number;
  };
  totalPembiayaan: {
    anggaran: number;
    realisasi: number;
    sisa: number;
    pembiayaanNetto: number;
    sisaLebihPembiayaanAnggaran: number;
  };
};

function generateApiDocs() {
  let markdown = "# Finance API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Get Banner
  markdown += "### Get Finance Banner\n";
  markdown += "Endpoint: GET /api/v1/finance/banner\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  const sampleBanner: FinanceBanner = {
    id: uuidv4(),
    imageUrl: "https://cloudinary.com/example.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  markdown += JSON.stringify(sampleBanner, null, 2);
  markdown += "\n```\n\n";

  // Get Info
  markdown += "### Get Finance Info\n";
  markdown += "Endpoint: GET /api/v1/finance/info\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  const sampleInfo: FinanceInfo = {
    id: uuidv4(),
    content: "Informasi keuangan desa akan ditampilkan di sini",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  markdown += JSON.stringify(sampleInfo, null, 2);
  markdown += "\n```\n\n";

  // Get Income Items
  markdown += "### Get Income Items\n";
  markdown += "Endpoint: GET /api/v1/finance/income\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  const sampleIncomeItem: FinanceItem = {
    id: uuidv4(),
    uraian: "DANA DESA",
    anggaran: 781754000,
    realisasi: 781754000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  markdown += JSON.stringify([sampleIncomeItem], null, 2);
  markdown += "\n```\n\n";

  // Get Expense Items
  markdown += "### Get Expense Items\n";
  markdown += "Endpoint: GET /api/v1/finance/expense\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  const sampleExpenseItem: FinanceItem = {
    id: uuidv4(),
    uraian: "BIDANG PENYELENGGARAAN PEMERINTAH DESA",
    anggaran: 401501414,
    realisasi: 401806138,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  markdown += JSON.stringify([sampleExpenseItem], null, 2);
  markdown += "\n```\n\n";

  // Get Financing Items
  markdown += "### Get Financing Items\n";
  markdown += "Endpoint: GET /api/v1/finance/financing\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  const sampleFinancingItem: FinanceItem = {
    id: uuidv4(),
    uraian: "PENERIMAAN PEMBIAYAAN",
    anggaran: 237734,
    realisasi: 237734,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  markdown += JSON.stringify([sampleFinancingItem], null, 2);
  markdown += "\n```\n\n";

  // Get Summary
  markdown += "### Get Finance Summary\n";
  markdown += "Endpoint: GET /api/v1/finance/summary\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  const sampleSummary: FinanceSummary = {
    totalPendapatan: {
      anggaran: 1152830600,
      realisasi: 1151420600,
      sisa: 861463
    },
    totalBelanja: {
      anggaran: 1138068334,
      realisasi: 1136963058,
      sisa: 1105276,
      jumlahPendapatan: 1151420600,
      surplusDefisit: -14762266
    },
    totalPembiayaan: {
      anggaran: 15237734,
      realisasi: 15237734,
      sisa: 0,
      pembiayaanNetto: -14762266,
      sisaLebihPembiayaanAnggaran: 0
    }
  };
  markdown += JSON.stringify(sampleSummary, null, 2);
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Update Banner
  markdown += "### Update Finance Banner\n";
  markdown += "Endpoint: PUT /api/v1/finance/banner\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body:\n```\n";
  markdown += "file: File (image)\n";
  markdown += "```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleBanner, null, 2);
  markdown += "\n```\n\n";

  // Update Info
  markdown += "### Update Finance Info\n";
  markdown += "Endpoint: PUT /api/v1/finance/info\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({ content: "Informasi keuangan desa terbaru" }, null, 2);
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleInfo, null, 2);
  markdown += "\n```\n\n";

  // Income CRUD
  markdown += "### Create Income Item\n";
  markdown += "Endpoint: POST /api/v1/finance/income\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({
    uraian: "DANA DESA",
    anggaran: 781754000,
    realisasi: 781754000
  }, null, 2);
  markdown += "\n```\n\n";
  
  markdown += "### Update Income Item\n";
  markdown += "Endpoint: PUT /api/v1/finance/income/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({
    uraian: "DANA DESA",
    anggaran: 781754000,
    realisasi: 781754000
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "### Delete Income Item\n";
  markdown += "Endpoint: DELETE /api/v1/finance/income/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Expense CRUD
  markdown += "### Create Expense Item\n";
  markdown += "Endpoint: POST /api/v1/finance/expense\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({
    uraian: "BIDANG PENYELENGGARAAN PEMERINTAH DESA",
    anggaran: 401501414,
    realisasi: 401806138
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "### Update Expense Item\n";
  markdown += "Endpoint: PUT /api/v1/finance/expense/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({
    uraian: "BIDANG PENYELENGGARAAN PEMERINTAH DESA",
    anggaran: 401501414,
    realisasi: 401806138
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "### Delete Expense Item\n";
  markdown += "Endpoint: DELETE /api/v1/finance/expense/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Financing CRUD
  markdown += "### Create Financing Item\n";
  markdown += "Endpoint: POST /api/v1/finance/financing\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({
    uraian: "PENERIMAAN PEMBIAYAAN",
    anggaran: 237734,
    realisasi: 237734
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "### Update Financing Item\n";
  markdown += "Endpoint: PUT /api/v1/finance/financing/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify({
    uraian: "PENERIMAAN PEMBIAYAAN",
    anggaran: 237734,
    realisasi: 237734
  }, null, 2);
  markdown += "\n```\n\n";

  markdown += "### Delete Financing Item\n";
  markdown += "Endpoint: DELETE /api/v1/finance/financing/:id\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Error Responses
  markdown += "## Error Responses\n\n";
  
  markdown += "### Validation Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Invalid input",
      details: [
        { message: "Uraian tidak boleh kosong" },
        { message: "Anggaran harus berupa angka" }
      ]
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Not Found Error (404 Not Found)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Item not found"
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

  markdown += "### Permission Error (403 Forbidden)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Access denied. Admin privileges required."
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  // Write to file
  const outputPath = path.join(__dirname, "finance-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();