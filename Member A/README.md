# Member A - Sub-System A: Catalog & Member Profiles

## Overview
This system handles the management of members and items (catalog) for the Lendify lending platform.

## Technology Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React.js
- **Testing**: Jest + Supertest

## Project Structure
```
Member A/
├── backend/
│   ├── models/
│   │   ├── Member.js       # Member schema/model
│   │   └── Item.js         # Item schema/model
│   ├── routes/
│   │   ├── members.js      # Member API routes
│   │   └── items.js        # Item API routes
│   ├── tests/
│   │   ├── members.test.js # Member API tests
│   │   └── items.test.js   # Item API tests
│   ├── server.js           # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MemberForm.js
│   │   │   ├── MemberList.js
│   │   │   ├── ItemForm.js
│   │   │   └── ItemList.js
│   │   ├── services/
│   │   │   └── api.js      # API service layer
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd "Member A/backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lendify
   NODE_ENV=development
   ```

4. Start MongoDB (if running locally):
   ```bash
   # MongoDB should be running on localhost:27017
   # Or update MONGODB_URI in .env file
   ```

5. Start the backend server:
   ```bash
   npm start        # Production mode
   npm run dev      # Development mode with nodemon
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd "Member A/frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Members API

#### POST /api/members
Create a new member.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890"  // optional
}
```

**Response (201 Created):**
```json
{
  "message": "Member created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "createdAt": "2025-11-22T10:00:00.000Z",
    "updatedAt": "2025-11-22T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `409 Conflict`: Member with email already exists

#### GET /api/members
Get all members.

**Response (200 OK):**
```json
{
  "message": "Members retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "createdAt": "2025-11-22T10:00:00.000Z",
      "updatedAt": "2025-11-22T10:00:00.000Z"
    }
  ]
}
```

#### GET /api/members/:id
Get a single member by ID.

**Response (200 OK):**
```json
{
  "message": "Member retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "createdAt": "2025-11-22T10:00:00.000Z",
    "updatedAt": "2025-11-22T10:00:00.000Z"
  }
}
```

### Items API

#### POST /api/items
Create a new item.

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "type": "book",
  "owner": "507f1f77bcf86cd799439011",
  "description": "Classic novel"  // optional
}
```

**Valid types:** `book`, `tool`, `equipment`, `electronic`, `other`

**Response (201 Created):**
```json
{
  "message": "Item created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Great Gatsby",
    "type": "book",
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "description": "Classic novel",
    "available": true,
    "createdAt": "2025-11-22T10:00:00.000Z",
    "updatedAt": "2025-11-22T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `404 Not Found`: Owner member not found

#### GET /api/items
Get all items with optional filtering.

**Query Parameters:**
- `available` (boolean): Filter by availability
- `type` (string): Filter by item type
- `owner` (string): Filter by owner ID

**Example:**
```
GET /api/items?available=true&type=book
```

**Response (200 OK):**
```json
{
  "message": "Items retrieved successfully",
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Great Gatsby",
      "type": "book",
      "owner": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "description": "Classic novel",
      "available": true,
      "createdAt": "2025-11-22T10:00:00.000Z",
      "updatedAt": "2025-11-22T10:00:00.000Z"
    }
  ]
}
```

#### GET /api/items/:id
Get a single item by ID.

**Response (200 OK):**
```json
{
  "message": "Item retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Great Gatsby",
    "type": "book",
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "description": "Classic novel",
    "available": true,
    "createdAt": "2025-11-22T10:00:00.000Z",
    "updatedAt": "2025-11-22T10:00:00.000Z"
  }
}
```

#### PUT /api/items/:id
Update an item.

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "type": "book",
  "owner": "507f1f77bcf86cd799439011",
  "description": "Updated description",
  "available": false
}
```

## Data Models

### Member Schema
```javascript
{
  name: String (required, 2-100 chars),
  email: String (required, unique, valid email),
  phone: String (optional, valid phone format),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Item Schema
```javascript
{
  title: String (required, 1-200 chars),
  type: String (required, enum: ['book', 'tool', 'equipment', 'electronic', 'other']),
  owner: ObjectId (required, references Member),
  description: String (optional, max 500 chars),
  available: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Validation Rules

### Member Validation
- Name: Required, 2-100 characters
- Email: Required, valid email format, unique
- Phone: Optional, valid phone format

### Item Validation
- Title: Required, 1-200 characters
- Type: Required, must be one of: book, tool, equipment, electronic, other
- Owner: Required, must be a valid member ID that exists
- Description: Optional, max 500 characters
- Available: Boolean, defaults to true

## Testing

### Run Backend Tests
```bash
cd "Member A/backend"
npm test
```

### Test Coverage
- Member creation (success and validation errors)
- Member listing
- Item creation (success and validation errors)
- Item listing with filters
- Owner validation

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "message": "Error message",
    "status": 400,
    "details": []  // Array of validation errors (if applicable)
  }
}
```

## Common Error Codes
- `400`: Bad Request (validation failed)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate email)
- `500`: Internal Server Error

## Integration Notes for Other Members

This system provides the following endpoints that other systems may use:

1. **GET /api/members** - Get list of all members
2. **GET /api/members/:id** - Get specific member details
3. **GET /api/items** - Get list of all items (can filter by available, type, owner)
4. **GET /api/items/:id** - Get specific item details
5. **PUT /api/items/:id** - Update item (useful for updating availability status)

**Important Field Names:**
- Member ID: `_id` (MongoDB ObjectId)
- Item ID: `_id` (MongoDB ObjectId)
- Availability status: `available` (boolean: true/false)
- Owner reference: `owner` (ObjectId referencing Member)

## Next Steps
- [ ] Coordinate with Member B to ensure loan system can access members and items
- [ ] Coordinate with Member C to ensure dashboard can access required data
- [ ] Define shared API contract document with all team members
- [ ] Integration testing once other subsystems are ready

