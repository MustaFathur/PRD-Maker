# PRD Maker with LLM API Documentation

## Table of Contents
- [Introduction](#introduction)
- [Authentication](#authentication)
    - [Register User](#register-user)
    - [Login User](#login-user)
    - [Refresh Token](#refresh-token)
    - [Logout User](#logout-user)
- [PRD Management](#prd-management)
    - [Get All PRDs](#get-all-prds)
    - [Get PRD by ID](#get-prd-by-id)
    - [Create PRD](#create-prd)
    - [Update PRD](#update-prd)
    - [Delete PRD](#delete-prd)
    - [Archive PRD](#archive-prd)
    - [Download PRD](#download-prd)
- [Personil Management](#personil-management)
    - [Get All Personil](#get-all-personil)
    - [Get Personil by ID](#get-personil-by-id)
    - [Create Personil](#create-personil)
    - [Update Personil](#update-personil)
    - [Delete Personil](#delete-personil)

## Introduction
Welcome to the PRD Maker with LLM API documentation. This API allows you to manage Product Requirement Documents (PRDs) and associated personnel.

## Authentication

### Register User
**Endpoint:** `POST /api/auth/register`

**Description:** Registers a new user.

**Request Body:**
```json
{
    "email": "user@example.com",
    "name": "User Name",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "User registered successfully",
    "user": { ... }
}
```

### Login User
**Endpoint:** `POST /api/auth/login`

**Description:** Logs in a user.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "message": "Login successful",
    "user": { ... }
}
```

### Refresh Token
**Endpoint:** `POST /api/auth/refresh-token`

**Description:** Refreshes the access token.

**Response:**
```json
{
    "message": "Token refreshed"
}
```

### Logout User
**Endpoint:** `POST /api/auth/logout`

**Description:** Logs out a user.

**Response:**
```json
{
    "message": "User logged out successfully"
}
```

## PRD Management

### Get All PRDs
**Endpoint:** `GET /api/prd`

**Description:** Retrieves all PRDs.

**Response:**
```json
[
    { ... },
    { ... }
]
```

### Get PRD by ID
**Endpoint:** `GET /api/prd/:id`

**Description:** Retrieves a PRD by its ID.

**Response:**
```json
{ ... }
```

### Create PRD
**Endpoint:** `POST /api/prd`

**Description:** Creates a new PRD.

**Request Body:**
```json
{
    "title": "New PRD",
    "description": "Description of the PRD",
    ...
}
```

**Response:**
```json
{
    "message": "PRD created successfully",
    "prd": { ... }
}
```

### Update PRD
**Endpoint:** `PUT /api/prd/:id`

**Description:** Updates an existing PRD.

**Request Body:**
```json
{
    "title": "Updated PRD",
    "description": "Updated description of the PRD",
    ...
}
```

**Response:**
```json
{
    "message": "PRD updated successfully",
    "prd": { ... }
}
```

### Delete PRD
**Endpoint:** `DELETE /api/prd/:id`

**Description:** Deletes a PRD.

**Response:**
```json
{
    "message": "PRD deleted successfully"
}
```

### Archive PRD
**Endpoint:** `PUT /api/prd/archive/:id`

**Description:** Archives a PRD.

**Response:**
```json
{
    "message": "PRD archived successfully"
}
```

### Download PRD
**Endpoint:** `GET /api/prd/download/:id`

**Description:** Downloads a PRD as a PDF.

**Response:** PDF file

## Personil Management

### Get All Personil
**Endpoint:** `GET /api/personil`

**Description:** Retrieves all personnel.

**Response:**
```json
[
    { ... },
    { ... }
]
```

### Get Personil by ID
**Endpoint:** `GET /api/personil/:id`

**Description:** Retrieves a personil by their ID.

**Response:**
```json
{ ... }
```

### Create Personil
**Endpoint:** `POST /api/personil`

**Description:** Creates a new personil.

**Request Body:**
```json
{
    "personil_name": "John Doe",
    "role": "Developer"
}
```

**Response:**
```json
{
    "message": "Personil created successfully",
    "personil": { ... }
}
```

### Update Personil
**Endpoint:** `PUT /api/personil/:id`

**Description:** Updates an existing personil.

**Request Body:**
```json
{
    "personil_name": "Jane Doe",
    "role": "Manager"
}
```

**Response:**
```json
{
    "message": "Personil updated successfully",
    "personil": { ... }
}
```

### Delete Personil
**Endpoint:** `DELETE /api/personil/:id`

**Description:** Deletes a personil.

**Response:**
```json
{
    "message": "Personil deleted successfully"
}
```