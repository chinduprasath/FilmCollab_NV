# FilmCollab API Documentation

This document provides comprehensive documentation for the FilmCollab API endpoints.

## 🔐 Authentication

The FilmCollab API uses NextAuth.js for authentication. Most endpoints require authentication unless specified otherwise.

### Authentication Methods

1. **Session-based Authentication**
   - Uses HTTP-only cookies
   - Automatically handled by NextAuth.js
   - Session includes user information

2. **API Key Authentication** (for admin endpoints)
   - Include `Authorization: Bearer <api-key>` header
   - Used for admin-only operations

### Getting a Session

```typescript
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
```

## 📋 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 👥 Users API

### Get Current User
```http
GET /api/users/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ACTOR",
    "image": "https://example.com/avatar.jpg",
    "bio": "Professional actor with 5 years experience",
    "location": "Los Angeles, CA",
    "skills": ["Drama", "Comedy", "Action"],
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile
```http
PUT /api/users/me
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Updated bio",
  "location": "New York, NY",
  "skills": ["Drama", "Comedy"],
  "languages": ["English", "Spanish"],
  "availability": "Full-time",
  "rate": "$500/day"
}
```

### Get User by ID
```http
GET /api/users/[id]
```

### Search Users
```http
GET /api/users/search?q=john&role=ACTOR&location=LA&page=1&limit=10
```

**Query Parameters:**
- `q` - Search query
- `role` - Filter by role
- `location` - Filter by location
- `skills` - Filter by skills (comma-separated)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## 💼 Jobs API

### Get All Jobs
```http
GET /api/jobs?page=1&limit=10&category=ACTING&type=FULL_TIME&location=LA&isPaid=true
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `category` - Job category
- `type` - Job type
- `location` - Location filter
- `isPaid` - Paid/Unpaid filter
- `search` - Search query

### Get Job by ID
```http
GET /api/jobs/[id]
```

### Create Job
```http
POST /api/jobs
Content-Type: application/json

{
  "title": "Lead Actor Needed",
  "description": "Seeking experienced actor for lead role in independent film",
  "company": "Independent Productions",
  "location": "Los Angeles, CA",
  "type": "CONTRACT",
  "category": "ACTING",
  "isPaid": true,
  "rate": "$1000/day",
  "duration": "3 months",
  "startDate": "2024-03-01",
  "endDate": "2024-06-01",
  "requirements": ["5+ years experience", "Drama background"],
  "benefits": ["Health insurance", "Travel allowance"]
}
```

### Update Job
```http
PUT /api/jobs/[id]
Content-Type: application/json

{
  "title": "Updated Job Title",
  "description": "Updated description"
}
```

### Delete Job
```http
DELETE /api/jobs/[id]
```

### Apply for Job
```http
POST /api/jobs/[id]/apply
Content-Type: application/json

{
  "coverLetter": "I am interested in this position...",
  "resume": "https://example.com/resume.pdf",
  "portfolio": "https://example.com/portfolio"
}
```

### Get Job Applications
```http
GET /api/jobs/[id]/applications
```

### Update Application Status
```http
PUT /api/jobs/[id]/applications/[applicationId]
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

## 📅 Events API

### Get All Events
```http
GET /api/events?page=1&limit=10&type=WORKSHOP&category=ACTING&location=LA&isOnline=false
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `type` - Event type
- `category` - Event category
- `location` - Location filter
- `isOnline` - Online/Offline filter
- `search` - Search query

### Get Event by ID
```http
GET /api/events/[id]
```

### Create Event
```http
POST /api/events
Content-Type: application/json

{
  "title": "Acting Workshop",
  "description": "Learn advanced acting techniques",
  "type": "WORKSHOP",
  "category": "ACTING",
  "startDate": "2024-03-15T10:00:00Z",
  "endDate": "2024-03-15T18:00:00Z",
  "location": "Los Angeles, CA",
  "venue": "Acting Studio",
  "address": "123 Main St",
  "city": "Los Angeles",
  "state": "CA",
  "country": "USA",
  "zipCode": "90210",
  "isOnline": false,
  "price": 150.00,
  "capacity": 20,
  "tags": ["acting", "workshop", "drama"]
}
```

### Update Event
```http
PUT /api/events/[id]
Content-Type: application/json

{
  "title": "Updated Event Title",
  "description": "Updated description"
}
```

### Delete Event
```http
DELETE /api/events/[id]
```

### Register for Event
```http
POST /api/events/[id]/register
Content-Type: application/json

{
  "notes": "Special dietary requirements"
}
```

### Get Event Registrations
```http
GET /api/events/[id]/registrations
```

## 🎬 Projects API

### Get All Projects
```http
GET /api/projects?page=1&limit=10&type=FEATURE_FILM&status=IN_DEVELOPMENT&isPublic=true
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `type` - Project type
- `status` - Project status
- `isPublic` - Public/Private filter
- `search` - Search query

### Get Project by ID
```http
GET /api/projects/[id]
```

### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "title": "The Great Adventure",
  "description": "An epic adventure film about discovery",
  "type": "FEATURE_FILM",
  "genre": "Adventure",
  "budget": "$5,000,000",
  "timeline": "12 months",
  "location": "Various locations",
  "isPublic": true,
  "tags": ["adventure", "drama", "epic"]
}
```

