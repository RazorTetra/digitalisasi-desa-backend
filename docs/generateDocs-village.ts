// src/docs/generateVillageApiDocs.ts

import { z } from "zod";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Define Zod schemas
const VillageInfoSchema = z.object({
  id: z.string().uuid(),
  history: z.string(),
});

const VillageStructureSchema = z.object({
  id: z.string().uuid(),
  position: z.string(),
  name: z.string(),
});

const GallerySchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string().url(),
  description: z.string().optional(),
});

const SocialMediaSchema = z.object({
  id: z.string().uuid(),
  platform: z.string(),
  url: z.string().url(),
});


const ErrorResponse = z.object({
  error: z.string(),
  details: z.array(
    z.object({
      message: z.string(),
    })
  ).optional(),
});

// Function to generate Markdown documentation
function generateVillageApiDocs() {
  let markdown = "# Village Information API Specification\n\n";

  // Get Village Info
  markdown += "## Get Village Info\n";
  markdown += "Endpoint: GET /api/v1/village/info\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    VillageInfoSchema.parse({
      id: uuidv4(),
      history: "The village of Tandengan was founded in 1809...",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Update Village Info
  markdown += "## Update Village Info\n";
  markdown += "Endpoint: PUT /api/v1/village/info\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    { history: "The village of Tandengan was founded in 1809..." },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    VillageInfoSchema.parse({
      id: uuidv4(),
      history: "The village of Tandengan was founded in 1809...",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Failed - 403 Forbidden):\n```json\n";
  markdown += JSON.stringify(
    ErrorResponse.parse({
      error: "Access denied. Admin privileges required.",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Get Village Structure
  markdown += "## Get Village Structure\n";
  markdown += "Endpoint: GET /api/v1/village/structure\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    [
      VillageStructureSchema.parse({
        id: uuidv4(),
        position: "Village Head",
        name: "John Doe",
      }),
    ],
    null,
    2
  );
  markdown += "\n```\n\n";

  // Create Village Structure
  markdown += "## Create Village Structure\n";
  markdown += "Endpoint: POST /api/v1/village/structure\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      position: "Village Secretary",
      name: "Jane Smith",
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify(
    VillageStructureSchema.parse({
      id: uuidv4(),
      position: "Village Secretary",
      name: "Jane Smith",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Update Village Structure
  markdown += "## Update Village Structure\n";
  markdown += "Endpoint: PUT /api/v1/village/structure/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      name: "Jane Doe",
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    VillageStructureSchema.parse({
      id: uuidv4(),
      position: "Village Secretary",
      name: "Jane Doe",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Delete Village Structure
  markdown += "## Delete Village Structure\n";
  markdown += "Endpoint: DELETE /api/v1/village/structure/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Response (Success - 204 No Content): No body\n\n";

  // Get Gallery
  markdown += "## Get Gallery\n";
  markdown += "Endpoint: GET /api/v1/village/gallery\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    [
      GallerySchema.parse({
        id: uuidv4(),
        imageUrl: "https://example.com/image1.jpg",
        description: "Village square",
      }),
    ],
    null,
    2
  );
  markdown += "\n```\n\n";

  // Add Gallery Image
  markdown += "## Add Gallery Image\n";
  markdown += "Endpoint: POST /api/v1/village/gallery\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body: multipart/form-data\n";
  markdown += "- image: File\n";
  markdown += "- description: String (optional)\n\n";
  markdown += "Response Body (Success - 201 Created):\n```json\n";
  markdown += JSON.stringify(
    GallerySchema.parse({
      id: uuidv4(),
      imageUrl: "https://example.com/image2.jpg",
      description: "Village festival",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Delete Gallery Image
  markdown += "## Delete Gallery Image\n";
  markdown += "Endpoint: DELETE /api/v1/village/gallery/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Response (Success - 204 No Content): No body\n\n";

  // Get Social Media
  markdown += "## Get Social Media\n";
  markdown += "Endpoint: GET /api/v1/village/social-media\n";
  markdown += "Authentication: Not Required\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    [
      SocialMediaSchema.parse({
        id: uuidv4(),
        platform: "Facebook",
        url: "https://facebook.com/villageofficial",
      }),
    ],
    null,
    2
  );
  markdown += "\n```\n\n";

  // Update Social Media
  markdown += "## Update Social Media\n";
  markdown += "Endpoint: PUT /api/v1/village/social-media/:id\n";
  markdown += "Authentication: Required (Admin only)\n\n";
  markdown += "Request Body:\n```json\n";
  markdown += JSON.stringify(
    {
      url: "https://facebook.com/villagenewofficialpage",
    },
    null,
    2
  );
  markdown += "\n```\n\n";
  markdown += "Response Body (Success - 200 OK):\n```json\n";
  markdown += JSON.stringify(
    SocialMediaSchema.parse({
      id: uuidv4(),
      platform: "Facebook",
      url: "https://facebook.com/villagenewofficialpage",
    }),
    null,
    2
  );
  markdown += "\n```\n\n";

  // Write to file
  const outputPath = path.join(__dirname, "village-api-spec.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`Village API documentation generated successfully at ${outputPath}`);
}

generateVillageApiDocs();