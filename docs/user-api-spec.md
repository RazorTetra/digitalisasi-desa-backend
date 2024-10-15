# User API Specification

## Create User
Endpoint: POST /api/v1/users
Authentication: Required

Request Body:
```json
{
  "namaDepan": "John",
  "namaBelakang": "Doe",
  "kelas": "12A",
  "nomorHp": "081234567890",
  "email": "john.doe@example.com",
  "role": "SISWA",
  "password": "securepassword"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "data": {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094"
  }
}
```

Response Body (Failed):
```json
{
  "errors": [
    {
      "message": "Internal Server Error"
    }
  ]
}
```

## Get All Users
Endpoint: GET /api/v1/users
Authentication: Required

Response Body (Success):
```json
{
  "status": "success",
  "data": [
    {
      "id": "e6314752-c753-47dc-bc82-eae480d1b094",
      "namaDepan": "John",
      "namaBelakang": "Doe",
      "kelas": "12A",
      "nomorHp": "081234567890",
      "email": "john.doe@example.com",
      "role": "SISWA"
    }
  ]
}
```

Response Body (Failed):
```json
{
  "errors": [
    {
      "message": "Internal Server Error"
    }
  ]
}
```

## Logout User
Endpoint: POST /api/v1/auth/logout
Authentication: Required

Request Body: None

Response Body (Success):
```json
{
  "status": "success",
  "data": {
    "message": "Logout successful"
  }
}
```

Response Body (Failed):
```json
{
  "errors": [
    {
      "message": "Failed to logout"
    }
  ]
}
```

