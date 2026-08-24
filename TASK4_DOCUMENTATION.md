# Task 4: REST API Consumption in React - Complete Documentation

## Overview
This task demonstrates how to consume the Express REST API from the React frontend, including data fetching, state management, loading/error handling, and client-side filtering.

---

## Implementation Summary

### RestaurantsPage Component
**File:** `quickbite-frontend/src/pages/RestaurantsPage.jsx`

The RestaurantsPage component implements all Task 4 requirements:

✅ Fetches restaurant data from backend API  
✅ Uses `fetch` API with `useEffect`  
✅ Manages three states: `restaurants`, `loading`, `error`  
✅ Displays loading indicator while fetching  
✅ Displays error message on failure  
✅ Renders restaurant data via RestaurantCard component  
✅ Implements client-side search/filter functionality  

---

## Component Structure

```
RestaurantsPage
├── Page Header (Title + Description)
├── Search Input (Client-side filtering)
├── Content Area
│   ├── Loading State (⏳ Loading restaurants...)
│   ├── Error State (❌ Error message + hint)
│   ├── Empty State (No results found)
│   └── Success State
│       ├── Result Count
│       └── RestaurantCard List
└── Styling (CSS-in-JS)
```

---

## State Management

### Three Core States

```javascript
const [restaurants, setRestaurants] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
```

| State | Type | Purpose |
|-------|------|---------|
| `restaurants` | Array | Stores all fetched restaurant data |
| `loading` | Boolean | Tracks if API request is in progress |
| `error` | String \| null | Stores error message if request fails |
| `searchTerm` | String | Stores user's search input for filtering |

---

## API Integration with useEffect

### Fetch Pattern

```javascript
useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/v1/restaurants');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRestaurants(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRestaurants([]);
    } finally {
      setLoading(false);  // Set in both success and error branches
    }
  };

  fetchRestaurants();
}, []);  // Empty dependency array = fetch only on mount
```

### Key Points

**1. Error Handling**
- Try-catch block catches network errors and JSON parsing errors
- HTTP error status (404, 500) handled with `response.ok` check
- Custom error message thrown for better UX

**2. State Updates**
- `setLoading(true)` before fetch starts
- `setError(null)` on success
- `setError(err.message)` on failure
- `setLoading(false)` in **finally block** (runs regardless of success/failure)

**3. Dependency Array**
- Empty `[]` means fetch only runs once on component mount
- Prevents infinite API calls

---

## Loading State

### Display Condition
```javascript
{loading && (
  <div className="loading">
    <p>⏳ Loading restaurants...</p>
  </div>
)}
```

### Appearance
- Centered loading message
- Emoji indicator (⏳)
- White background container
- Padding for spacing

### User Experience
- Shows while API request is in progress
- Replaces content area temporarily
- Clear, friendly message

---

## Error State

### Display Condition
```javascript
{error && (
  <div className="error">
    <p>❌ Error: {error}</p>
    <p className="error-hint">Make sure the backend is running on http://localhost:5000</p>
  </div>
)}
```

### Appearance
- Red/pink background (#f8d7da)
- Error icon (❌)
- Shows actual error message
- Helpful hint for troubleshooting

### Common Errors Handled
| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Backend not running | Start backend with `npm start` |
| "HTTP error! status: 404" | Wrong API endpoint | Verify URL is correct |
| "HTTP error! status: 500" | Server error | Check backend logs |
| Connection timeout | Network issue | Check if localhost:5000 is accessible |

---

## Success State - Data Rendering

### RestaurantCard Component Usage

```javascript
{filteredRestaurants.map((restaurant) => (
  <RestaurantCard
    key={restaurant._id}
    name={restaurant.name}
    cuisine={restaurant.cuisine}
    rating={restaurant.rating}
    isOpen={restaurant.isOpen}
  />
))}
```

### Data Flow

**Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Pizza Palace",
      "cuisine": "Italian",
      "rating": 4.5,
      "isOpen": true
    }
  ]
}
```

**Component Props:**
```javascript
<RestaurantCard
  name="Pizza Palace"           // From restaurant.name
  cuisine="Italian"             // From restaurant.cuisine
  rating={4.5}                  // From restaurant.rating
  isOpen={true}                 // From restaurant.isOpen
