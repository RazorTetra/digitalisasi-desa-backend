// src/docs/generateUserApiDocs.ts

import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Define Zod schemas
const UserSchema = z.object({
  id: z.string().uuid(),
  namaDepan: z.string(),
  namaBelakang: z.string(),
  nomorHp: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
});

const UserInputSchema = UserSchema.omit({ id: true }).extend({
  password: z.string().min(8),
});

const AdminInputSchema = UserInputSchema.extend({
  password: z.string().min(12), // Stronger password for admins
});

const UserUpdateSchema = UserInputSchema.partial();

const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SuccessResponse = z.object({
  status: z.literal('success'),
  data: z.unknown(),
});

const ErrorResponse = z.object({
  error: z.string(),
  details: z.array(z.object({
    message: z.string(),
  })).optional(),
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
    nomorHp: "081234567890",
    email: "john.doe@example.com",
    password: "securepassword",
    role: "USER"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Success - 201 Created):\n```json\n';
  markdown += JSON.stringify(UserSchema.parse({
    id: "e6314752-c753-47dc-bc82-eae480d1b094",
    namaDepan: "John",
    namaBelakang: "Doe",
    nomorHp: "081234567890",
    email: "john.doe@example.com",
    role: "USER"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed - 400 Bad Request):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    error: "Invalid input",
    details: [
      {
        message: "Invalid email format"
      }
    ]
  }), null, 2);
  markdown += '\n```\n\n';

  // Add Register Admin
  markdown += '## Register Admin\n';
  markdown += 'Endpoint: POST /api/v1/auth/register-admin\n';
  markdown += 'Authentication: Required (Admin only)\n\n';
  markdown += 'Request Body:\n```json\n';
  markdown += JSON.stringify(AdminInputSchema.parse({
    namaDepan: "Admin",
    namaBelakang: "User",
    nomorHp: "081234567890",
    email: "admin@example.com",
    password: "secureAdminPassword123",
    role: "ADMIN"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Success - 201 Created):\n```json\n';
  markdown += JSON.stringify(SuccessResponse.parse({
    status: "success",
    data: {
      message: "Admin registration successful",
      userId: "f7314752-c753-47dc-bc82-eae480d1b095",
      role: "ADMIN"
    }
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed - 400 Bad Request):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    error: "Invalid input",
    details: [
      {
        message: "Password must be at least 12 characters long"
      }
    ]
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed - 403 Forbidden):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    error: "Access denied. Admin privileges required."
  }), null, 2);
  markdown += '\n```\n\n';

  // Get All Users
  markdown += '## Get All Users\n';
  markdown += 'Endpoint: GET /api/v1/users\n';
  markdown += 'Authentication: Required\n\n';
  markdown += 'Response Body (Success - 200 OK):\n```json\n';
  markdown += JSON.stringify([UserSchema.parse({
    id: "e6314752-c753-47dc-bc82-eae480d1b094",
    namaDepan: "John",
    namaBelakang: "Doe",
    nomorHp: "081234567890",
    email: "john.doe@example.com",
    role: "USER"
  })], null, 2);
  markdown += '\n```\n\n';

  // Get User by ID
  markdown += '## Get User by ID\n';
  markdown += 'Endpoint: GET /api/v1/users/:id\n';
  markdown += 'Authentication: Required\n\n';
  markdown += 'Response Body (Success - 200 OK):\n```json\n';
  markdown += JSON.stringify(UserSchema.parse({
    id: "e6314752-c753-47dc-bc82-eae480d1b094",
    namaDepan: "John",
    namaBelakang: "Doe",
    nomorHp: "081234567890",
    email: "john.doe@example.com",
    role: "USER"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed - 404 Not Found):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    error: "User not found"
  }), null, 2);
  markdown += '\n```\n\n';

  // Update User
  markdown += '## Update User\n';
  markdown += 'Endpoint: PUT /api/v1/users/:id\n';
  markdown += 'Authentication: Required\n\n';
  markdown += 'Request Body:\n```json\n';
  markdown += JSON.stringify(UserUpdateSchema.parse({
    namaDepan: "Jane",
    nomorHp: "087654321098"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Success - 200 OK):\n```json\n';
  markdown += JSON.stringify(UserSchema.parse({
    id: "e6314752-c753-47dc-bc82-eae480d1b094",
    namaDepan: "Jane",
    namaBelakang: "Doe",
    nomorHp: "087654321098",
    email: "john.doe@example.com",
    role: "USER"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed - 404 Not Found):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    error: "User not found"
  }), null, 2);
  markdown += '\n```\n\n';

  // Delete User
  markdown += '## Delete User\n';
  markdown += 'Endpoint: DELETE /api/v1/users/:id\n';
  markdown += 'Authentication: Required\n\n';
  markdown += 'Response (Success - 204 No Content): No body\n\n';
  markdown += 'Response Body (Failed - 404 Not Found):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    error: "User not found"
  }), null, 2);
  markdown += '\n```\n\n';

  // Login User
  markdown += '## Login User\n';
  markdown += 'Endpoint: POST /api/v1/auth/login\n';
  markdown += 'Authentication: Not Required\n\n';
  markdown += 'Request Body:\n```json\n';
  markdown += JSON.stringify(LoginInputSchema.parse({
    email: "john.doe@example.com",
    password: "securepassword"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Success - 200 OK):\n```json\n';
  markdown += JSON.stringify(SuccessResponse.parse({
    status: "success",
    data: {
      message: "Login successful"
    }
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Response Body (Failed - 401 Unauthorized):\n```json\n';
  markdown += JSON.stringify(ErrorResponse.parse({
    error: "Invalid email or password"
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Note: On successful login, an HTTP-only cookie named "accessToken" will be set with a 1-day expiration.\n\n';

  // Logout User
  markdown += '## Logout User\n';
  markdown += 'Endpoint: POST /api/v1/auth/logout\n';
  markdown += 'Authentication: Required\n\n';
  markdown += 'Request Body: None\n\n';
  markdown += 'Response Body (Success - 200 OK):\n```json\n';
  markdown += JSON.stringify(SuccessResponse.parse({
    status: "success",
    data: {
      message: "Logout successful"
    }
  }), null, 2);
  markdown += '\n```\n\n';
  markdown += 'Note: On successful logout, the "accessToken" cookie will be cleared.\n\n';

  // Write to file
  const outputPath = path.join(__dirname, 'user-api-spec.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`User API documentation generated successfully at ${outputPath}`);
}

generateUserApiDocs();