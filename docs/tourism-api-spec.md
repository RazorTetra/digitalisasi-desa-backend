# Tourism API Specification

## Public Endpoints

### Get All Tourism Destinations
Endpoint: GET /api/v1/tourism
Description: Mendapatkan semua destinasi wisata
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "720834d7-8d25-4310-b176-a99ceaf09c4d",
    "name": "Tanjung Peimpang",
    "description": "Pantai berpasir putih dengan air jernih dan pemandangan matahari terbenam yang memukau",
    "image": "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/main-image.jpg",
    "location": "Desa Tandengan Selatan",
    "gallery": [
      "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-1.jpg",
      "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-2.jpg"
    ],
    "createdAt": "2024-10-25T09:40:26.582Z",
    "updatedAt": "2024-10-25T09:40:26.582Z"
  }
]
```

### Get Tourism Destination by ID
Endpoint: GET /api/v1/tourism/:id
Description: Mendapatkan detail destinasi wisata berdasarkan ID
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "720834d7-8d25-4310-b176-a99ceaf09c4d",
  "name": "Tanjung Peimpang",
  "description": "Pantai berpasir putih dengan air jernih dan pemandangan matahari terbenam yang memukau",
  "image": "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/main-image.jpg",
  "location": "Desa Tandengan Selatan",
  "gallery": [
    "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-1.jpg",
    "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-2.jpg"
  ],
  "createdAt": "2024-10-25T09:40:26.582Z",
  "updatedAt": "2024-10-25T09:40:26.582Z"
}
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Create Tourism Destination
Endpoint: POST /api/v1/tourism
Description: Membuat destinasi wisata baru
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request Body:
```
name: string (max 100 characters)
description: string (max 255 characters)
location: string (max 255 characters)
mainImage: File (Image file - .jpg, .png, atau .webp)
gallery: File[] (Multiple image files - max 10 files)
```

Response Body (Success - 201 Created):
```json
{
  "id": "720834d7-8d25-4310-b176-a99ceaf09c4d",
  "name": "Tanjung Peimpang",
  "description": "Pantai berpasir putih dengan air jernih dan pemandangan matahari terbenam yang memukau",
  "image": "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/main-image.jpg",
  "location": "Desa Tandengan Selatan",
  "gallery": [
    "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-1.jpg",
    "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-2.jpg"
  ],
  "createdAt": "2024-10-25T09:40:26.582Z",
  "updatedAt": "2024-10-25T09:40:26.582Z"
}
```

### Update Tourism Destination
Endpoint: PUT /api/v1/tourism/:id
Description: Mengupdate destinasi wisata
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request Body:
```
name?: string (max 100 characters)
description?: string (max 255 characters)
location?: string (max 255 characters)
mainImage?: File (Image file - .jpg, .png, atau .webp)
gallery?: File[] (Multiple image files - max 10 files)
```

Response Body (Success - 200 OK):
```json
{
  "id": "720834d7-8d25-4310-b176-a99ceaf09c4d",
  "name": "Tanjung Peimpang",
  "description": "Pantai berpasir putih dengan air jernih dan pemandangan matahari terbenam yang memukau",
  "image": "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/main-image.jpg",
  "location": "Desa Tandengan Selatan",
  "gallery": [
    "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-1.jpg",
    "https://res.cloudinary.com/example/image/upload/v1234567890/tourism/gallery-2.jpg"
  ],
  "createdAt": "2024-10-25T09:40:26.582Z",
  "updatedAt": "2024-10-25T09:40:26.582Z"
}
```

### Delete Tourism Destination
Endpoint: DELETE /api/v1/tourism/:id
Description: Menghapus destinasi wisata
Authentication: Required (Admin)

Response: 204 No Content

## Error Responses

### Invalid Input (400 Bad Request)
```json
{
  "error": "Invalid input",
  "details": [
    {
      "code": "too_big",
      "maximum": 100,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at most 100 character(s)",
      "path": [
        "name"
      ]
    }
  ]
}
```

### File Type Error (400 Bad Request)
```json
{
  "error": "Only .jpeg, .png and .webp format allowed!"
}
```

### Missing Required Files (400 Bad Request)
```json
{
  "error": "Main image and gallery images are required"
}
```

### Not Found Error (404 Not Found)
```json
{
  "error": "Tourism destination not found"
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

