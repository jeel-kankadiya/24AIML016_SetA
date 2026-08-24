# QuickBite Food Ordering System

A full-stack MERN (MongoDB, Express, React, Node.js) application for a food ordering platform. This system allows customers to browse restaurants, place orders, and track their status. Restaurant owners and admins can manage orders in real-time.

**Exam:** ITUE301 - Open-Book Practical Examination  
**Institution:** CSPIT, CHARUSAT  
**Date:** August 24, 2026

---

## 📋 Project Structure

```
24AIML016_SetA/
├── quickbite-backend/          # Express backend server
│   ├── models/                 # Mongoose schemas
│   │   ├── Customer.js
│   │   ├── Restaurant.js
│   │   └── Order.js
│   ├── routes/                 # API endpoints
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/             # Custom middleware
│   │   ├── authGuard.js       # JWT authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── requestLogger.js   # Request logging
│   ├── server.js              # Main server file
│   ├── .env                   # Environment variables
│   └── package.json
│
├── quickbite-frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navigation.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/           # Global state management
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── RestaurantsPage.jsx
│   │   │   ├── OrderPage.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx            # Main app with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
│
├── start-backend.bat          # Script to start backend
├── start-frontend.bat         # Script to start frontend
└── README.md
```

---

## ✨ Features

### Backend Features (Express + MongoDB)
- ✅ **Authentication API** - Customer login with JWT tokens
- ✅ **Restaurant Listing** - Get all restaurants with details (public endpoint)
- ✅ **Order Management** - Create, read, and update orders
- ✅ **Custom Middleware**:
  - Request logging with timestamp and method
  - JWT authentication guard for protected routes
  - Global error handling with structured JSON responses
- ✅ **Database** - MongoDB with Mongoose schemas and validation

### Frontend Features (React + Vite)
- ✅ **Multi-page Application** with React Router
  - Home page with demo login
  - Restaurants listing page with search/filter
  - Order placement page (protected)
  - Admin dashboard (lazy-loaded)
- ✅ **Authentication** - Context API for global auth state
- ✅ **Protected Routes** - Redirect unauthenticated users to home
- ✅ **API Integration** - Fetch from Express backend with loading/error states
- ✅ **Reusable Components** - RestaurantCard with dynamic styling
- ✅ **Lazy Loading** - AdminPanel loaded via React.lazy + Suspense

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (v8.0+)
- npm (v11+)

### Installation

#### 1. Backend Setup
```bash
cd quickbite-backend
npm install
```

#### 2. Frontend Setup
```bash
cd quickbite-frontend
npm install
```

#### 3. Configure Environment
Update `.env` in `quickbite-backend/`:
```
MONGO_URI=mongodb://localhost:27017/quickbite
PORT=5000
JWT_SECRET=quickbite-secret-key-12345
```

---

## 🎯 Running the Application

### Start Backend Server
```bash
cd quickbite-backend
npm start
```
Backend will run on `http://localhost:5000`

### Start Frontend Dev Server
```bash
cd quickbite-frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Using Start Scripts (Windows)
```bash
# Start backend
start-backend.bat

# Start frontend (in another terminal)
start-frontend.bat
```

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

#### Authentication
- **POST** `/auth/login`
  - Body: `{ email: string, name: string }`
  - Returns: `{ customer: {...}, token: string }`
  - Status: 200

#### Restaurants (Public)
- **GET** `/restaurants`
  - Returns: Array of restaurants
  - Status: 200
  - Example Response:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "...",
          "name": "Pizza Palace",
          "cuisine": "Italian",
          "rating": 4.5,
          "isOpen": true
        }
      ]
    }
    ```

#### Orders (Protected - Requires Bearer Token)
- **POST** `/orders`
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "restaurantId": "...",
      "items": [{"name": "Pizza", "quantity": 2}],
      "totalAmount": 25.99
    }
    ```
  - Status: 201

- **GET** `/orders`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of customer's orders
  - Status: 200

- **PATCH** `/orders/:id/status`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ status: "pending|preparing|out-for-delivery|delivered|cancelled" }`
  - Status: 200

