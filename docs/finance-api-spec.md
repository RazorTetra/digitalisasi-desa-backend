# Finance API Specification

## Public Endpoints

### Get Finance Banner
Endpoint: GET /api/v1/finance/banner
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "90c15f97-c670-4d17-aae9-f0018df2c39a",
  "imageUrl": "https://cloudinary.com/example.jpg",
  "createdAt": "2024-10-24T10:34:07.474Z",
  "updatedAt": "2024-10-24T10:34:07.475Z"
}
```

### Get Finance Info
Endpoint: GET /api/v1/finance/info
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "3a4fab6c-70c7-4ec1-9cca-a152a5d58094",
  "content": "Informasi keuangan desa akan ditampilkan di sini",
  "createdAt": "2024-10-24T10:34:07.475Z",
  "updatedAt": "2024-10-24T10:34:07.475Z"
}
```

### Get Income Items
Endpoint: GET /api/v1/finance/income
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "2ee3bc7b-26fc-4236-bd4b-c2827c57272f",
    "uraian": "DANA DESA",
    "anggaran": 781754000,
    "realisasi": 781754000,
    "createdAt": "2024-10-24T10:34:07.475Z",
    "updatedAt": "2024-10-24T10:34:07.475Z"
  }
]
```

### Get Expense Items
Endpoint: GET /api/v1/finance/expense
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "ee55406a-3862-4f66-bcf8-3b7073f22942",
    "uraian": "BIDANG PENYELENGGARAAN PEMERINTAH DESA",
    "anggaran": 401501414,
    "realisasi": 401806138,
    "createdAt": "2024-10-24T10:34:07.475Z",
    "updatedAt": "2024-10-24T10:34:07.475Z"
  }
]
```

### Get Financing Items
Endpoint: GET /api/v1/finance/financing
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "e0f75151-52ee-4bf7-815e-b8e956ea2ac5",
    "uraian": "PENERIMAAN PEMBIAYAAN",
    "anggaran": 237734,
    "realisasi": 237734,
    "createdAt": "2024-10-24T10:34:07.475Z",
    "updatedAt": "2024-10-24T10:34:07.475Z"
  }
]
```

### Get Finance Summary
Endpoint: GET /api/v1/finance/summary
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "totalPendapatan": {
    "anggaran": 1152830600,
    "realisasi": 1151420600,
    "sisa": 861463
  },
  "totalBelanja": {
    "anggaran": 1138068334,
    "realisasi": 1136963058,
    "sisa": 1105276,
    "jumlahPendapatan": 1151420600,
    "surplusDefisit": -14762266
  },
  "totalPembiayaan": {
    "anggaran": 15237734,
    "realisasi": 15237734,
    "sisa": 0,
    "pembiayaanNetto": -14762266,
    "sisaLebihPembiayaanAnggaran": 0
  }
}
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Update Finance Banner
Endpoint: PUT /api/v1/finance/banner
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request Body:
```
file: File (image)
```

Response Body (Success - 200 OK):
```json
{
  "id": "90c15f97-c670-4d17-aae9-f0018df2c39a",
  "imageUrl": "https://cloudinary.com/example.jpg",
  "createdAt": "2024-10-24T10:34:07.474Z",
  "updatedAt": "2024-10-24T10:34:07.475Z"
}
```

### Update Finance Info
Endpoint: PUT /api/v1/finance/info
Authentication: Required (Admin)

Request Body:
```json
{
  "content": "Informasi keuangan desa terbaru"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "3a4fab6c-70c7-4ec1-9cca-a152a5d58094",
  "content": "Informasi keuangan desa akan ditampilkan di sini",
  "createdAt": "2024-10-24T10:34:07.475Z",
  "updatedAt": "2024-10-24T10:34:07.475Z"
}
```

### Create Income Item
Endpoint: POST /api/v1/finance/income
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "DANA DESA",
  "anggaran": 781754000,
  "realisasi": 781754000
}
```

### Update Income Item
Endpoint: PUT /api/v1/finance/income/:id
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "DANA DESA",
  "anggaran": 781754000,
  "realisasi": 781754000
}
```

### Delete Income Item
Endpoint: DELETE /api/v1/finance/income/:id
Authentication: Required (Admin)

Response: 204 No Content

### Create Expense Item
Endpoint: POST /api/v1/finance/expense
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "BIDANG PENYELENGGARAAN PEMERINTAH DESA",
  "anggaran": 401501414,
  "realisasi": 401806138
}
```

### Update Expense Item
Endpoint: PUT /api/v1/finance/expense/:id
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "BIDANG PENYELENGGARAAN PEMERINTAH DESA",
  "anggaran": 401501414,
  "realisasi": 401806138
}
```

### Delete Expense Item
Endpoint: DELETE /api/v1/finance/expense/:id
Authentication: Required (Admin)

Response: 204 No Content

### Create Financing Item
Endpoint: POST /api/v1/finance/financing
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "PENERIMAAN PEMBIAYAAN",
  "anggaran": 237734,
  "realisasi": 237734
}
```

### Update Financing Item
Endpoint: PUT /api/v1/finance/financing/:id
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "PENERIMAAN PEMBIAYAAN",
  "anggaran": 237734,
  "realisasi": 237734
}
```

### Delete Financing Item
Endpoint: DELETE /api/v1/finance/financing/:id
Authentication: Required (Admin)

Response: 204 No Content

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "error": "Invalid input",
  "details": [
    {
      "message": "Uraian tidak boleh kosong"
    },
    {
      "message": "Anggaran harus berupa angka"
    }
  ]
}
```

### Not Found Error (404 Not Found)
```json
{
  "error": "Item not found"
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "error": "Access token not found",
  "code": "TOKEN_MISSING"
}
```

### Permission Error (403 Forbidden)
```json
{
  "error": "Access denied. Admin privileges required."
}
```

