# Member B - Sub-System B: Lending & Return Logic

## Overview
This system handles the borrowing and returning of items, managing loan records and updating item availability status.

## Technology Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React.js
- **Testing**: Jest + Supertest

## Project Structure
```
Member B/
├── backend/
│   ├── models/
│   │   ├── Loan.js          # Loan schema/model
│   │   ├── Item.js          # Reference to Member A's Item model
│   │   └── Member.js        # Reference to Member A's Member model
│   ├── routes/
│   │   └── loans.js         # Loan API routes
│   ├── tests/
│   │   └── loans.test.js    # Loan API tests
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BorrowItem.js
│   │   │   ├── BorrowedItems.js
│   │   │   └── LoanHistory.js
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- **Member A's system must be set up first** (for Member and Item collections)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd "Member B/backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/lendify
   NODE_ENV=development
   ```
   **Important**: Use the same MongoDB database as Member A!

4. Start the backend server:
   ```bash
   npm start        # Production mode
   npm run dev      # Development mode with nodemon
   ```

The backend API will be available at `http://localhost:5001`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd "Member B/frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Update API URLs** (if Member A's backend is on a different port):
   - Edit `src/components/BorrowItem.js` and `BorrowedItems.js`
   - Update the Member A API URL (currently `http://localhost:5000/api/members`)

4. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3001` (or next available port)

## API Documentation

### Base URL
```
http://localhost:5001/api
```

### Loans API

#### POST /api/loans/borrow
Borrow an item: updates item availability and creates a loan record.

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439012",
  "borrowerMemberId": "507f1f77bcf86cd799439011",
  "dueDate": "2025-12-01T10:00:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "message": "Item borrowed successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "itemId": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Great Gatsby",
      "type": "book",
      "owner": "507f1f77bcf86cd799439010"
    },
    "borrowerMemberId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "borrowDate": "2025-11-22T10:00:00.000Z",
    "dueDate": "2025-12-01T10:00:00.000Z",
    "returnDate": null,
    "status": "active",
    "createdAt": "2025-11-22T10:00:00.000Z",
    "updatedAt": "2025-11-22T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed or cannot borrow own item
- `404 Not Found`: Item or member not found
- `409 Conflict`: Item is not available for borrowing

#### POST /api/loans/return
Return an item: updates return date, status, and item availability.

**Request Body:**
```json
{
  "loanId": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK):**
```json
{
  "message": "Item returned successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "itemId": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Great Gatsby",
      "type": "book"
    },
    "borrowerMemberId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "borrowDate": "2025-11-22T10:00:00.000Z",
    "dueDate": "2025-12-01T10:00:00.000Z",
    "returnDate": "2025-11-25T10:00:00.000Z",
    "status": "returned",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `404 Not Found`: Loan not found
- `409 Conflict`: Item has already been returned

#### GET /api/loans
List all loans with optional filtering.

**Query Parameters:**
- `status` (string): Filter by status (`active`, `returned`, `overdue`)
- `borrowerMemberId` (string): Filter by borrower ID
- `itemId` (string): Filter by item ID

**Example:**
```
GET /api/loans?status=active&borrowerMemberId=507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "message": "Loans retrieved successfully",
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "itemId": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "The Great Gatsby",
        "type": "book"
      },
      "borrowerMemberId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "borrowDate": "2025-11-22T10:00:00.000Z",
      "dueDate": "2025-12-01T10:00:00.000Z",
      "returnDate": null,
      "status": "active"
    }
  ]
}
```

#### GET /api/loans/:id
Get a single loan by ID.

#### GET /api/loans/available/items
Get list of all available items for borrowing (calls Member A's Item collection).

#### GET /api/loans/borrowed/by/:memberId
Get list of items currently borrowed by a specific member.

## Data Models

### Loan Schema
```javascript
{
  itemId: ObjectId (required, references Item),
  borrowerMemberId: ObjectId (required, references Member),
  borrowDate: Date (required, default: now),
  dueDate: Date (required, must be after borrowDate),
  returnDate: Date (optional, null if not returned),
  status: String (enum: ['active', 'returned', 'overdue'], default: 'active'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Status Logic
- **active**: Loan is active, item is borrowed, due date not passed
- **returned**: Item has been returned (returnDate is set)
- **overdue**: Due date has passed, item not yet returned (auto-updated)

## Business Logic

### Borrow Flow
1. Validate item exists and is available (`available: true`)
2. Validate borrower exists
3. Check borrower is not the item owner
4. Validate due date is in the future
5. Create loan record with status `active`
6. Update item `available` to `false`

### Return Flow
1. Validate loan exists
2. Check loan is not already returned
3. Update loan `returnDate` to current date
4. Update loan `status` to `returned`
5. Update item `available` to `true`

### Overdue Detection
- Status automatically updates to `overdue` when:
  - Due date has passed
  - Item is not returned (`returnDate` is null)
  - Status is `active`

## Testing

### Run Backend Tests
```bash
cd "Member B/backend"
npm test
```

### Test Coverage
- Borrow flow end-to-end
- Return flow
- Item availability updates
- Loan record updates
- Validation errors
- Cannot borrow own item
- Cannot borrow unavailable item
- Cannot return already returned item

## Integration with Member A

This system relies on Member A's collections:
- **Members collection**: For validating borrowers
- **Items collection**: For reading items and updating availability

**Shared Database**: Both systems must use the same MongoDB database (`lendify`).

**API Communication**: The frontend calls Member A's API to fetch members:
```
GET http://localhost:5000/api/members
```

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
- `400`: Bad Request (validation failed, cannot borrow own item)
- `404`: Not Found (item, member, or loan not found)
- `409`: Conflict (item not available, already returned)
- `500`: Internal Server Error

## Integration Notes for Other Members

This system provides the following endpoints that other systems may use:

1. **GET /api/loans** - Get all loans (can filter by status, borrower, item)
2. **GET /api/loans/:id** - Get specific loan details
3. **GET /api/loans/borrowed/by/:memberId** - Get loans for a specific member
4. **POST /api/loans/borrow** - Borrow an item
5. **POST /api/loans/return** - Return an item

**Important Field Names:**
- Loan ID: `_id` (MongoDB ObjectId)
- Item ID: `itemId` (ObjectId referencing Item)
- Borrower ID: `borrowerMemberId` (ObjectId referencing Member)
- Status: `status` (string: 'active', 'returned', 'overdue')

## Next Steps
- [ ] Coordinate with Member A to ensure item availability updates work correctly
- [ ] Coordinate with Member C to ensure dashboard can access loan data
- [ ] Integration testing with Member A's system
- [ ] Test end-to-end borrow and return flows