---

## 📊 Database Schemas

### Customer
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String,
  address: String,
  timestamps: true
}
```

### Restaurant
```javascript
{
  name: String (required),
  cuisine: String (required),
  rating: Number,
  isOpen: Boolean (default: true),
  timestamps: true
}
```

### Order
```javascript
{
  customerId: ObjectId (ref: Customer, required),
  restaurantId: ObjectId (ref: Restaurant, required),
  items: Array (required),
  totalAmount: Number (min: 0),
  status: String (enum: ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], default: 'pending'),
  timestamps: true
}
```

---

## 🔐 Authentication Flow

1. **Login**: User enters email on HomePage
2. **Token Issued**: Backend generates JWT token and returns customer data
3. **Store in Context**: Token and customer info stored in AuthContext
4. **Protected Routes**: `/order` and `/admin` check for valid token
5. **API Requests**: All protected endpoints require `Authorization: Bearer <token>` header

---

## 🧪 Testing the APIs

### Using PowerShell (Included test-api.ps1)
```powershell
# Run the test script
.\test-api.ps1
```

### Manual Testing with Postman/Thunder Client

#### 1. Login
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@quickbite.com",
  "name": "Test User"
}
```

#### 2. Get Restaurants
```
GET http://localhost:5000/api/v1/restaurants
```

#### 3. Create Order (requires token from login)
```
POST http://localhost:5000/api/v1/orders
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "restaurantId": "<id_from_restaurants>",
  "items": [
    {
      "name": "Margherita Pizza",
      "quantity": 2
    }
  ],
  "totalAmount": 25.99
}
```

#### 4. Get My Orders
```
GET http://localhost:5000/api/v1/orders
Authorization: Bearer <token_from_login>
```

#### 5. Update Order Status
```
PATCH http://localhost:5000/api/v1/orders/<order_id>/status
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "status": "preparing"
}
```

---

## 🎨 Frontend Pages

### HomePage (`/`)
- Welcome message
- Demo login button (auto-fills credentials)
- Feature highlights
- Navigation to other pages for logged-in users

### RestaurantsPage (`/restaurants`)
- Fetches and displays all restaurants
- Loading state while fetching
- Error handling for API failures
- Search/filter by restaurant name or cuisine
- RestaurantCard component shows:
  - Restaurant name
  - Cuisine type
  - Rating with stars
  - Dynamic open/closed status

### OrderPage (`/order`) - Protected
- Requires authentication
- Form to create new order with:
  - Restaurant selection dropdown
  - Item name input
  - Quantity selector
  - Delivery address text area
- Real-time state display
- Success/error messages
- Order confirmation with ID and status

### AdminPanel (`/admin`) - Protected & Lazy-Loaded
- Requires authentication
- Table view of all orders
- Shows:
  - Order ID (truncated)
  - Customer name and email
  - Restaurant name
  - Ordered items
  - Total amount
  - Order status with color coding
  - Dropdown to update order status

---

## 🛡️ Middleware Details

### Request Logger
Logs every request with format: `[METHOD] [PATH] [TIMESTAMP]`
```
[GET] /api/v1/restaurants [2026-08-24T10:15:20.000Z]
[POST] /api/v1/auth/login [2026-08-24T10:15:21.500Z]
```

### Auth Guard
- Checks for `Authorization: Bearer <token>` header
- Validates JWT token signature
- Returns 401 if missing or invalid
- Applied to all routes except `/auth/login` and `/restaurants`

### Error Handler
- Catches all errors thrown by routes
- Handles Mongoose validation errors
- Handles duplicate key errors
- Returns structured JSON response instead of raw error stack
- Appropriate HTTP status codes (400, 401, 500)

---

