# Surat Management API Specification

## Public Endpoints

### Get All Format Surat
Endpoint: `GET /api/v1/surat/format`

Description: Mendapatkan daftar semua format surat yang tersedia beserta jumlah unduhan

Authentication: Not Required

Parameters: None

Response Body (Success - 200 OK):
```json
[
  {
    "id": "e96108f8-c900-47c5-9529-fca787edc5c6",
    "nama": "Surat Keterangan Domisili",
    "fileUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx",
    "filename": "surat-keterangan-domisili.docx",
    "totalDownloads": 150,
    "createdAt": "2024-12-12T00:12:26.868Z",
    "updatedAt": "2024-12-12T00:12:26.869Z",
    "downloadUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx"
  }
]
```

### Track Format Surat Download
Endpoint: `POST /api/v1/surat/format/:id/download`

Description: Mencatat unduhan format surat. Harus dipanggil setiap kali user mengunduh dokumen.

Authentication: Not Required

URL Parameters:
- id: string (UUID format surat)

Request Body: None

Response Body (Success - 200 OK):
```json
{
  "message": "Download tracked successfully"
}
```

Error Responses:
1. Format Surat Not Found (404):
```json
{
  "error": "Format surat not found"
}
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Get Format Surat Download Statistics
Endpoint: `GET /api/v1/surat/format/:id/stats`

Description: Mendapatkan statistik unduhan format surat per bulan

Authentication: Required (Admin)

URL Parameters:
- id: string (UUID format surat)

Query Parameters:
- year (optional): number (Filter statistik berdasarkan tahun, format: YYYY)

Response Body (Success - 200 OK):
```json
[
  {
    "month": "January",
    "year": 2024,
    "downloadCount": 45
  },
  {
    "month": "February",
    "year": 2024,
    "downloadCount": 38
  },
  {
    "month": "March",
    "year": 2024,
    "downloadCount": 67
  }
]
```

Error Responses:
1. Format Surat Not Found (404):
```json
{
  "error": "Format surat not found"
}
```

2. Invalid Year Format (400):
```json
{
  "error": "Invalid year format"
}
```

3. Authentication Error (401):
```json
{
  "error": "Access token not found",
  "code": "TOKEN_MISSING"
}
```

4. Authorization Error (403):
```json
{
  "error": "Access denied. Admin privileges required."
}
```

### Upload Format Surat
Endpoint: `POST /api/v1/surat/format`

Description: Upload template surat baru

Authentication: Required (Admin)

Content-Type: multipart/form-data

Request Body:
```
nama: string (Nama surat)
file: File (Template dokumen - .doc, .docx, atau .pdf, max 5MB)
```

Response Body (Success - 201 Created):
```json
{
  "id": "e96108f8-c900-47c5-9529-fca787edc5c6",
  "nama": "Surat Keterangan Domisili",
  "fileUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx",
  "filename": "surat-keterangan-domisili.docx",
  "totalDownloads": 150,
  "createdAt": "2024-12-12T00:12:26.868Z",
  "updatedAt": "2024-12-12T00:12:26.869Z",
  "downloadUrl": "https://res.cloudinary.com/example/raw/upload/v1234567890/surat-templates/surat-keterangan-domisili.docx"
}
```

Error Responses:
1. Validation Error (400):
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

2. File Type Error (400):
```json
{
  "error": "Invalid file type. Only .doc, .docx, and .pdf files are allowed."
}
```

3. File Size Error (400):
```json
{
  "error": "File too large. Maximum size is 5MB"
}
```

### Delete Format Surat
Endpoint: `DELETE /api/v1/surat/format/:id`

Description: Menghapus format surat (hard delete)

Authentication: Required (Admin)

URL Parameters:
- id: string (UUID format surat)

Request Body: None

Response: 204 No Content

Error Responses:
1. Format Not Found (404):
```json
{
  "error": "Format surat not found"
}
```

2. Authentication Error (401):
```json
{
  "error": "Access token not found",
  "code": "TOKEN_MISSING"
}
```

3. Authorization Error (403):
```json
{
  "error": "Access denied. Admin privileges required."
}
```

## General Notes

1. Semua endpoint yang memerlukan autentikasi harus menyertakan token dalam cookie 'accessToken'
2. Statistik download diperbarui secara real-time setiap kali endpoint track download dipanggil
3. Statistik bulanan dihitung berdasarkan zona waktu server
4. Total downloads di response GET format surat mencakup seluruh unduhan sejak format diunggah

