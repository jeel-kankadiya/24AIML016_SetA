# Task 3: Express REST API + Middleware Documentation

## Overview
The Express backend implements a complete REST API for managing restaurant orders with custom middleware for request logging, authentication, and error handling.

---

## REST Endpoints Implementation

### Base URL: `http://localhost:5000/api/v1`

### 1. POST `/auth/login` - Authenticate Customer
**Purpose:** Authenticate customer, issue token

**Method:** POST  
**Route:** `/api/v1/auth/login`  
**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "test@quickbite.com",
  "name": "Test User"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "customer": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Test User",
      "email": "test@quickbite.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Missing email field
- `500` - Server error

**Features:**
- Auto-creates customer if doesn't exist
- Issues JWT token valid for 7 days
- Returns customer data for frontend state

---

### 2. GET `/restaurants` - Get All Restaurants
**Purpose:** Return all restaurants (public)

**Method:** GET  
**Route:** `/api/v1/restaurants`  
**Authentication:** None (Public)  
**Headers:** None required

**Response (200):**
```json
{
  "success": true,
  "message": "Restaurants fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Pizza Palace",
      "cuisine": "Italian",
      "rating": 4.5,
      "isOpen": true,
      "createdAt": "2026-08-24T07:28:00.000Z",
      "updatedAt": "2026-08-24T07:28:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Burger Bliss",
      "cuisine": "American",
      "rating": 4.2,
      "isOpen": true,
      "createdAt": "2026-08-24T07:28:00.000Z",
      "updatedAt": "2026-08-24T07:28:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Restaurants fetched successfully
- `500` - Server error

**Features:**
- No authentication required
- Returns complete restaurant list
- Includes all restaurant details
- Perfect for frontend restaurant listing page

---

### 3. POST `/orders` - Create a New Order
**Purpose:** Create a new order (protected)

**Method:** POST  
**Route:** `/api/v1/orders`  
**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer <token_from_login>
Content-Type: application/json
```

**Request Body:**
```json
{
  "restaurantId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "name": "Margherita Pizza",
      "quantity": 2
    },
    {
      "name": "Caesar Salad",
      "quantity": 1
    }
  ],
  "totalAmount": 45.99,
  "deliveryAddress": "123 Main St, Apt 4B, New York, NY 10001"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439013",
    "customerId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Test User",
      "email": "test@quickbite.com"
    },
    "restaurantId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Pizza Palace",
      "cuisine": "Italian"
    },
    "items": [
      {
        "name": "Margherita Pizza",
        "quantity": 2
      },
      {
        "name": "Caesar Salad",
        "quantity": 1
      }
    ],
    "totalAmount": 45.99,
    "status": "pending",
    "createdAt": "2026-08-24T10:15:20.000Z",
    "updatedAt": "2026-08-24T10:15:20.000Z"
  }
}
```

**Status Codes:**
- `201` - Order created successfully
- `400` - Validation error (missing restaurantId or items)
- `401` - Missing/invalid token
- `500` - Server error

**Validation:**
- Restaurant ID required
- Items array required (non-empty)
- Token validation via authGuard middleware

**Features:**
- Automatic customer ID assignment from token
- Populated restaurant and customer data
- Default status set to "pending"
- Timestamps auto-generated

---

### 4. GET `/orders` - Get Customer's Orders
**Purpose:** Return all orders for the logged-in customer (protected)

**Method:** GET  
**Route:** `/api/v1/orders`  
**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer <token_from_login>
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "customerId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Test User",
        "email": "test@quickbite.com"
      },
      "restaurantId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Pizza Palace",
        "cuisine": "Italian"
      },
      "items": [
        {
          "name": "Margherita Pizza",
          "quantity": 2
        }
      ],
      "totalAmount": 25.99,
      "status": "preparing",
      "createdAt": "2026-08-24T10:15:20.000Z",
      "updatedAt": "2026-08-24T10:20:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Orders fetched successfully
- `401` - Missing/invalid token
- `500` - Server error

**Features:**
- Returns only orders for logged-in customer
- Populated customer and restaurant data
- Sorted by creation date (most recent first)
- Includes order items and status

---

### 5. PATCH `/orders/:id/status` - Update Order Status
**Purpose:** Update order status (protected)