/>
```

### RestaurantCard Component

**File:** `quickbite-frontend/src/components/RestaurantCard.jsx`

**Props Accepted:**
- `name` (string) - Restaurant name
- `cuisine` (string) - Cuisine type
- `rating` (number) - Restaurant rating
- `isOpen` (boolean) - Open/closed status

**Displays:**
- Restaurant name as heading
- Cuisine type
- Rating with star emoji
- Status badge (color-coded):
  - ✅ Green "Open Now" if `isOpen === true`
  - ❌ Red "Closed" if `isOpen === false`

---

## Client-Side Search/Filter

### Search Input

```javascript
<div className="search-container">
  <input
    type="text"
    placeholder="Search by restaurant name or cuisine..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>
```

### Filter Logic

**No API call triggered!** Uses already-fetched data:

```javascript
const filteredRestaurants = restaurants.filter(restaurant =>
  restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
);
```

**How it works:**
1. User types in search input
2. `searchTerm` state updates
3. `filteredRestaurants` array is recalculated instantly
4. Only matching restaurants render
5. **Original `restaurants` array unchanged**

### Search Features

- ✅ Search by restaurant name (e.g., "Pizza Palace")
- ✅ Search by cuisine type (e.g., "Italian")
- ✅ Case-insensitive matching
- ✅ Partial word matching
- ✅ No API calls (instant results)
- ✅ No loading delay

### Search Examples

| Search Term | Results |
|-------------|---------|
| "pizza" | Pizza Palace |
| "Pizza" | Pizza Palace (case-insensitive) |
| "Italian" | Pizza Palace |
| "ital" | Pizza Palace (partial match) |
| "burger" | Burger Bliss |
| "american" | Burger Bliss |
| "xyz" | No results found |
| "" (empty) | All restaurants |

---

## Complete Component Code

```javascript
import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
  // State Management
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Data on Mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/v1/restaurants');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRestaurants(data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Client-side Filtering
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="restaurants-page">
      {/* Header */}
      <div className="page-header">
        <h1>Restaurants</h1>
        <p>Discover amazing restaurants</p>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by restaurant name or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Content Area */}
      <div className="content">
        {/* Loading State */}
        {loading && (
          <div className="loading">
            <p>⏳ Loading restaurants...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error">
            <p>❌ Error: {error}</p>
            <p className="error-hint">Make sure the backend is running on http://localhost:5000</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="no-results">
            <p>No restaurants found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Success State - Restaurant List */}
        {!loading && !error && filteredRestaurants.length > 0 && (
          <div className="restaurants-list">
            <p className="result-count">
              Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
            </p>
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                name={restaurant.name}
                cuisine={restaurant.cuisine}
                rating={restaurant.rating}
                isOpen={restaurant.isOpen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  RestaurantsPage                        │
│                  (Component Mount)                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │   useEffect Hook Runs      │
            │   (empty dependency array) │
            └────────────────────┬───────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │  fetch() to Backend API      │
                  │  /api/v1/restaurants         │
                  │  setLoading(true)            │
                  └──────────┬───────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ✅ SUCCESS         ❌ ERROR
              (response.ok)      (catch block)
                    │                 │
                    ▼                 ▼
          setRestaurants(data)   setError(message)
          setError(null)         setRestaurants([])
                    │                 │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  finally Block  │
                    │ setLoading(false)
                    └────────┬────────┘
                             │
              ┌──────────────▼──────────────┐
              │   Render Component          │
              │   - Show Loading? No        │
              │   - Show Error? No/Yes      │
              │   - Show Restaurants? Yes   │
              └─────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │   User Types Search Term    │
              │   setSearchTerm(value)      │
              └─────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │   Filter Array (No API Call)│
              │   filteredRestaurants =     │
              │   restaurants.filter(...)   │
              └─────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │   Render Filtered Results   │
              │   (Instant, No Delay)       │
              └─────────────────────────────┘
```

---

## Performance Considerations

### ✅ Optimizations Implemented

1. **Single API Call**
   - Data fetched once on mount
   - No refetch on every render

2. **Client-Side Filtering**
   - Search results instant (no network latency)
   - Reduces backend load
   - Better user experience

3. **Proper Loading States**
   - Loading state prevents UI glitches
   - Error state communicates failures
   - Empty state shows when no results

4. **Error Handling**
   - Try-catch prevents crashes
   - Meaningful error messages
   - Graceful failure handling

---

## Testing Scenarios

### Scenario 1: Successful Load
1. Navigate to `/restaurants`
2. ✅ Loading message displays briefly
3. ✅ Restaurants list appears
4. ✅ 5 sample restaurants visible (Pizza Palace, Burger Bliss, Sushi Station, Taco Fiesta, Curry House)

### Scenario 2: Search Functionality
1. Type "pizza" in search box
2. ✅ Only "Pizza Palace" shows
3. ✅ No API call made
4. ✅ Results instant

### Scenario 3: Backend Down
1. Stop backend server (`Ctrl+C` in backend terminal)
2. Refresh page
3. ✅ Loading message shows
4. ✅ After timeout, error message displays
5. ✅ Error message suggests: "Make sure the backend is running on http://localhost:5000"
6. ✅ Restart backend
7. Refresh page - ✅ Data loads successfully

### Scenario 4: No Search Results
1. Search for "xyz"
2. ✅ Message: "No restaurants found matching 'xyz'"
3. ✅ Empty RestaurantCard list

---

## API Endpoint Used

**Endpoint:** `GET /api/v1/restaurants`

**Base URL:** `http://localhost:5000`

**Full URL:** `http://localhost:5000/api/v1/restaurants`

**Method:** GET (fetch API)

**Authentication:** None (Public endpoint)

**Response Format:**
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
    }
  ]
}
```

---

## Task 4 Requirements Checklist

✅ **Retrieve restaurant information using GET /api/v1/restaurants**
- Implemented in useEffect hook
- Calls correct endpoint

✅ **Use fetch or Axios**
- Using fetch API (no Axios dependency)

✅ **Use useEffect() for component mount**
- useEffect runs once with empty dependency array
- Fetch triggered only when component mounts

✅ **Maintain three states: data, loading, error**
- `restaurants` - stores data
- `loading` - tracks fetch progress
- `error` - stores error messages
- `searchTerm` - additional state for filtering

✅ **Display loading message while request in progress**
- Shows "⏳ Loading restaurants..." during fetch

✅ **Display error message if request fails**
- Shows "❌ Error: [error message]"
- Includes helpful troubleshooting hint

✅ **Display restaurant data via RestaurantCard after success**
- Maps through `filteredRestaurants` array
- Passes props to RestaurantCard

✅ **Display: name, cuisine, open/closed status**
- RestaurantCard renders:
  - Restaurant name (bold heading)
  - Cuisine type ("Cuisine: Italian")
  - Rating with stars
  - Status with color coding (Open Now / Closed)

✅ **Restaurant information from API response (not hardcoded)**
- No hardcoded restaurant data
- All data comes from backend API

✅ **Client-side search input filtering**
- Search input at top of page
- Filters by name OR cuisine
- Case-insensitive matching
- Partial word matching

✅ **Filters already-fetched array without new API request**
- Uses `restaurants.filter()` on existing data
- No new fetch calls triggered
- Instant results

✅ **Set loading to false in both success and error branches**
- Loading set to false in `finally` block
- Runs regardless of success/error
- Prevents loading state stuck on true

---

## Browser DevTools Verification

### Network Tab
- Single network request to `http://localhost:5000/api/v1/restaurants`
- Response: 200 OK
- Response body shows restaurant array
- No additional requests when searching

### Console
- No errors when loading page
- No API errors on successful fetch
- Network errors logged if backend down

### React DevTools
- RestaurantsPage component mounted
- State changes visible:
  1. Initial: loading=true, restaurants=[], error=null
  2. After fetch: loading=false, restaurants=[...], error=null
  3. On search: searchTerm updates, component re-renders with filtered results

---

## Browser View

**URL:** `http://localhost:5173/restaurants`

**Page Structure:**
```
┌─────────────────────────────────────────────┐
│ 🍔 QuickBite                               │
│ [Home] [Restaurants] [Place Order] [Admin]  │
├─────────────────────────────────────────────┤
│                                             │
│  Restaurants                                │
│  Discover amazing restaurants               │
│                                             │
│  [Search by name or cuisine...]            │
│                                             │
│  Found 5 restaurants                        │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Pizza Palace                        │  │
│  │ Cuisine: Italian                    │  │
│  │ Rating: 4.5 ⭐                      │  │
│  │ [Open Now]                          │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │ Burger Bliss                        │  │
│  │ Cuisine: American                   │  │
│  │ Rating: 4.2 ⭐                      │  │
│  │ [Open Now]                          │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ... (more restaurants)                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Summary

**Task 4 Implementation Complete! ✅**

RestaurantsPage successfully demonstrates:
- API consumption with fetch
- Proper loading/error state management
- Data rendering via reusable components
- Client-side search filtering
- Professional error handling
- Optimal performance (single API call)
- User-friendly interface

All requirements met and tested!
