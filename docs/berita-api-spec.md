# Berita Management API Specification

## Public Endpoints

### Get All Berita
Endpoint: GET /api/v1/berita
Description: Mendapatkan daftar semua berita yang tersedia
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "2e01052c-afc4-4eb0-ab3a-4e5517b41a92",
    "judul": "Pembangunan Taman Kota Dimulai",
    "slug": "pembangunan-taman-kota-dimulai",
    "ringkasan": "Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini...",
    "isi": "<p>Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini. Taman seluas 5 hektar ini akan menjadi pusat rekreasi baru bagi warga kota.</p>",
    "gambarUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/berita/taman-kota.jpg",
    "isHighlight": true,
    "penulis": "John Doe",
    "tanggal": "2024-10-24T15:08:13.254Z",
    "createdAt": "2024-10-24T15:08:13.254Z",
    "updatedAt": "2024-10-24T15:08:13.254Z",
    "kategori": [
      {
        "id": "c0adcdba-c2c6-4f48-bd56-cbbd3c1f2991",
        "nama": "Pembangunan",
        "slug": "pembangunan",
        "createdAt": "2024-10-24T15:08:13.253Z",
        "updatedAt": "2024-10-24T15:08:13.254Z"
      }
    ]
  }
]
```

### Get Highlighted Berita
Endpoint: GET /api/v1/berita/highlighted
Description: Mendapatkan daftar berita yang di-highlight
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "2e01052c-afc4-4eb0-ab3a-4e5517b41a92",
    "judul": "Pembangunan Taman Kota Dimulai",
    "slug": "pembangunan-taman-kota-dimulai",
    "ringkasan": "Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini...",
    "isi": "<p>Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini. Taman seluas 5 hektar ini akan menjadi pusat rekreasi baru bagi warga kota.</p>",
    "gambarUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/berita/taman-kota.jpg",
    "isHighlight": true,
    "penulis": "John Doe",
    "tanggal": "2024-10-24T15:08:13.254Z",
    "createdAt": "2024-10-24T15:08:13.254Z",
    "updatedAt": "2024-10-24T15:08:13.254Z",
    "kategori": [
      {
        "id": "c0adcdba-c2c6-4f48-bd56-cbbd3c1f2991",
        "nama": "Pembangunan",
        "slug": "pembangunan",
        "createdAt": "2024-10-24T15:08:13.253Z",
        "updatedAt": "2024-10-24T15:08:13.254Z"
      }
    ]
  }
]
```

### Get Single Berita
Endpoint: GET /api/v1/berita/:slug
Description: Mendapatkan detail berita berdasarkan slug
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "2e01052c-afc4-4eb0-ab3a-4e5517b41a92",
  "judul": "Pembangunan Taman Kota Dimulai",
  "slug": "pembangunan-taman-kota-dimulai",
  "ringkasan": "Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini...",
  "isi": "<p>Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini. Taman seluas 5 hektar ini akan menjadi pusat rekreasi baru bagi warga kota.</p>",
  "gambarUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/berita/taman-kota.jpg",
  "isHighlight": true,
  "penulis": "John Doe",
  "tanggal": "2024-10-24T15:08:13.254Z",
  "createdAt": "2024-10-24T15:08:13.254Z",
  "updatedAt": "2024-10-24T15:08:13.254Z",
  "kategori": [
    {
      "id": "c0adcdba-c2c6-4f48-bd56-cbbd3c1f2991",
      "nama": "Pembangunan",
      "slug": "pembangunan",
      "createdAt": "2024-10-24T15:08:13.253Z",
      "updatedAt": "2024-10-24T15:08:13.254Z"
    }
  ]
}
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Create Berita
Endpoint: POST /api/v1/berita
Description: Membuat berita baru
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request Body:
```
judul: string (Judul berita)
ringkasan: string (Ringkasan berita)
isi: string (Konten berita dalam format HTML)
penulis: string (Nama penulis)
tanggal: string (Format ISO 8601)
isHighlight: boolean (Optional)
kategoriIds: string (JSON array of kategori IDs)
gambar: File (Gambar berita - jpg, jpeg, png, atau webp)
```

Response Body (Success - 201 Created):
```json
{
  "id": "2e01052c-afc4-4eb0-ab3a-4e5517b41a92",
  "judul": "Pembangunan Taman Kota Dimulai",
  "slug": "pembangunan-taman-kota-dimulai",
  "ringkasan": "Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini...",
  "isi": "<p>Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini. Taman seluas 5 hektar ini akan menjadi pusat rekreasi baru bagi warga kota.</p>",
  "gambarUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/berita/taman-kota.jpg",
  "isHighlight": true,
  "penulis": "John Doe",
  "tanggal": "2024-10-24T15:08:13.254Z",
  "createdAt": "2024-10-24T15:08:13.254Z",
  "updatedAt": "2024-10-24T15:08:13.254Z",
  "kategori": [
    {
      "id": "c0adcdba-c2c6-4f48-bd56-cbbd3c1f2991",
      "nama": "Pembangunan",
      "slug": "pembangunan",
      "createdAt": "2024-10-24T15:08:13.253Z",
      "updatedAt": "2024-10-24T15:08:13.254Z"
    }
  ]
}
```

### Update Berita
Endpoint: PUT /api/v1/berita/:id
Description: Mengupdate berita yang sudah ada
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request Body (all fields are optional):
```
judul: string
ringkasan: string
isi: string
penulis: string
tanggal: string
isHighlight: boolean
kategoriIds: string (JSON array)
gambar: File
```

Response Body (Success - 200 OK):
```json
{
  "id": "2e01052c-afc4-4eb0-ab3a-4e5517b41a92",
  "judul": "Pembangunan Taman Kota Dimulai",
  "slug": "pembangunan-taman-kota-dimulai",
  "ringkasan": "Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini...",
  "isi": "<p>Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini. Taman seluas 5 hektar ini akan menjadi pusat rekreasi baru bagi warga kota.</p>",
  "gambarUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/berita/taman-kota.jpg",
  "isHighlight": true,
  "penulis": "John Doe",
  "tanggal": "2024-10-24T15:08:13.254Z",
  "createdAt": "2024-10-24T15:08:13.254Z",
  "updatedAt": "2024-10-24T15:08:13.254Z",
  "kategori": [
    {
      "id": "c0adcdba-c2c6-4f48-bd56-cbbd3c1f2991",
      "nama": "Pembangunan",
      "slug": "pembangunan",
      "createdAt": "2024-10-24T15:08:13.253Z",
      "updatedAt": "2024-10-24T15:08:13.254Z"
    }
  ]
}
```

### Delete Berita
Endpoint: DELETE /api/v1/berita/:id
Description: Menghapus berita (hard delete)
Authentication: Required (Admin)

Response: 204 No Content

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "error": "Invalid input",
  "details": [
    {
      "message": "Judul harus diisi"
    },
    {
      "message": "Minimal satu kategori harus dipilih"
    },
    {
      "message": "Gambar berita harus diunggah"
    }
  ]
}
```

### File Type Error (400 Bad Request)
```json
{
  "error": "File harus berupa gambar"
}
```

### Not Found Error (404 Not Found)
```json
{
  "error": "Berita not found"
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

## Cache Control

The API implements Redis caching with the following TTLs:
- List berita: 1 hour
- Detail berita: 1 day
- Highlighted berita: 1 hour

Cache is automatically invalidated when:
- New berita is created
- Existing berita is updated
- Berita is deleted
