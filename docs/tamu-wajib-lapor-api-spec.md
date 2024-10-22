# Tamu Wajib Lapor API Specification

## Public Endpoints

### Submit Laporan Tamu
Endpoint: POST /api/v1/tamu-wajib-lapor
Authentication: Not Required

Request Body:
```json
{
  "nama": "John Doe",
  "nik": "1234567890123456",
  "alamatAsal": "Jl. Contoh No. 123, Jakarta",
  "tujuan": "Liburan",
  "lamaMenginap": "4-7",
  "tempatMenginap": "Villa Indah, Jl. Danau No. 45",
  "nomorTelepon": "08123456789"
}
```

### Check Status by Tracking Code
Endpoint: GET /api/v1/tamu-wajib-lapor/status/:trackingCode
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "status": "APPROVED",
  "statusMessage": "Dokumen lengkap dan valid",
  "createdAt": "2024-10-22T07:58:02.794Z",
  "updatedAt": "2024-10-22T07:58:02.795Z"
}
```

### Get Recent Submissions
Endpoint: GET /api/v1/tamu-wajib-lapor/recent?limit=10
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "status": "APPROVED",
    "statusMessage": "Dokumen lengkap dan valid",
    "createdAt": "2024-10-22T07:58:02.794Z",
    "updatedAt": "2024-10-22T07:58:02.795Z"
  }
]
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Get All Laporan
Endpoint: GET /api/v1/tamu-wajib-lapor
Authentication: Required (Admin)

Response Body (Success - 200 OK):
```json
[
  {
    "id": "8bb17737-a1bc-4f80-ba48-227c783fe673",
    "trackingCode": "TWL1234ABCD",
    "nama": "John Doe",
    "nik": "1234567890123456",
    "alamatAsal": "Jl. Contoh No. 123, Jakarta",
    "tujuan": "Liburan",
    "lamaMenginap": "4-7",
    "tempatMenginap": "Villa Indah, Jl. Danau No. 45",
    "nomorTelepon": "08123456789",
    "status": "PENDING",
    "statusMessage": null,
    "createdAt": "2024-10-22T07:58:02.795Z",
    "updatedAt": "2024-10-22T07:58:02.795Z"
  }
]
```

### Get Laporan by ID
Endpoint: GET /api/v1/tamu-wajib-lapor/:id
Authentication: Required (Admin)

Response Body (Success - 200 OK):
```json
{
  "id": "8bb17737-a1bc-4f80-ba48-227c783fe673",
  "trackingCode": "TWL1234ABCD",
  "nama": "John Doe",
  "nik": "1234567890123456",
  "alamatAsal": "Jl. Contoh No. 123, Jakarta",
  "tujuan": "Liburan",
  "lamaMenginap": "4-7",
  "tempatMenginap": "Villa Indah, Jl. Danau No. 45",
  "nomorTelepon": "08123456789",
  "status": "PENDING",
  "statusMessage": null,
  "createdAt": "2024-10-22T07:58:02.795Z",
  "updatedAt": "2024-10-22T07:58:02.795Z"
}
```

### Update Status
Endpoint: PUT /api/v1/tamu-wajib-lapor/:id/status
Authentication: Required (Admin)

Request Body:
```json
{
  "status": "APPROVED",
  "statusMessage": "Dokumen lengkap dan valid"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "8bb17737-a1bc-4f80-ba48-227c783fe673",
  "trackingCode": "TWL1234ABCD",
  "nama": "John Doe",
  "nik": "1234567890123456",
  "alamatAsal": "Jl. Contoh No. 123, Jakarta",
  "tujuan": "Liburan",
  "lamaMenginap": "4-7",
  "tempatMenginap": "Villa Indah, Jl. Danau No. 45",
  "nomorTelepon": "08123456789",
  "status": "APPROVED",
  "statusMessage": "Dokumen lengkap dan valid",
  "createdAt": "2024-10-22T07:58:02.795Z",
  "updatedAt": "2024-10-22T07:58:02.795Z"
}
```

### Delete Laporan
Endpoint: DELETE /api/v1/tamu-wajib-lapor/:id
Authentication: Required (Admin)

Response: 204 No Content

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "error": "Invalid input",
  "details": [
    {
      "message": "NIK harus terdiri dari 16 digit"
    },
    {
      "message": "Nomor telepon minimal 10 digit"
    }
  ]
}
```

### Not Found Error (404 Not Found)
```json
{
  "error": "Laporan not found"
}
```

