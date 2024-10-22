# Surat Management API Specification

## Public Endpoints

### Get All Format Surat
Endpoint: GET /api/v1/surat/format
Description: Mendapatkan daftar semua format surat yang tersedia
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "6221c836-4f98-4626-b1b6-da4865124822",
    "nama": "Surat Keterangan Domisili",
    "fileUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx",
    "filename": "surat-keterangan-domisili.docx",
    "createdAt": "2024-10-22T23:05:10.820Z",
    "updatedAt": "2024-10-22T23:05:10.821Z",
    "downloadUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx"
  }
]
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Upload Format Surat
Endpoint: POST /api/v1/surat/format
Description: Upload template surat baru
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request Body:
```
nama: string (Nama surat)
file: File (Template dokumen - .doc, .docx, atau .pdf)
```

Response Body (Success - 201 Created):
```json
{
  "id": "6221c836-4f98-4626-b1b6-da4865124822",
  "nama": "Surat Keterangan Domisili",
  "fileUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx",
  "filename": "surat-keterangan-domisili.docx",
  "createdAt": "2024-10-22T23:05:10.820Z",
  "updatedAt": "2024-10-22T23:05:10.821Z",
  "downloadUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx"
}
```

### Delete Format Surat
Endpoint: DELETE /api/v1/surat/format/:id
Description: Menghapus format surat (hard delete)
Authentication: Required (Admin)

Response: 204 No Content

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "error": "Invalid input",
  "details": [
    {
      "message": "Nama is required"
    },
    {
      "message": "File template is required"
    }
  ]
}
```

### File Type Error (400 Bad Request)
```json
{
  "error": "Invalid file type. Only .doc, .docx, and .pdf files are allowed."
}
```

### Not Found Error (404 Not Found)
```json
{
  "error": "Format surat not found"
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "error": "Access token not found",
  "code": "TOKEN_MISSING"
}
```

### Authorization Error (403 Forbidden)
```json
{
  "error": "Access denied. Admin privileges required."
}
```

### File Size Error (400 Bad Request)
```json
{
  "error": "File too large. Maximum size is 5MB"
}
```

