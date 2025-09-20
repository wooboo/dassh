# API Contracts: User Authentication System

**Feature**: User Authentication System  
**Date**: September 20, 2025  
**API Standard**: REST with OpenAPI 3.0 specification

## Overview
API contracts for user authentication system. Primary authentication is handled by Kinde, with additional endpoints for user profile management and session handling.

## Authentication Endpoints (Kinde Integration)

**Note**: Core authentication endpoints are provided by Kinde. These are the integration points our application uses.

### POST /api/auth/login
**Purpose**: Redirect to Kinde login page  
**Handler**: Kinde SDK redirect  

**Request**: No body required
**Response**: 302 Redirect to Kinde login

### POST /api/auth/register
**Purpose**: Redirect to Kinde registration page  
**Handler**: Kinde SDK redirect  

**Request**: No body required
**Response**: 302 Redirect to Kinde registration

### GET /api/auth/callback
**Purpose**: Handle Kinde authentication callback  
**Handler**: Kinde SDK callback processing  

**Query Parameters**:
- `code` (string): Authorization code from Kinde
- `state` (string): CSRF protection state

**Response**: 302 Redirect to dashboard or intended destination

### POST /api/auth/logout
**Purpose**: Sign out user and clear session  
**Handler**: Kinde SDK logout  

**Request**: No body required
**Response**: 302 Redirect to main page

## User Profile Endpoints

### GET /api/user/profile
**Purpose**: Get current user profile information  
**Authentication**: Required (Kinde token)

**Request**: No parameters
**Response**:
```json
{
  "user": {
    "id": "uuid",
    "kindeId": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "profilePicture": "string",
    "lastLoginAt": "timestamp",
    "isActive": "boolean"
  },
  "profile": {
    "displayName": "string",
    "timezone": "string",
    "language": "string",
    "theme": "light|dark|auto",
    "dashboardLayout": "object",
    "notificationSettings": "object"
  }
}
```

**Error Responses**:
- 401: Unauthorized (invalid or missing token)
- 404: User profile not found

### PUT /api/user/profile
**Purpose**: Update user profile settings  
**Authentication**: Required (Kinde token)

**Request Body**:
```json
{
  "displayName": "string (optional)",
  "timezone": "string (optional)",
  "language": "string (optional)",
  "theme": "light|dark|auto (optional)",
  "dashboardLayout": "object (optional)",
  "notificationSettings": "object (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "profile": {
    "displayName": "string",
    "timezone": "string",
    "language": "string",
    "theme": "string",
    "dashboardLayout": "object",
    "notificationSettings": "object",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses**:
- 400: Invalid request data
- 401: Unauthorized
- 422: Validation errors

### GET /api/user/preferences
**Purpose**: Get user dashboard preferences  
**Authentication**: Required (Kinde token)

**Request**: No parameters
**Response**:
```json
{
  "preferences": "object",
  "theme": "string",
  "dashboardLayout": "object"
}
```

**Error Responses**:
- 401: Unauthorized
- 404: User not found

### PUT /api/user/preferences
**Purpose**: Update user dashboard preferences  
**Authentication**: Required (Kinde token)

**Request Body**:
```json
{
  "preferences": "object (optional)",
  "theme": "light|dark|auto (optional)",
  "dashboardLayout": "object (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "preferences": "object",
  "updatedAt": "timestamp"
}
```

**Error Responses**:
- 400: Invalid request data
- 401: Unauthorized
- 422: Validation errors

## Session Management Endpoints

### GET /api/user/sessions
**Purpose**: Get list of active user sessions  
**Authentication**: Required (Kinde token)

**Request**: No parameters
**Response**:
```json
{
  "sessions": [
    {
      "id": "uuid",
      "userAgent": "string",
      "ipAddress": "string",
      "createdAt": "timestamp",
      "lastActivityAt": "timestamp",
      "expiresAt": "timestamp",
      "isCurrent": "boolean"
    }
  ]
}
```

**Error Responses**:
- 401: Unauthorized

### DELETE /api/user/sessions/:sessionId
**Purpose**: Revoke a specific user session  
**Authentication**: Required (Kinde token)

**Path Parameters**:
- `sessionId` (uuid): Session ID to revoke

**Response**:
```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Cannot revoke current session
- 404: Session not found

### DELETE /api/user/sessions/all
**Purpose**: Revoke all user sessions except current  
**Authentication**: Required (Kinde token)

**Request**: No parameters
**Response**:
```json
{
  "success": true,
  "revokedCount": "number",
  "message": "All other sessions revoked"
}
```

**Error Responses**:
- 401: Unauthorized

## Utility Endpoints

### GET /api/auth/status
**Purpose**: Check current authentication status  
**Authentication**: Optional

**Request**: No parameters
**Response**:
```json
{
  "isAuthenticated": "boolean",
  "user": {
    "id": "uuid",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "profilePicture": "string"
  } // Only if authenticated
}
```

**Error Responses**: None (always returns 200)

### POST /api/auth/refresh
**Purpose**: Refresh authentication token  
**Authentication**: Required (valid refresh token)

**Request**: No body required
**Response**:
```json
{
  "success": true,
  "expiresAt": "timestamp"
}
```

**Error Responses**:
- 401: Invalid refresh token
- 403: Refresh token expired

## Middleware Contracts

### Authentication Middleware
**Purpose**: Validate Kinde tokens and populate user context  
**Implementation**: Next.js middleware

**Request Processing**:
1. Extract token from request headers/cookies
2. Validate token with Kinde
3. Load user data from database
4. Populate request context with user information

**Route Protection**:
- `/dashboard/*`: Requires authentication
- `/api/user/*`: Requires authentication
- `/api/auth/callback`: Public (handle auth flow)
- `/api/auth/status`: Public (check auth state)

### Session Management Middleware
**Purpose**: Track user sessions and activity  
**Implementation**: Database middleware

**Session Tracking**:
1. Create session on successful authentication
2. Update lastActivityAt on authenticated requests
3. Clean up expired sessions periodically
4. Invalidate sessions on logout

## Error Handling Standards

### Standard Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### Error Codes
- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid authentication token
- `AUTH_EXPIRED`: Authentication token expired
- `USER_NOT_FOUND`: User profile not found
- `VALIDATION_ERROR`: Request validation failed
- `SESSION_NOT_FOUND`: Session not found
- `SESSION_EXPIRED`: Session expired
- `PERMISSION_DENIED`: Insufficient permissions

## Rate Limiting

### Authentication Endpoints
- `/api/auth/*`: 10 requests per minute per IP
- `/api/user/profile`: 60 requests per minute per user
- `/api/user/preferences`: 30 requests per minute per user
- `/api/user/sessions`: 20 requests per minute per user

### WebSocket Authentication
- Connection attempts: 5 per minute per IP
- Token validation: Cached for 5 minutes
- Real-time updates: No rate limiting for authenticated users

This contract specification provides comprehensive API definitions for the user authentication system while integrating seamlessly with Kinde authentication service and supporting the constitutional requirements for security and performance.