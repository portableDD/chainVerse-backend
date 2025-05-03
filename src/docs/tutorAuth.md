# Tutor Authentication API Documentation

## Overview
This document provides detailed information about the tutor authentication endpoints in the Chainverse Academy platform. These endpoints handle tutor registration, login, profile management, and other authentication-related operations.

## Base URL
```
/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Register a New Tutor
```http
POST /tutor/create
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "web3Expertise": "Blockchain Development",
  "experience": 5
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Tutor registered successfully. Please verify your email.",
  "data": {
    "tutorId": "60d21b4667d0d8992e610c85"
  }
}
```

### Verify Email
```http
POST /tutor/verify-email
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

### Login
```http
POST /tutor/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tutor": {
      "_id": "60d21b4667d0d8992e610c85",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "web3Expertise": "Blockchain Development",
      "experience": 5,
      "role": "tutor"
    }
  }
}
```

### Refresh Token
```http
POST /tutor/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Forgot Password
```http
POST /tutor/forget/password
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password reset instructions sent to your email"
}
```

### Reset Password
```http
POST /tutor/reset/password
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "resetToken": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password reset successful"
}
```

### Get Tutor Profile
```http
GET /tutor/profile
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "tutor": {
      "_id": "60d21b4667d0d8992e610c85",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "web3Expertise": "Blockchain Development",
      "experience": 5,
      "courses": ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c87"],
      "role": "tutor"
    }
  }
}
```

### Update Tutor Profile
```http
PUT /tutor/profile
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "web3Expertise": "Smart Contract Development",
  "experience": 6
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "tutor": {
      "_id": "60d21b4667d0d8992e610c85",
      "fullName": "John Smith",
      "email": "john.doe@example.com",
      "web3Expertise": "Smart Contract Development",
      "experience": 6,
      "role": "tutor"
    }
  }
}
```

## Error Responses

### Validation Error
```json
{
  "status": "fail",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
  ]
}
```

### Authentication Error
```json
{
  "status": "fail",
  "error": "Authentication required"
}
```

### Authorization Error
```json
{
  "status": "fail",
  "error": "You do not have permission to access this resource"
}
```

### Resource Not Found
```json
{
  "status": "fail",
  "error": "Tutor not found"
}
```

### Server Error
```json
{
  "status": "error",
  "error": "Internal server error"
}
```