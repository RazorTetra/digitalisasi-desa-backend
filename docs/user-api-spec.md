# User API Specification

## Create User
Endpoint: POST /api/v1/users
Authentication: Required

Request Body:
```json
{
  "namaDepan": "John",
  "namaBelakang": "Doe",
  "nomorHp": "081234567890",
  "email": "john.doe@example.com",
  "role": "USER",
  "password": "securepassword"
}
```

Response Body (Success - 201 Created):
```json
{
  "id": "e6314752-c753-47dc-bc82-eae480d1b094",
  "namaDepan": "John",
  "namaBelakang": "Doe",
  "nomorHp": "081234567890",
  "email": "john.doe@example.com",
  "role": "USER"
}
```

Response Body (Failed - 400 Bad Request):
```json
{
  "error": "Invalid input",
  "details": [
    {
      "message": "Invalid email format"
    }
  ]
}
```

## Get All Users
Endpoint: GET /api/v1/users
Authentication: Required

Response Body (Success - 200 OK):
```json
[
  {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094",
    "namaDepan": "John",
    "namaBelakang": "Doe",
    "nomorHp": "081234567890",
    "email": "john.doe@example.com",
    "role": "USER"
  }
]
```

## Get User by ID
Endpoint: GET /api/v1/users/:id
Authentication: Required

Response Body (Success - 200 OK):
```json
{
  "id": "e6314752-c753-47dc-bc82-eae480d1b094",
  "namaDepan": "John",
  "namaBelakang": "Doe",
  "nomorHp": "081234567890",
  "email": "john.doe@example.com",
  "role": "USER"
}
```

Response Body (Failed - 404 Not Found):
```json
{
  "error": "User not found"
}
```

## Update User
Endpoint: PUT /api/v1/users/:id
Authentication: Required

Request Body:
```json
{
  "namaDepan": "Jane",
  "nomorHp": "087654321098"
}
```

Response Body (Success - 200 OK):
```json
{
  "id": "e6314752-c753-47dc-bc82-eae480d1b094",
  "namaDepan": "Jane",
  "namaBelakang": "Doe",
  "nomorHp": "087654321098",
  "email": "john.doe@example.com",
  "role": "USER"
}
```

Response Body (Failed - 404 Not Found):
```json
{
  "error": "User not found"
}
```

## Delete User
Endpoint: DELETE /api/v1/users/:id
Authentication: Required

Response (Success - 204 No Content): No body

Response Body (Failed - 404 Not Found):
```json
{
  "error": "User not found"
}
```

## Login User
Endpoint: POST /api/v1/auth/login
Authentication: Not Required

Request Body:
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

Response Body (Success - 200 OK):
```json
{
  "status": "success",
  "data": {
    "message": "Login successful"
  }
}
```

Response Body (Failed - 401 Unauthorized):
```json
{
  "error": "Invalid email or password"
}
```

Note: On successful login, an HTTP-only cookie named "accessToken" will be set with a 1-day expiration.

## Logout User
Endpoint: POST /api/v1/auth/logout
Authentication: Required

Request Body: None

Response Body (Success - 200 OK):
```json
{
  "status": "success",
  "data": {
    "message": "Logout successful"
  }
}
```

Note: On successful logout, the "accessToken" cookie will be cleared.

