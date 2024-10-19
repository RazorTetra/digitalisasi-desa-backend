# API Specification

## Kategori API

### Get All Kategori
Endpoint: GET /api/v1/kategori
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "cb37966a-30e6-4662-8d99-08a4a83ce10e",
    "nama": "Kesehatan"
  }
]
```

### Create Kategori
Endpoint: POST /api/v1/kategori
Authentication: Required (Admin only)

Request Body:
```json
{
  "nama": "Ekonomi"
}
```

Response Body (Success - 201 Created):
```json
{
  "id": "53a98954-88fe-46b6-9b6e-ef31af7ea856",
  "nama": "Ekonomi"
}
```

### Update Kategori
Endpoint: PUT /api/v1/kategori/:id
Authentication: Required (Admin only)

Request Body:
```json
{
  "nama": "Ekonomi dan Bisnis"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "9dd16108-18a8-422b-aaf4-8113339de006",
  "nama": "Ekonomi dan Bisnis"
}
```

### Delete Kategori
Endpoint: DELETE /api/v1/kategori/:id
Authentication: Required (Admin only)

Response (Success - 204 No Content): No body

## Pengumuman API

### Get All Pengumuman
Endpoint: GET /api/v1/pengumuman
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "9adc32f3-4236-4624-ab5b-6b49a7eac135",
    "judul": "Jadwal Vaksinasi COVID-19",
    "isi": "Vaksinasi COVID-19 tahap kedua akan dilaksanakan pada tanggal 15 Juli 2024...",
    "tanggal": "2024-10-19T11:02:09.360Z",
    "kategoriId": "3a284542-1cbb-4f1a-b27c-197bebe7e885",
    "createdAt": "2024-10-19T11:02:09.361Z",
    "updatedAt": "2024-10-19T11:02:09.361Z"
  }
]
```

### Get Pengumuman by ID
Endpoint: GET /api/v1/pengumuman/:id
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "229fb6d3-5a2e-4a1c-a3ea-8f11a04b0380",
  "judul": "Jadwal Vaksinasi COVID-19",
  "isi": "Vaksinasi COVID-19 tahap kedua akan dilaksanakan pada tanggal 15 Juli 2024...",
  "tanggal": "2024-10-19T11:02:09.362Z",
  "kategoriId": "0cbe8f4e-a975-4250-b246-6a2c32b4b4eb",
  "createdAt": "2024-10-19T11:02:09.362Z",
  "updatedAt": "2024-10-19T11:02:09.362Z"
}
```

### Create Pengumuman
Endpoint: POST /api/v1/pengumuman
Authentication: Required (Admin only)

Request Body:
```json
{
  "judul": "Pembukaan Pendaftaran UMKM",
  "isi": "Pendaftaran UMKM untuk program bantuan modal usaha dibuka mulai 1 Agustus 2024...",
  "tanggal": "2024-10-19T11:02:09.362Z",
  "kategoriId": "01fa733e-eb2d-4735-b3fd-3c1ab515ecb3"
}
```

Response Body (Success - 201 Created):
```json
{
  "id": "8ff6ec49-05d7-4822-af23-1fc53093a222",
  "judul": "Pembukaan Pendaftaran UMKM",
  "isi": "Pendaftaran UMKM untuk program bantuan modal usaha dibuka mulai 1 Agustus 2024...",
  "tanggal": "2024-10-19T11:02:09.362Z",
  "kategoriId": "fc5238a9-0f94-42d7-af7b-46092efbaf42",
  "createdAt": "2024-10-19T11:02:09.362Z",
  "updatedAt": "2024-10-19T11:02:09.362Z"
}
```

### Update Pengumuman
Endpoint: PUT /api/v1/pengumuman/:id
Authentication: Required (Admin only)

Request Body:
```json
{
  "judul": "Update: Pembukaan Pendaftaran UMKM",
  "isi": "Pendaftaran UMKM untuk program bantuan modal usaha diperpanjang hingga 15 Agustus 2024...",
  "kategoriId": "8ffc2794-5c98-4c7c-887d-9d3c556e7420"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "cd8f02a0-58ff-4c0a-8509-c86ea2870b97",
  "judul": "Update: Pembukaan Pendaftaran UMKM",
  "isi": "Pendaftaran UMKM untuk program bantuan modal usaha diperpanjang hingga 15 Agustus 2024...",
  "tanggal": "2024-10-19T11:02:09.362Z",
  "kategoriId": "60e80768-7d9b-4023-a1a8-12786917ca05",
  "createdAt": "2024-10-19T11:02:09.362Z",
  "updatedAt": "2024-10-19T11:02:09.362Z"
}
```

### Delete Pengumuman
Endpoint: DELETE /api/v1/pengumuman/:id
Authentication: Required (Admin only)

Response (Success - 204 No Content): No body

