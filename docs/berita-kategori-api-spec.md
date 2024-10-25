# Berita Kategori Management API Specification

## Public Endpoints

### Get All Kategori
Endpoint: GET /api/v1/berita-kategori
Description: Mendapatkan daftar semua kategori berita
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "da314f66-71eb-4afc-83e4-fc2c0d127be4",
    "nama": "Pembangunan",
    "slug": "pembangunan",
    "createdAt": "2024-10-25T03:33:48.844Z",
    "updatedAt": "2024-10-25T03:33:48.844Z"
  }
]
```

### Get Kategori by ID
Endpoint: GET /api/v1/berita-kategori/id/:id
Description: Mendapatkan detail kategori berdasarkan ID
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "da314f66-71eb-4afc-83e4-fc2c0d127be4",
  "nama": "Pembangunan",
  "slug": "pembangunan",
  "createdAt": "2024-10-25T03:33:48.844Z",
  "updatedAt": "2024-10-25T03:33:48.844Z"
}
```

### Get Kategori by Slug
Endpoint: GET /api/v1/berita-kategori/:slug
Description: Mendapatkan detail kategori berdasarkan slug
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "da314f66-71eb-4afc-83e4-fc2c0d127be4",
  "nama": "Pembangunan",
  "slug": "pembangunan",
  "createdAt": "2024-10-25T03:33:48.844Z",
  "updatedAt": "2024-10-25T03:33:48.844Z"
}
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Create Kategori
Endpoint: POST /api/v1/berita-kategori
Description: Membuat kategori berita baru
Authentication: Required (Admin)
Content-Type: application/json

Request Body:
```json
{
  "nama": "Nama Kategori"
}
```

Response Body (Success - 201 Created):
```json
{
  "id": "da314f66-71eb-4afc-83e4-fc2c0d127be4",
  "nama": "Pembangunan",
  "slug": "pembangunan",
  "createdAt": "2024-10-25T03:33:48.844Z",
  "updatedAt": "2024-10-25T03:33:48.844Z"
}
```

### Update Kategori
Endpoint: PUT /api/v1/berita-kategori/:id
Description: Mengupdate kategori berita yang sudah ada
Authentication: Required (Admin)
Content-Type: application/json

Request Body:
```json
{
  "nama": "Nama Kategori Baru"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "da314f66-71eb-4afc-83e4-fc2c0d127be4",
  "nama": "Pembangunan",
  "slug": "pembangunan",
  "createdAt": "2024-10-25T03:33:48.844Z",
  "updatedAt": "2024-10-25T03:33:48.844Z"
}
```

### Delete Kategori
Endpoint: DELETE /api/v1/berita-kategori/:id
Description: Menghapus kategori berita (hard delete)
Authentication: Required (Admin)

Response: 204 No Content

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "error": "Data tidak valid",
  "details": [
    {
      "message": "Nama kategori harus diisi"
    }
  ]
}
```

### Not Found Error (404 Not Found)
```json
{
  "error": "Kategori not found"
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

### Duplicate Entry Error (409 Conflict)
```json
{
  "error": "Kategori dengan nama tersebut sudah ada"
}
```

## Cache Control

The API implements Redis caching with the following TTLs:
- List kategori: 1 day

Cache is automatically invalidated when:
- New kategori is created
- Existing kategori is updated
- Kategori is deleted

## Important Notes

1. Slug akan digenerate secara otomatis dari nama kategori
2. Nama kategori bersifat unique
3. Penghapusan kategori perlu mempertimbangkan relasi dengan berita yang menggunakan kategori tersebut