## 💾 Sample Data

### Pre-seeded Restaurants
When the backend starts, these restaurants are automatically added if the database is empty:

1. **Pizza Palace** - Italian - Rating: 4.5 - Open
2. **Burger Bliss** - American - Rating: 4.2 - Open
3. **Sushi Station** - Japanese - Rating: 4.8 - Open
4. **Taco Fiesta** - Mexican - Rating: 4.3 - Closed
5. **Curry House** - Indian - Rating: 4.6 - Open

---

## 📝 Compliance with Requirements

### Task 1: React Component Architecture ✅
- [x] Created HomePage, RestaurantsPage, OrderPage, RestaurantCard
- [x] RestaurantCard accepts props: name, cuisine, rating, isOpen
- [x] Open/Closed status displays with different CSS classes
- [x] Reusable components in `/components` folder

### Task 2: React Routing & State Management ✅
- [x] React Router configured with routes:
  - `/` → HomePage
  - `/restaurants` → RestaurantsPage
  - `/order` → OrderPage (protected)
  - `/admin` → AdminPanel (lazy-loaded)
- [x] Navigation component with React Router links (no full-page reload)
- [x] OrderPage form with fields: restaurant, item name, quantity, delivery address
- [x] useState used for form state management
- [x] Form state values displayed in real-time
- [x] AuthContext with { customer, token }
- [x] ProtectedRoute redirects unauthenticated users

### Task 3: Express REST API & Middleware ✅
- [x] 5 REST endpoints implemented:
  - POST `/api/v1/auth/login`
  - GET `/api/v1/restaurants`
  - POST `/api/v1/orders`
  - GET `/api/v1/orders`
  - PATCH `/api/v1/orders/:id/status`
- [x] Custom requestLogger middleware: `[METHOD] [PATH] [TIMESTAMP]`
- [x] authGuard middleware validates Bearer token
- [x] Global error handling middleware
- [x] Appropriate HTTP status codes (200, 201, 400, 401, 500)

### Task 4: REST API Consumption in React ✅
- [x] RestaurantsPage calls GET `/api/v1/restaurants`
- [x] Uses useEffect for component mount
- [x] Three states: data, loading, error
- [x] Displays loading message while fetching
- [x] Displays error message on failure
- [x] Displays restaurant data via RestaurantCard
- [x] Client-side search/filter without new API call

### Task 5: MongoDB & Mongoose Schemas ✅
- [x] Three schemas with proper validation:
  - Customer: name (required), email (required, unique), phone, address
  - Restaurant: name (required), cuisine (required), rating, isOpen (default: true)
  - Order: customerId (ref), restaurantId (ref), items (required), totalAmount (min: 0), status (enum, default: 'pending')
- [x] MongoDB connection via MONGO_URI in .env
- [x] Validation demonstrated with meaningful error responses

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check if port 5000 is in use: `netstat -ano | findstr :5000`
- Verify `.env` file exists with correct MONGO_URI

### Frontend won't load
- Ensure backend is running before starting frontend
- Check if port 5173 is in use
- Clear browser cache if styles don't load

### API errors
- Check browser console for detailed error messages
- Verify token is included in request headers for protected routes
- Check backend logs for request details

---

## 📦 Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `nodemon` - Development auto-restart

### Frontend
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client (optional, uses fetch in current implementation)
- `vite` - Fast build tool

---

## 📄 License

Educational project for ITUE301 Practical Examination

---

## 👨‍💻 Developer Notes

- All components use modern React Hooks (useState, useEffect, useContext)
- CSS-in-JS using styled JSX for component-scoped styles
- Error boundaries and try-catch blocks for production safety
- JWT tokens set to expire in 7 days
- Frontend handles offline scenarios gracefully

---

## 🔗 Quick Links

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Restaurants API: http://localhost:5000/api/v1/restaurants
- GitHub: https://github.com/jeel-kankadiya/24AIML016_SetA
