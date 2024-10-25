// src/docs/generateHeroBannerDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HeroBannerSchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type HeroBanner = z.infer<typeof HeroBannerSchema>;

function generateApiDocs() {
  let markdown = "# Hero Banner API Specification\n\n";

  // === PUBLIC ENDPOINTS ===
  markdown += "## Public Endpoints\n\n";

  // Get Hero Banner
  markdown += "### Get Hero Banner\n";
  markdown += "Endpoint: GET /api/v1/hero-banner\n";
  markdown += "Description: Mendapatkan data hero banner\n";
  markdown += "Authentication: Not Required\n\n";
  
  const sampleHeroBanner: HeroBanner = {
    id: uuidv4(),
    imageUrl: "https://res.cloudinary.com/example/image/upload/v1234567890/hero_banner/sample.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleHeroBanner, null, 2);
  markdown += "\n```\n\n";

  // === ADMIN ENDPOINTS ===
  markdown += "## Admin Endpoints\n";
  markdown += "All admin endpoints require authentication and admin role.\n\n";

  // Update Hero Banner
  markdown += "### Update Hero Banner\n";
  markdown += "Endpoint: PUT /api/v1/hero-banner\n";
  markdown += "Description: Update hero banner image\n";
  markdown += "Authentication: Required (Admin)\n";
  markdown += "Content-Type: multipart/form-data\n\n";
  markdown += "Request Body:\n";
  markdown += "```\n";
  markdown += "image: File (Image file - .jpg, .png, atau .webp)\n";
  markdown += "```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(sampleHeroBanner, null, 2);
  markdown += "\n```\n\n";

  // Error Responses
  markdown += "## Error Responses\n\n";

  markdown += "### File Type Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
    },
    null,
    2
  );
  markdown += "\n```\n\n";

  markdown += "### File Size Error (400 Bad Request)\n```json\n";
  markdown += JSON.stringify(
    {
      error: "File too large. Maximum size is 5MB"
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
  const outputPath = path.join(__dirname, "hero-banner-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`API documentation generated successfully at ${outputPath}`);
}

generateApiDocs();