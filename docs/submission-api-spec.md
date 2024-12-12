# Submission API Specification

## Public Endpoints

### Submit Document/Surat

Endpoint: POST /api/v1/submissions
Authentication: Not Required

Request Body (multipart/form-data):

```json
{
  "pengirim": "John Doe",
  "whatsapp": "081234567890",
  "kategori": "Surat Keterangan",
  "keterangan": "Pengajuan surat keterangan domisili",
  "file": File (doc/docx, max 5MB)
}
```

Response Body (Success - 201 Created):

```json
{
  "message": "Surat berhasil dikirim",
  "id": "8bb17737-a1bc-4f80-ba48-227c783fe673"
}
```

### Get Submissions by WhatsApp

Endpoint: GET /api/v1/submissions/whatsapp/:whatsapp
Authentication: Not Required

Response Body (Success - 200 OK):

```json
[
  {
    "id": "8bb17737-a1bc-4f80-ba48-227c783fe673",
    "pengirim": "John Doe",
    "whatsapp": "6281234567890",
    "kategori": "surat keterangan",
    "keterangan": "Pengajuan surat keterangan domisili",
    "fileUrl": "https://cloudinary.com/....docx",
    "fileName": "surat-permohonan.docx",
    "status": "DIPROSES",
    "createdAt": "2024-10-22T07:58:02.794Z",
    "updatedAt": "2024-10-22T07:58:02.795Z"
  }
]
```

## Admin Endpoints

All admin endpoints require authentication and admin role.

### Get All Submissions

Endpoint: GET /api/v1/submissions
Authentication: Required (Admin)

Response Body (Success - 200 OK):

```json
[
  {
    "id": "8bb17737-a1bc-4f80-ba48-227c783fe673",
    "pengirim": "John Doe",
    "whatsapp": "6281234567890",
    "kategori": "surat keterangan",
    "keterangan": "Pengajuan surat keterangan domisili",
    "fileUrl": "https://cloudinary.com/....docx",
    "fileName": "surat-permohonan.docx",
    "status": "DIPROSES",
    "createdAt": "2024-10-22T07:58:02.794Z",
    "updatedAt": "2024-10-22T07:58:02.795Z"
  }
]
```

### Get Submission by ID

Endpoint: GET /api/v1/submissions/:id
Authentication: Required (Admin)

Response Body (Success - 200 OK):

```json
{
  "id": "8bb17737-a1bc-4f80-ba48-227c783fe673",
  "pengirim": "John Doe",
  "whatsapp": "6281234567890",
  "kategori": "surat keterangan",
  "keterangan": "Pengajuan surat keterangan domisili",
  "fileUrl": "https://cloudinary.com/....docx",
  "fileName": "surat-permohonan.docx",
  "status": "DIPROSES",
  "createdAt": "2024-10-22T07:58:02.794Z",
  "updatedAt": "2024-10-22T07:58:02.795Z"
}
```

### Update Submission Status

Endpoint: PATCH /api/v1/submissions/:id/status
Authentication: Required (Admin)

Request Body:

```json
{
  "status": "SELESAI" // Nilai yang valid: "DIPROSES" atau "SELESAI"
}
```

Response Body (Success - 200 OK):

```json
{
  "message": "Status berhasil diperbarui",
  "status": "SELESAI"
}
```

### Get Submission Statistics

Endpoint: GET /api/v1/submissions/stats
Authentication: Required (Admin)

Response Body (Success - 200 OK):

```json
[
  {
    "kategori": "surat keterangan",
    "total": 15,
    "statusCount": {
      "DIPROSES": 8,
      "SELESAI": 7
    }
  },
  {
    "kategori": "surat pengantar",
    "total": 8,
    "statusCount": {
      "DIPROSES": 3,
      "SELESAI": 5
    }
  }
]
```

### Delete Submission

Endpoint: DELETE /api/v1/submissions/:id
Authentication: Required (Admin)

Response: 204 No Content

## Error Responses

### Validation Error (400 Bad Request)

```json
{
  "error": "Data tidak valid",
  "details": [
    {
      "message": "Nama pengirim minimal 2 karakter"
    },
    {
      "message": "Nomor WhatsApp harus 10-13 digit"
    }
  ]
}
```

### Status Update Error (400 Bad Request)

```json
{
  "error": "Status tidak valid",
  "details": [
    {
      "message": "Status harus salah satu dari: DIPROSES, SELESAI"
    }
  ]
}
```

### File Error (400 Bad Request)

```json
{
  "error": "Format file tidak valid. Hanya file .doc dan .docx yang diperbolehkan."
}
```

```json
{
  "error": "Ukuran file melebihi batas 5MB."
}
```

### Rate Limit Error (429 Too Many Requests)

```json
{
  "error": "Terlalu banyak pengiriman. Silakan tunggu 1 menit sebelum mengirim lagi."
}
```

### Not Found Error (404 Not Found)

```json
{
  "error": "Data submission tidak ditemukan"
}
```

## Additional Notes

1. Format Nomor WhatsApp:

   - Otomatis dikonversi dari format "08..." ke "628..."
   - Harus berisi 10-13 digit angka
   - Contoh valid: "081234567890" atau "6281234567890"

2. File Upload:

   - Hanya menerima format .doc dan .docx
   - Maksimal ukuran file 5MB
   - Rate limiting: 1 submission per menit per IP

3. Kategori:

   - Otomatis dikonversi ke lowercase
   - Tidak boleh kosong

4. Status Submission:
   - DIPROSES: Status default ketika submission baru dibuat
   - SELESAI: Status ketika submission telah selesai diproses
   - Hanya admin yang dapat mengubah status
   - Notifikasi otomatis akan dikirim ke pengirim ketika status berubah menjadi SELESAI
