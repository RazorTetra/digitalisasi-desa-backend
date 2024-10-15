import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Define Zod schemas
const UserSchema = z.object({
  id: z.string().uuid(),
  namaDepan: z.string(),
  namaBelakang: z.string(),
  kelas: z.string().optional(),
  nomorHp: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'SISWA']),
});

const UserInputSchema = UserSchema.omit({ id: true }).extend({
  password: z.string().min(8),
});

const SuccessResponse = z.object({
  status: z.literal('success'),
  data: z.unknown(),
});

const ErrorResponse = z.object({
  errors: z.array(z.object({
    message: z.string(),
  })),
});

// Function to generate Markdown documentation
function generateUserApiDocs() {
  let markdown = '# User API Specification\n\n';

  // Create User
  markdown += '## Create User\n';
  markdown += 'Endpoint: POST /api/v1/users\n';
  markdown += 'Authentication: Required\n\n';
  markdown += 'Request Body:\n```json\n';
  markdown += JSON.stringify(UserInputSchema.parse({
    namaDepan: "John",
    namaBelakang: "Doe",
    kelas: "12A",
    nomorHp: "081234567890",
    email: "john.doe@example.com",
    password: "securepassword",
    role: "SISWA"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Success):\n```json\n';
  markdown += JSON.stringify(SuccessResponse.parse({
    status: "success",
    data: {
      id: "e6314752-c753-47dc-bc82-eae480d1b094"
    }
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    errors: [
      {
        message: "Internal Server Error"
      }
    ]
  }), null, 2);
  markdown += '\n```\n\n';

  // Get All Users
  markdown += '## Get All Users\n';
  markdown += 'Endpoint: GET /api/v1/users\n';
  markdown += 'Authentication: Required\n\n';
  markdown += 'Response Body (Success):\n```json\n';
  markdown += JSON.stringify(SuccessResponse.parse({
    status: "success",
    data: [UserSchema.parse({
      id: "e6314752-c753-47dc-bc82-eae480d1b094",
      namaDepan: "John",
      namaBelakang: "Doe",
      kelas: "12A",
      nomorHp: "081234567890",
      email: "john.doe@example.com",
      role: "SISWA"
    })]
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    errors: [
      {
        message: "Internal Server Error"
      }
    ]
  }), null, 2);
  markdown += '\n```\n\n';

  // Add more endpoints as needed...

  // Write to file
  const outputPath = path.join(__dirname, 'user-api-spec.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`User API documentation generated successfully at ${outputPath}`);
}

generateUserApiDocs();