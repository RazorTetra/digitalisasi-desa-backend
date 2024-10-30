# Finance Management API Specification

## Public Endpoints

### Get Finance Banner
Endpoint: GET /api/v1/finance/banner
Description: Mendapatkan banner keuangan
Authentication: Not Required

Response Body (200 OK):
```json
{
  "id": "ffd8c975-56aa-426d-9d6e-3a9c5cb45454",
  "imageUrl": "https://example.com/banner.jpg",
  "createdAt": "2024-10-30T16:09:03.677Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Get Finance Info
Endpoint: GET /api/v1/finance/info
Description: Mendapatkan informasi dasar keuangan
Authentication: Not Required

Response Body (200 OK):
```json
{
  "id": "b05df643-7d98-44bd-bfab-6a2560e258fa",
  "content": "Informasi keuangan desa",
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Get All Periods
Endpoint: GET /api/v1/finance/periods
Description: Mendapatkan daftar semua periode keuangan
Authentication: Not Required

Response Body (200 OK):
```json
[
  {
    "id": "039dad63-9313-48e6-bae2-f123ce84ed8a",
    "tahun": 2024,
    "createdAt": "2024-10-30T16:09:03.678Z",
    "updatedAt": "2024-10-30T16:09:03.678Z"
  }
]
```

### Get Period By Id
Endpoint: GET /api/v1/finance/periods/:id
Description: Mendapatkan detail periode keuangan dengan ringkasan
Authentication: Not Required

Response Body (200 OK):
```json
{
  "id": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "tahun": 2024,
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z",
  "incomes": [
    {
      "id": "f8e39062-ce56-4420-b3b5-ff936482e5eb",
      "uraian": "Pendapatan Asli Desa",
      "dana": 50000000,
      "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
      "createdAt": "2024-10-30T16:09:03.678Z",
      "updatedAt": "2024-10-30T16:09:03.678Z"
    }
  ],
  "expenses": [
    {
      "id": "9d548cff-28bc-4ff6-8a5e-aeb4dcfb7623",
      "uraian": "Belanja Pegawai",
      "dana": 25000000,
      "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
      "createdAt": "2024-10-30T16:09:03.678Z",
      "updatedAt": "2024-10-30T16:09:03.678Z"
    }
  ],
  "financings": [
    {
      "id": "6a6bfeb2-fea6-4f20-b78e-b89914c17370",
      "uraian": "Penerimaan Pembiayaan",
      "dana": 10000000,
      "jenis": "PENERIMAAN",
      "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
      "createdAt": "2024-10-30T16:09:03.678Z",
      "updatedAt": "2024-10-30T16:09:03.678Z"
    }
  ],
  "summary": {
    "jumlahPendapatan": 50000000,
    "jumlahBelanja": 25000000,
    "surplusDefisit": 25000000,
    "pembiayaanNeto": 10000000
  }
}
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Update Finance Banner
Endpoint: PUT /api/v1/finance/banner
Description: Mengubah banner keuangan
Authentication: Required (Admin)

Request Body: multipart/form-data
- file: Image file (jpg, png, webp)

Response: Same as Get Finance Banner

### Update Finance Info
Endpoint: PUT /api/v1/finance/info
Description: Mengubah informasi dasar keuangan
Authentication: Required (Admin)

Request Body:
```json
{
  "content": "Informasi keuangan desa"
}
```

Response: Same as Get Finance Info

### Create Period
Endpoint: POST /api/v1/finance/periods
Description: Membuat periode keuangan baru
Authentication: Required (Admin)

Request Body:
```json
{
  "tahun": 2024
}
```

Response Body (201 Created):
```json
{
  "id": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "tahun": 2024,
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z",
  "incomes": [],
  "expenses": [],
  "financings": []
}
```

### Add Income
Endpoint: POST /api/v1/finance/periods/:periodId/income
Description: Menambah item pendapatan
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "Pendapatan Asli Desa",
  "dana": 50000000
}
```

Response Body (201 Created):
```json
{
  "id": "f8e39062-ce56-4420-b3b5-ff936482e5eb",
  "uraian": "Pendapatan Asli Desa",
  "dana": 50000000,
  "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Add Expense
Endpoint: POST /api/v1/finance/periods/:periodId/expense
Description: Menambah item belanja
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "Belanja Pegawai",
  "dana": 25000000
}
```

Response Body (201 Created):
```json
{
  "id": "9d548cff-28bc-4ff6-8a5e-aeb4dcfb7623",
  "uraian": "Belanja Pegawai",
  "dana": 25000000,
  "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Add Financing
Endpoint: POST /api/v1/finance/periods/:periodId/financing
Description: Menambah item pembiayaan
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "Penerimaan Pembiayaan",
  "dana": 10000000,
  "jenis": "PENERIMAAN"
}
```

Response Body (201 Created):
```json
{
  "id": "6a6bfeb2-fea6-4f20-b78e-b89914c17370",
  "uraian": "Penerimaan Pembiayaan",
  "dana": 10000000,
  "jenis": "PENERIMAAN",
  "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Update Period
Endpoint: PUT /api/v1/finance/periods/:id
Description: Mengubah tahun periode
Authentication: Required (Admin)

Request Body:
```json
{
  "tahun": 2024
}
```

Response Body (200 OK):
```json
{
  "id": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "tahun": 2024,
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

Error Responses:
- 404 Not Found: Period tidak ditemukan
- 409 Conflict: Tahun periode sudah ada

### Update Income
Endpoint: PUT /api/v1/finance/income/:id
Description: Mengubah item pendapatan
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "Pendapatan Asli Desa",
  "dana": 50000000
}
```

Response Body (200 OK):
```json
{
  "id": "f8e39062-ce56-4420-b3b5-ff936482e5eb",
  "uraian": "Pendapatan Asli Desa",
  "dana": 50000000,
  "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Update Expense
Endpoint: PUT /api/v1/finance/expense/:id
Description: Mengubah item belanja
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "Belanja Pegawai",
  "dana": 25000000
}
```

Response Body (200 OK):
```json
{
  "id": "9d548cff-28bc-4ff6-8a5e-aeb4dcfb7623",
  "uraian": "Belanja Pegawai",
  "dana": 25000000,
  "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Update Financing
Endpoint: PUT /api/v1/finance/financing/:id
Description: Mengubah item pembiayaan
Authentication: Required (Admin)

Request Body:
```json
{
  "uraian": "Penerimaan Pembiayaan",
  "dana": 10000000,
  "jenis": "PENERIMAAN"
}
```

Response Body (200 OK):
```json
{
  "id": "6a6bfeb2-fea6-4f20-b78e-b89914c17370",
  "uraian": "Penerimaan Pembiayaan",
  "dana": 10000000,
  "jenis": "PENERIMAAN",
  "periodId": "039dad63-9313-48e6-bae2-f123ce84ed8a",
  "createdAt": "2024-10-30T16:09:03.678Z",
  "updatedAt": "2024-10-30T16:09:03.678Z"
}
```

### Delete Period
Endpoint: DELETE /api/v1/finance/periods/:id
Description: Menghapus periode beserta semua data terkait (cascade delete)
Authentication: Required (Admin)

Response: 204 No Content

Error Responses:
- 404 Not Found: Period tidak ditemukan

### Delete Income
Endpoint: DELETE /api/v1/finance/income/:id
Description: Menghapus item pendapatan
Authentication: Required (Admin)

Response: 204 No Content

### Delete Expense
Endpoint: DELETE /api/v1/finance/expense/:id
Description: Menghapus item belanja
Authentication: Required (Admin)

Response: 204 No Content

### Delete Financing
Endpoint: DELETE /api/v1/finance/financing/:id
Description: Menghapus item pembiayaan
Authentication: Required (Admin)

Response: 204 No Content

Error Responses:
- 404 Not Found: Item tidak ditemukan

