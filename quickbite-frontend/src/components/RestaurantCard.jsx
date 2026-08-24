import React from 'react';

const RestaurantCard = ({ name, cuisine, rating, isOpen }) => {
  return (
    <div className="restaurant-card">
      <div className="card-content">
        <h3>{name}</h3>
        <p className="cuisine">Cuisine: {cuisine}</p>
        <p className="rating">Rating: {rating} ⭐</p>
        <div className={`status ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </div>
      </div>
      <style jsx>{`
        .restaurant-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin: 12px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .restaurant-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .card-content h3 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .cuisine, .rating {
          margin: 4px 0;
          color: #666;
          font-size: 14px;
        }

        .status {
          margin-top: 12px;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: bold;
          text-align: center;
          font-size: 14px;
        }

        .status.open {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status.closed {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </div>
  );
};

export default RestaurantCard;
