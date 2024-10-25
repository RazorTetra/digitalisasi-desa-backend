// src/docs/generateTourismDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TourismSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100),
  description: z.string().max(255),
  image: z.string().url(),
  location: z.string().max(255),
  gallery: z.array(z.string().url()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type Tourism = z.infer<typeof TourismSchema>;

function generateApiDocs() {
  let markdown = "# Tourism API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Get All Tourism Destinations
  markdown += "### Get All Tourism Destinations\n";
  markdown += "Endpoint: GET /api/v1/tourism\n";
  markdown += "Description: Mendapatkan semua destinasi wisata\n";
  markdown += "Authentication: Not Required\n\n";
  
  const sampleTourism: Tourism = {
    id: uuidv4(),
    name: "Tanjung Peimpang",
    description: "Pantai berpasir putih dengan air jernih dan pemandangan matahari terbenam yang memukau",
    image: "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/main-image.jpg",
    location: "Desa Tandengan Selatan",
    gallery: [
      "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-1.jpg",
      "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-2.jpg",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify([sampleTourism], null, 2);
  markdown += "\n```\n\n";

  // Get Tourism By ID
  markdown += "### Get Tourism Destination by ID\n";
  markdown += "Endpoint: GET /api/v1/tourism/:id\n";
  markdown += "Description: Mendapatkan detail destinasi wisata berdasarkan ID\n";
  markdown += "Authentication: Not Required\n\n";
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleTourism, null, 2);
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Create Tourism
  markdown += "### Create Tourism Destination\n";
  markdown += "Endpoint: POST /api/v1/tourism\n";
  markdown += "Description: Membuat destinasi wisata baru\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body:\n";
  markdown += "```\n";
  markdown += "name: string (max 100 characters)\n";
  markdown += "description: string (max 255 characters)\n";
  markdown += "location: string (max 255 characters)\n";
  markdown += "mainImage: File (Image file - .jpg, .png, atau .webp)\n";
  markdown += "gallery: File[] (Multiple image files - max 10 files)\n";
  markdown += "```\n\n";
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify(sampleTourism, null, 2);
  markdown += "\n```\n\n";

  // Update Tourism
  markdown += "### Update Tourism Destination\n";
  markdown += "Endpoint: PUT /api/v1/tourism/:id\n";
  markdown += "Description: Mengupdate destinasi wisata\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body:\n";
  markdown += "```\n";
  markdown += "name?: string (max 100 characters)\n";
  markdown += "description?: string (max 255 characters)\n";
  markdown += "location?: string (max 255 characters)\n";
  markdown += "mainImage?: File (Image file - .jpg, .png, atau .webp)\n";
  markdown += "gallery?: File[] (Multiple image files - max 10 files)\n";
  markdown += "```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleTourism, null, 2);
  markdown += "\n```\n\n";

  // Delete Tourism
  markdown += "### Delete Tourism Destination\n";
  markdown += "Endpoint: DELETE /api/v1/tourism/:id\n";
  markdown += "Description: Menghapus destinasi wisata\n";
  markdown += "Authentication: Required (Admin)\n\n";
  markdown += "Response: 204 No Content\n\n";

  // Error Responses
  markdown += "## Error Responses\n\n";

  markdown += "### Invalid Input (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Invalid input",
      details: [
        {
          code: "too_big",
          maximum: 100,
          type: "string",
          inclusive: true,
          exact: false,
          message: "String must contain at most 100 character(s)",
          path: ["name"]
        }
      ]
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### File Type Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Only .jpeg, .png and .webp format allowed!"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Missing Required Files (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Main image and gallery images are required"
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### Not Found Error (404 Not Found)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Tourism destination not found"
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

  // Write to file
  const outputPath = path.join(__dirname, "tourism-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();