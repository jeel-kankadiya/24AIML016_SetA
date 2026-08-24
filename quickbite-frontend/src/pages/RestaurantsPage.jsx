import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h1>Restaurants</h1>
        <p>Discover amazing restaurants</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by restaurant name or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="content">
        {loading && (
          <div className="loading">
            <p>⏳ Loading restaurants...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ Error: {error}</p>
            <p className="error-hint">Make sure the backend is running on http://localhost:5000</p>
          </div>
        )}

        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="no-results">
            <p>No restaurants found matching "{searchTerm}"</p>
          </div>
        )}

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

      <style jsx>{`
        .restaurants-page {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 8px;
        }

        .page-header h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 2.5rem;
        }

        .page-header p {
          margin: 0;
          color: #666;
          font-size: 1.1rem;
        }

        .search-container {
          max-width: 600px;
          margin: 0 auto 2rem auto;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #ff6b35;
        }

        .content {
          max-width: 800px;
          margin: 0 auto;
        }

        .loading,
        .error,
        .no-results {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          margin: 2rem 0;
        }

        .loading p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }

        .error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }

        .error p {
          color: #721c24;
          margin: 0.5rem 0;
        }

        .error-hint {
          font-size: 0.9rem;
          font-style: italic;
        }

        .no-results p {
          color: #666;
          margin: 0;
          font-size: 1rem;
        }

        .restaurants-list {
          background: white;
          padding: 2rem;
          border-radius: 8px;
        }

        .result-count {
          color: #666;
          font-size: 0.95rem;
          margin: 0 0 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default RestaurantsPage;
