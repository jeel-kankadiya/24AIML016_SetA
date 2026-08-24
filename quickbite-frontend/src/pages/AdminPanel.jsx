import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/v1/orders', {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.data || []);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.token]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const statusColors = {
    pending: '#ffc107',
    preparing: '#17a2b8',
    'out-for-delivery': '#007bff',
    delivered: '#28a745',
    cancelled: '#dc3545'
  };

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all orders in the system</p>
      </div>

      <div className="panel-content">
        {loading && (
          <div className="loading">
            <p>⏳ Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ Error: {error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="no-data">
            <p>No orders found in the system yet.</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-table">
            <h2>All Orders ({orders.length})</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td className="mono">{order._id.substring(0, 8)}...</td>
                      <td>{order.customerId?.name || 'Unknown'}</td>
                      <td>{order.restaurantId?.name || 'Unknown'}</td>
                      <td>
                        {order.items?.map(item => `${item.name} x${item.quantity}`).join(', ') ||
                          'N/A'}
                      </td>
                      <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: statusColors[order.status] }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className="status-select"
                        >
                          <option value="pending">pending</option>
                          <option value="preparing">preparing</option>
                          <option value="out-for-delivery">out-for-delivery</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-panel {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 2rem;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 8px;
        }

        .panel-header h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 2.5rem;
        }

        .panel-header p {
          margin: 0;
          color: #666;
          font-size: 1.1rem;
        }

        .panel-content {
          max-width: 1400px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .loading,
        .error,
        .no-data {
          text-align: center;
          padding: 2rem;
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
          color: #721c24;
        }

        .error p {
          margin: 0;
        }

        .no-data p {
          color: #666;
          margin: 0;
          font-size: 1rem;
        }

        .orders-table h2 {
          margin-top: 0;
          color: #333;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        thead {
          background-color: #f0f0f0;
          border-bottom: 2px solid #ddd;
        }

        th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #333;
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          color: #555;
        }

        tbody tr:hover {
          background-color: #f9f9f9;
        }

        .mono {
          font-family: monospace;
          font-size: 0.9rem;
          color: #666;
        }

        .status-badge {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .status-select {
          padding: 0.4rem 0.6rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.95rem;
          cursor: pointer;
          background-color: white;
        }

        .status-select:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