### Update Project
```http
PUT /api/projects/[id]
Content-Type: application/json

{
  "title": "Updated Project Title",
  "description": "Updated description"
}
```

### Delete Project
```http
DELETE /api/projects/[id]
```

### Add Project Member
```http
POST /api/projects/[id]/members
Content-Type: application/json

{
  "userId": "user_id",
  "role": "Director",
  "isAdmin": false
}
```

### Remove Project Member
```http
DELETE /api/projects/[id]/members/[memberId]
```

## 💬 Messages API

### Get Conversations
```http
GET /api/messages/conversations
```

### Get Messages
```http
GET /api/messages/[userId]?page=1&limit=50
```

### Send Message
```http
POST /api/messages
Content-Type: application/json

{
  "recipientId": "user_id",
  "content": "Hello! I'm interested in your project.",
  "images": ["https://example.com/image1.jpg"],
  "files": ["https://example.com/document.pdf"]
}
```

### Mark Messages as Read
```http
PUT /api/messages/[userId]/read
```

## 📝 Posts API

### Get Posts
```http
GET /api/posts?page=1&limit=10&isPublic=true
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `isPublic` - Public/Private filter
- `search` - Search query
- `hashtags` - Filter by hashtags

### Get Post by ID
```http
GET /api/posts/[id]
```

### Create Post
```http
POST /api/posts
Content-Type: application/json

{
  "content": "Just wrapped up an amazing shoot! 🎬",
  "images": ["https://example.com/image1.jpg"],
  "videos": ["https://example.com/video1.mp4"],
  "hashtags": ["filmmaking", "behindthescenes"],
  "isPublic": true
}
```

### Update Post
```http
PUT /api/posts/[id]
Content-Type: application/json

{
  "content": "Updated post content"
}
```

### Delete Post
```http
DELETE /api/posts/[id]
```

### Like Post
```http
POST /api/posts/[id]/like
```

### Unlike Post
```http
DELETE /api/posts/[id]/like
```

### Comment on Post
```http
POST /api/posts/[id]/comments
Content-Type: application/json

{
  "content": "Great work! 👏"
}
```

## 🔗 Connections API

### Get Connections
```http
GET /api/connections?status=ACCEPTED
```

**Query Parameters:**
- `status` - Connection status (PENDING, ACCEPTED, REJECTED)

### Send Connection Request
```http
POST /api/connections
Content-Type: application/json

{
  "recipientId": "user_id",
  "message": "I'd like to connect with you!"
}
```

### Accept Connection Request
```http
PUT /api/connections/[id]
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

### Reject Connection Request
```http
PUT /api/connections/[id]
Content-Type: application/json

{
  "status": "REJECTED"
}
```

### Remove Connection
```http
DELETE /api/connections/[id]
```

## 🔔 Notifications API

### Get Notifications
```http
GET /api/notifications?page=1&limit=20&isRead=false
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `isRead` - Read/Unread filter

### Mark Notification as Read
```http
PUT /api/notifications/[id]/read
```

### Mark All Notifications as Read
```http
PUT /api/notifications/read-all
```

## 📁 File Upload API

### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "file": "file_data",
  "type": "image" // image, video, document
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file_id",
    "name": "filename.jpg",
    "url": "https://example.com/uploads/filename.jpg",
    "size": 1024000,
    "type": "image/jpeg",
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🔍 Search API

### Global Search
```http
GET /api/search?q=search_term&type=all&page=1&limit=10
```

**Query Parameters:**
- `q` - Search query
- `type` - Search type (all, users, jobs, events, projects, posts)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "user",
      "id": "user_id",
      "title": "John Doe",
      "description": "Professional actor",
      "image": "https://example.com/avatar.jpg",
      "url": "/profile/user_id",
      "metadata": {
        "role": "ACTOR",
        "location": "Los Angeles"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📊 Analytics API (Admin Only)

### Get User Statistics
```http
GET /api/admin/analytics/users
```

### Get Job Statistics
```http
GET /api/admin/analytics/jobs
```

### Get Event Statistics
```http
GET /api/admin/analytics/events
```

### Get Platform Statistics
```http
GET /api/admin/analytics/platform
```

## 🛡️ Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | User not authenticated |
| `FORBIDDEN` | User not authorized |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## 📝 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **File upload endpoints**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔒 Security

### CORS
The API supports CORS for cross-origin requests. Allowed origins are configured in the environment.

### Input Validation
All inputs are validated using Zod schemas to prevent injection attacks.

### Data Sanitization
User inputs are sanitized before storage to prevent XSS attacks.

## 📞 Support

For API support and questions:

- Create an issue in the repository
- Contact the development team
- Check the API status page

---

**API Version**: v1.0  
**Last Updated**: January 2024
