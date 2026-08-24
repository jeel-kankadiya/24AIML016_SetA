import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
  const { auth } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    restaurantId: '',
    itemName: '',
    quantity: 1,
    deliveryAddress: auth.customer?.address || ''
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/restaurants');
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };

    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const orderPayload = {
        restaurantId: formData.restaurantId,
        items: [
          {
            name: formData.itemName,
            quantity: formData.quantity
          }
        ],
        totalAmount: formData.quantity * 12.99, // Example price per item
        deliveryAddress: formData.deliveryAddress
      };

      const response = await fetch('http://localhost:5000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const data = await response.json();
        setSubmittedData(data.data);
        setMessage('✅ Order placed successfully!');
        setFormData({
          restaurantId: '',
          itemName: '',
          quantity: 1,
          deliveryAddress: auth.customer?.address || ''
        });
      } else {
        const errorData = await response.json();
        setMessage(`❌ Error: ${errorData.message || 'Failed to place order'}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <div className="page-header">
        <h1>Place Order</h1>
        <p>Welcome, {auth.customer?.name}! Order your favorite food</p>
      </div>

      <div className="order-container">
        <div className="form-section">
          <h2>Order Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="restaurantId">Select Restaurant *</label>
              <select
                id="restaurantId"
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a restaurant --</option>
                {restaurants.map(restaurant => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name} ({restaurant.cuisine})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="itemName">Item Name *</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g., Margherita Pizza"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryAddress">Delivery Address *</label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="Enter your delivery address"
                rows="3"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '⏳ Placing Order...' : '🛒 Place Order'}
            </button>
          </form>
        </div>

        <div className="state-display">
          <h2>Current Form State</h2>
          <div className="state-box">
            <p><strong>Selected Restaurant:</strong> {formData.restaurantId || 'None'}</p>
            <p><strong>Item Name:</strong> {formData.itemName || 'Not entered'}</p>
            <p><strong>Quantity:</strong> {formData.quantity}</p>
            <p><strong>Delivery Address:</strong> {formData.deliveryAddress || 'Not entered'}</p>
            <p><strong>Estimated Total:</strong> ${(formData.quantity * 12.99).toFixed(2)}</p>
          </div>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {submittedData && (
            <div className="submitted-order">
              <h3>Order Confirmation</h3>
              <p><strong>Order ID:</strong> {submittedData._id}</p>
              <p><strong>Status:</strong> {submittedData.status}</p>
              <p><strong>Total Amount:</strong> ${submittedData.totalAmount}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .order-page {
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

        .order-container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .form-section,
        .state-display {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-section h2,
        .state-display h2 {
          margin-top: 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #e55a2b;
        }

        .submit-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .state-box {
          background-color: #f9f9f9;
          padding: 1.5rem;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          margin-bottom: 1.5rem;
        }

        .state-box p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
          color: #555;
        }

        .message {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .submitted-order {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 1.5rem;
          border-radius: 4px;
          color: #155724;
        }

        .submitted-order h3 {
          margin-top: 0;
        }

        .submitted-order p {
          margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .order-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderPage;
