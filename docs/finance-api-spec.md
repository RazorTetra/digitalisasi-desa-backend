# Finance Management API Specification

## Public Endpoints

### Get Finance Banner
Endpoint: GET /api/v1/finance/banner
Description: Mendapatkan banner keuangan
Authentication: Not Required

Response Body (200 OK):
```json
{
  "id": "a9a43a35-7d77-4b7b-8ee8-e6bb3feb78c2",
  "imageUrl": "https://example.com/banner.jpg",
  "createdAt": "2024-10-30T12:06:22.193Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
}
```

### Get Finance Info
Endpoint: GET /api/v1/finance/info
Description: Mendapatkan informasi dasar keuangan
Authentication: Not Required

Response Body (200 OK):
```json
{
  "id": "af7489ac-112d-42e6-ae21-1f2b44c41162",
  "content": "Informasi keuangan desa",
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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
    "id": "c89e3f77-84e9-4b48-ac47-e2c766408588",
    "tahun": 2024,
    "createdAt": "2024-10-30T12:06:22.194Z",
    "updatedAt": "2024-10-30T12:06:22.194Z"
  }
]
```

### Get Latest Period
Endpoint: GET /api/v1/finance/periods/latest
Description: Mendapatkan periode terbaru dengan ringkasan keuangan
Authentication: Not Required

Response Body (200 OK):
```json
{
  "id": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "tahun": 2024,
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z",
  "incomes": [
    {
      "id": "fbdf5534-983f-403c-bdbb-00745d1c2ec9",
      "uraian": "Pendapatan Asli Desa",
      "dana": 50000000,
      "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
      "createdAt": "2024-10-30T12:06:22.194Z",
      "updatedAt": "2024-10-30T12:06:22.194Z"
    }
  ],
  "expenses": [
    {
      "id": "d01098b4-74bf-41eb-ac62-0f7ef49688c6",
      "uraian": "Belanja Pegawai",
      "dana": 25000000,
      "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
      "createdAt": "2024-10-30T12:06:22.194Z",
      "updatedAt": "2024-10-30T12:06:22.194Z"
    }
  ],
  "financings": [
    {
      "id": "fbebea6a-c28b-415a-bd80-b68807b37d32",
      "uraian": "Penerimaan Pembiayaan",
      "dana": 10000000,
      "jenis": "PENERIMAAN",
      "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
      "createdAt": "2024-10-30T12:06:22.194Z",
      "updatedAt": "2024-10-30T12:06:22.194Z"
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

### Get Period By Id
Endpoint: GET /api/v1/finance/periods/:id
Description: Mendapatkan detail periode keuangan dengan ringkasan
Authentication: Not Required

Response Body (200 OK):
```json
{
  "id": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "tahun": 2024,
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z",
  "incomes": [
    {
      "id": "fbdf5534-983f-403c-bdbb-00745d1c2ec9",
      "uraian": "Pendapatan Asli Desa",
      "dana": 50000000,
      "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
      "createdAt": "2024-10-30T12:06:22.194Z",
      "updatedAt": "2024-10-30T12:06:22.194Z"
    }
  ],
  "expenses": [
    {
      "id": "d01098b4-74bf-41eb-ac62-0f7ef49688c6",
      "uraian": "Belanja Pegawai",
      "dana": 25000000,
      "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
      "createdAt": "2024-10-30T12:06:22.194Z",
      "updatedAt": "2024-10-30T12:06:22.194Z"
    }
  ],
  "financings": [
    {
      "id": "fbebea6a-c28b-415a-bd80-b68807b37d32",
      "uraian": "Penerimaan Pembiayaan",
      "dana": 10000000,
      "jenis": "PENERIMAAN",
      "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
      "createdAt": "2024-10-30T12:06:22.194Z",
      "updatedAt": "2024-10-30T12:06:22.194Z"
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
  "id": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "tahun": 2024,
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z",
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
  "id": "fbdf5534-983f-403c-bdbb-00745d1c2ec9",
  "uraian": "Pendapatan Asli Desa",
  "dana": 50000000,
  "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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
  "id": "d01098b4-74bf-41eb-ac62-0f7ef49688c6",
  "uraian": "Belanja Pegawai",
  "dana": 25000000,
  "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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
  "id": "fbebea6a-c28b-415a-bd80-b68807b37d32",
  "uraian": "Penerimaan Pembiayaan",
  "dana": 10000000,
  "jenis": "PENERIMAAN",
  "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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
  "id": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "tahun": 2024,
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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
  "id": "fbdf5534-983f-403c-bdbb-00745d1c2ec9",
  "uraian": "Pendapatan Asli Desa",
  "dana": 50000000,
  "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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
  "id": "d01098b4-74bf-41eb-ac62-0f7ef49688c6",
  "uraian": "Belanja Pegawai",
  "dana": 25000000,
  "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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
  "id": "fbebea6a-c28b-415a-bd80-b68807b37d32",
  "uraian": "Penerimaan Pembiayaan",
  "dana": 10000000,
  "jenis": "PENERIMAAN",
  "periodId": "c89e3f77-84e9-4b48-ac47-e2c766408588",
  "createdAt": "2024-10-30T12:06:22.194Z",
  "updatedAt": "2024-10-30T12:06:22.194Z"
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

