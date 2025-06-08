# API Documentation

## Introduction

This document provides documentation for the public-facing API for our Fitrack application. The API allows external developers to access exercise data in a structured and predictable manner.

## Authentication

All API requests must be authenticated using an API key. The key must be included in the `X-API-Key` header of every request.

**Example Header:**
```
X-API-Key: YOUR_API_KEY
```

## Base URL

The base URL for all API endpoints is:
`http://localhost:3001`

## Endpoint Reference

### Get All Exercises

Retrieves a paginated list of all exercises.

*   **Method:** `GET`
*   **Path:** `/api/v1/exercises`
*   **Headers:**
    *   `X-API-Key`: **Required**. Your unique API key.
*   **Query Parameters:**
    *   `page` (optional, default: `1`): The page number to retrieve.
    *   `limit` (optional, default: `10`): The number of exercises to return per page.

#### Example Success Response (200 OK)

```json
{
    "total": 100,
    "page": 1,
    "limit": 10,
    "data": [
        {
            "exerciseid": 1,
            "name": "Push-up",
            "description": "A classic bodyweight exercise that works the chest, shoulders, and triceps.",
            "sets": 3,
            "reps": 15,
            "duration": null,
            "resttime": 60,
            "difficulty": 2,
            "animationurl": "https://example.com/push-up.gif",
            "calories_burned": 10
        }
    ]
}
```

#### Example Error Responses

##### 401 Unauthorized (Invalid or missing API Key)

```json
{
    "error": "Unauthorized: Invalid or missing API Key"
}
```

### Get Exercise by ID

Retrieves a single exercise by its `exerciseid`.

*   **Method:** `GET`
*   **Path:** `/api/v1/exercises/:id`
*   **Headers:**
    *   `X-API-Key`: **Required**. Your unique API key.

#### Example Success Response (200 OK)

```json
{
    "exerciseid": 1,
    "name": "Push-up",
    "description": "A classic bodyweight exercise that works the chest, shoulders, and triceps.",
    "sets": 3,
    "reps": 15,
    "duration": null,
    "resttime": 60,
    "difficulty": 2,
    "animationurl": "https://example.com/push-up.gif",
    "calories_burned": 10
}
```

#### Example Error Responses

##### 401 Unauthorized (Invalid or missing API Key)

```json
{
    "error": "Unauthorized: Invalid or missing API Key"
}
```

##### 404 Not Found (Exercise not found)

```json
{
    "error": "Exercise not found"
}