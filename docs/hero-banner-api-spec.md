# Hero Banner API Specification

## Public Endpoints

### Get Hero Banner
Endpoint: GET /api/v1/hero-banner
Description: Mendapatkan data hero banner
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "ae7cac43-25ff-465e-ab73-1497b4f5127f",
  "imageUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/hero_banner/sample.jpg",
  "createdAt": "2024-10-25T04:54:20.448Z",
  "updatedAt": "2024-10-25T04:54:20.449Z"
}
```

## Admin Endpoints
All admin endpoints require authentication and admin role.

### Update Hero Banner
Endpoint: PUT /api/v1/hero-banner
Description: Update hero banner image
Authentication: Required (Admin)
Content-Type: multipart/form-data

Request Body:
```
image: File (Image file - .jpg, .png, atau .webp)
```

Response Body (Success - 200 OK):
```json
{
  "id": "ae7cac43-25ff-465e-ab73-1497b4f5127f",
  "imageUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/hero_banner/sample.jpg",
  "createdAt": "2024-10-25T04:54:20.448Z",
  "updatedAt": "2024-10-25T04:54:20.449Z"
}
```

## Error Responses

### File Type Error (400 Bad Request)
```json
{
  "error": "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
}
```

### File Size Error (400 Bad Request)
```json
{
  "error": "File too large. Maximum size is 5MB"
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