**Method:** PATCH  
**Route:** `/api/v1/orders/:id/status`  
**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer <token_from_login>
Content-Type: application/json
```

**URL Parameters:**
- `id` - Order ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Valid Status Values:**
- `pending` - Order received, awaiting preparation
- `preparing` - Kitchen is preparing the order
- `out-for-delivery` - Order is on the way
- `delivered` - Order successfully delivered
- `cancelled` - Order was cancelled

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439013",
    "customerId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Test User",
      "email": "test@quickbite.com"
    },
    "restaurantId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Pizza Palace",
      "cuisine": "Italian"
    },
    "items": [
      {
        "name": "Margherita Pizza",
        "quantity": 2
      }
    ],
    "totalAmount": 25.99,
    "status": "preparing",
    "createdAt": "2026-08-24T10:15:20.000Z",
    "updatedAt": "2026-08-24T10:20:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Status updated successfully
- `400` - Invalid status value or missing status field
- `401` - Missing/invalid token
- `404` - Order not found
- `500` - Server error

**Validation:**
- Status must be one of the valid enum values
- Order must exist in database
- User must be authenticated

**Features:**
- Updates only the status field
- Preserves all other order data
- Updates the `updatedAt` timestamp
- Returns populated order data

---

## Middleware Implementation

### 1. Request Logger Middleware
**File:** `middleware/requestLogger.js`

**Purpose:** Log every request with timestamp and method

**Log Format:** `[METHOD] [PATH] [TIMESTAMP]`

**Example Logs:**
```
[GET] /api/v1/restaurants [2026-08-24T07:28:04.478Z]
[POST] /api/v1/auth/login [2026-08-24T07:28:12.675Z]
[POST] /api/v1/orders [2026-08-24T07:28:22.929Z]
[PATCH] /api/v1/orders/607f1f77bcf86cd799439013/status [2026-08-24T07:29:15.123Z]
```

**Implementation:**
```javascript
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.path} [${timestamp}]`);
  next();
};
```

**Applied Globally:** Yes, applied to all routes via `app.use(requestLogger)`

---

### 2. Auth Guard Middleware
**File:** `middleware/authGuard.js`

**Purpose:** Validate Bearer token in Authorization header

**Validation Logic:**
1. Check if `Authorization` header exists
2. Extract Bearer token from header
3. Verify JWT signature
4. Return 401 if token missing or invalid

**Error Responses:**

**Missing Token:**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```
Status: 401

**Invalid/Expired Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```
Status: 401

**Implementation:**
```javascript
const authGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please login first.'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customerId = decoded.customerId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

**Applied Routes:**
- ✅ POST `/api/v1/orders`
- ✅ GET `/api/v1/orders`
- ✅ PATCH `/api/v1/orders/:id/status`

**Excluded Routes:**
- ❌ POST `/api/v1/auth/login` (Public)
- ❌ GET `/api/v1/restaurants` (Public)

---

### 3. Global Error Handler Middleware
**File:** `middleware/errorHandler.js`

**Purpose:** Catch and handle all errors with structured JSON response

**Error Types Handled:**

**Mongoose Validation Error:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Name is required",
    "Email is required"
  ]
}
```
Status: 400

**Duplicate Key Error (Email already exists):**
```json
{
  "success": false,
  "message": "email already exists"
}
```
Status: 400

**Invalid Status Enum:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "status: invalid_enum_value"
  ]
}
```
Status: 400

**Generic Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```
Status: 500

**Implementation:**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};
```

**Applied:** As last middleware in application

---

## HTTP Status Codes Used

| Code | Usage | Scenario |
|------|-------|----------|
| 200 | Success | Successful GET, PATCH operations |
| 201 | Created | Successful POST operations (new resource) |
| 400 | Bad Request | Validation errors, missing required fields |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Not Found | Resource (order) not found |
| 500 | Server Error | Unhandled exceptions, database errors |

---

## Testing the Endpoints

### Using PowerShell/Thunder Client

#### 1. Test Login
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "customer1@test.com",
  "name": "John Doe"
}
```

#### 2. Test Get Restaurants
```
GET http://localhost:5000/api/v1/restaurants
```

#### 3. Test Create Order (Replace token with actual token)
```
POST http://localhost:5000/api/v1/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "restaurantId": "507f1f77bcf86cd799439011",
  "items": [
    {"name": "Pizza", "quantity": 2}
  ],
  "totalAmount": 25.99
}
```

#### 4. Test Get Orders (Protected)
```
GET http://localhost:5000/api/v1/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 5. Test Update Order Status
```
PATCH http://localhost:5000/api/v1/orders/607f1f77bcf86cd799439013/status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "preparing"
}
```

---

## Middleware Wiring in Server

```javascript
// Global middleware
app.use(express.json());
app.use(requestLogger);  // Applied to ALL requests

// Public routes (no auth required)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);

// Protected routes (auth required)
app.use('/api/v1/orders', authGuard, orderRoutes);

// Error handler (must be last)
app.use(errorHandler);
```

---

## Key Features

✅ **All 5 endpoints implemented**  
✅ **Custom request logger** - Logs all requests with method and timestamp  
✅ **Auth guard middleware** - Validates Bearer tokens on protected routes  
✅ **Global error handler** - Structured JSON error responses  
✅ **Proper HTTP status codes** - Correct codes for each scenario  
✅ **Database validation** - Schema-level validation on all models  
✅ **Populated references** - Returns customer/restaurant data with orders  
✅ **Production-ready** - Error handling, input validation, logging  

---

## Validation Examples

### Successful Validations ✅
- Email uniqueness check on login
- Required fields validation
- Enum status values validation
- Min value validation on totalAmount

### Error Handling ✅
- Missing required fields → 400 Bad Request
- Invalid token → 401 Unauthorized
- Duplicate email → 400 with specific message
- Invalid status → 400 with validation errors
- Unhandled errors → 500 Server Error

