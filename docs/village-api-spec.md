# Village Information API Specification

## Get Village Info
Endpoint: GET /api/v1/village/info
Authentication: Not Required

Response Body (Success - 200 OK):
```json
{
  "id": "cf17173a-f499-4ba1-94c4-641dc8d30673",
  "history": "The village of Tandengan was founded in 1809..."
}
```

## Update Village Info
Endpoint: PUT /api/v1/village/info
Authentication: Required (Admin only)

Request Body:
```json
{
  "history": "The village of Tandengan was founded in 1809..."
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "b888d4b6-e885-46ef-a585-13b3ee1622fa",
  "history": "The village of Tandengan was founded in 1809..."
}
```

Response Body (Failed - 403 Forbidden):
```json
{
  "error": "Access denied. Admin privileges required."
}
```

## Get Village Structure
Endpoint: GET /api/v1/village/structure
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "b8fb0220-9e53-42f1-8bbd-11fdbea04356",
    "position": "Village Head",
    "name": "John Doe"
  }
]
```

## Create Village Structure
Endpoint: POST /api/v1/village/structure
Authentication: Required (Admin only)

Request Body:
```json
{
  "position": "Village Secretary",
  "name": "Jane Smith"
}
```

Response Body (Success - 201 Created):
```json
{
  "id": "a35d7340-a0de-4843-b5d2-4d5d16338ffb",
  "position": "Village Secretary",
  "name": "Jane Smith"
}
```

## Update Village Structure
Endpoint: PUT /api/v1/village/structure/:id
Authentication: Required (Admin only)

Request Body:
```json
{
  "name": "Jane Doe"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "f79b5885-9d2c-4a82-8f2a-5c31d6d19654",
  "position": "Village Secretary",
  "name": "Jane Doe"
}
```

## Delete Village Structure
Endpoint: DELETE /api/v1/village/structure/:id
Authentication: Required (Admin only)

Response (Success - 204 No Content): No body

## Get Gallery
Endpoint: GET /api/v1/village/gallery
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "800a8eee-a500-4f93-a6a4-380def0767df",
    "imageUrl": "https://example.com/image1.jpg",
    "description": "Village square"
  }
]
```

## Add Gallery Image
Endpoint: POST /api/v1/village/gallery
Authentication: Required (Admin only)

Request Body: multipart/form-data
- image: File
- description: String (optional)

Response Body (Success - 201 Created):
```json
{
  "id": "2d25c91b-6eae-4d8c-96a9-cf25d449824e",
  "imageUrl": "https://example.com/image2.jpg",
  "description": "Village festival"
}
```

## Delete Gallery Image
Endpoint: DELETE /api/v1/village/gallery/:id
Authentication: Required (Admin only)

Response (Success - 204 No Content): No body

## Get Social Media
Endpoint: GET /api/v1/village/social-media
Authentication: Not Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "4f8d2617-64fe-490b-9c76-1c33de2b5a92",
    "platform": "Facebook",
    "url": "https://facebook.com/villageofficial"
  }
]
```

## Update Social Media
Endpoint: PUT /api/v1/village/social-media/:id
Authentication: Required (Admin only)

Request Body:
```json
{
  "url": "https://facebook.com/villagenewofficialpage"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "44c893f8-9d78-4f8a-8360-62d90fc6ad16",
  "platform": "Facebook",
  "url": "https://facebook.com/villagenewofficialpage"
}
```

