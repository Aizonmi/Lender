# Member C - Sub-System C: Dashboard & Reporting

## Overview
This system provides a comprehensive dashboard with statistics, charts, and reporting features for monitoring the lending platform.

## Technology Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React.js with Recharts for visualization
- **Testing**: Jest + Supertest

## Project Structure
```
Member C/
├── backend/
│   ├── models/
│   │   ├── Loan.js          # Reference to Member B's Loan model
│   │   ├── Item.js          # Reference to Member A's Item model
│   │   └── Member.js        # Reference to Member A's Member model
│   ├── routes/
│   │   ├── dashboard.js     # Dashboard API routes
│   │   └── loans.js         # Loan history routes
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardOverview.js
│   │   │   ├── CurrentBorrows.js
│   │   │   ├── LoanHistory.js
│   │   │   └── StatsCharts.js
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
- **Member A and Member B's systems must be set up first** (for shared database)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd "Member C/backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5002
   MONGODB_URI=mongodb://localhost:27017/lendify
   NODE_ENV=development
   ```
   **Important**: Use the same MongoDB database as Member A and B!

4. Start the backend server:
   ```bash
   npm start        # Production mode
   npm run dev      # Development mode with nodemon
   ```

The backend API will be available at `http://localhost:5002`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd "Member C/frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3002` (or next available port)

## API Documentation

### Base URL
```
http://localhost:5002/api
```

### Dashboard API

#### GET /api/dashboard/overdue
Get items past due date.

**Response (200 OK):**
```json
{
  "message": "Overdue items retrieved successfully",
  "count": 3,
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
      "borrowDate": "2025-11-15T10:00:00.000Z",
      "dueDate": "2025-11-20T10:00:00.000Z",
      "status": "overdue"
    }
  ]
}
```

#### GET /api/dashboard/stats
Get comprehensive dashboard statistics.

**Response (200 OK):**
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "overall": {
      "totalMembers": 10,
      "totalItems": 25,
      "availableItems": 15,
      "borrowedItems": 10,
      "totalLoans": 50,
      "activeLoans": 10,
      "returnedLoans": 38,
      "overdueLoans": 2
    },
    "mostBorrowedItems": [
      {
        "itemId": "507f1f77bcf86cd799439012",
        "title": "The Great Gatsby",
        "type": "book",
        "borrowCount": 8,
        "activeBorrows": 1
      }
    ],
    "borrowCountsByMember": [
      {
        "memberId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "borrowCount": 12,
        "activeBorrows": 2,
        "returnedCount": 10
      }
    ],
    "loansByType": [
      {
        "type": "book",
        "count": 30
      }
    ]
  }
}
```

#### GET /api/dashboard/current-borrows
Get items currently borrowed with optional date filtering.

**Query Parameters:**
- `startDate` (ISO 8601): Filter borrows from this date
- `endDate` (ISO 8601): Filter borrows until this date

**Example:**
```
GET /api/dashboard/current-borrows?startDate=2025-11-01&endDate=2025-11-30
```

#### GET /api/dashboard/notifications
Get notifications (e.g., overdue items).

**Response (200 OK):**
```json
{
  "message": "Notifications retrieved successfully",
  "count": 2,
  "hasOverdue": true,
  "data": [
    {
      "type": "overdue",
      "message": "Item \"The Great Gatsby\" is overdue. Borrower: John Doe",
      "loanId": "507f1f77bcf86cd799439013",
      "itemId": "507f1f77bcf86cd799439012",
      "borrowerId": "507f1f77bcf86cd799439011",
      "dueDate": "2025-11-20T10:00:00.000Z",
      "daysOverdue": 5
    }
  ]
}
```

### Loans API

#### GET /api/loans/history
Get full loan history with optional filtering.

**Query Parameters:**
- `startDate` (ISO 8601): Filter loans from this date
- `endDate` (ISO 8601): Filter loans until this date
- `status` (string): Filter by status (`active`, `returned`, `overdue`)

**Example:**
```
GET /api/loans/history?status=returned&startDate=2025-11-01
```

## Features

### Dashboard Overview
- Overall statistics (total members, items, loans)
- Overdue items alert and list
- Top 5 most borrowed items
- Top 5 members by borrow count

### Current Borrows
- View all currently borrowed items
- Filter by date range
- Highlight overdue items in red
- Show borrower and due date information

### Loan History
- Complete loan history
- Filter by date range and status
- View all past loans with return dates

### Analytics & Charts
- Bar chart: Top 5 most borrowed items
- Bar chart: Top 5 members by borrow count
- Pie chart: Loans distribution by item type
- Summary statistics table

### Notifications
- Automatic overdue item detection
- Alert banner when items are overdue
- Notification count and details

## Data Models

This system uses reference models that match Member A and Member B's schemas:
- **Loan**: References Member B's Loan collection
- **Item**: References Member A's Item collection
- **Member**: References Member A's Member collection

## Integration with Other Members

This system relies on:
- **Member A's Collections**: Members and Items
- **Member B's Collections**: Loans

**Shared Database**: All three systems must use the same MongoDB database (`lendify`).

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "message": "Error message",
    "status": 500
  }
}
```

## Common Error Codes
- `500`: Internal Server Error

## Testing

### Run Backend Tests
```bash
cd "Member C/backend"
npm test
```

### Manual Testing Checklist
- [ ] Verify overdue items are detected correctly
- [ ] Verify dashboard stats reflect correct data
- [ ] Test date range filtering
- [ ] Verify charts display correctly
- [ ] Test notification system

## Next Steps
- [ ] Coordinate with Member A and B to ensure data consistency
- [ ] Integration testing with all subsystems
- [ ] Verify dashboard updates correctly after borrow/return operations
- [ ] Test overdue detection and notifications

