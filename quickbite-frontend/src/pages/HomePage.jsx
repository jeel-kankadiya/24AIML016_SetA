import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { auth, login } = useAuth();

  const handleDemoLogin = () => {
    const demoCustomer = { id: '1', name: 'John Doe', email: 'john@example.com' };
    login(demoCustomer, 'demo-token-12345');
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>🍔 Welcome to QuickBite</h1>
        <p>Your favorite food delivery platform</p>
      </div>

      <div className="intro-section">
        <h2>Get Started</h2>
        {auth.token ? (
          <div className="logged-in-message">
            <p>Welcome, {auth.customer?.name}! 👋</p>
            <p>
              <Link to="/restaurants">Browse Restaurants</Link> or{' '}
              <Link to="/order">Place an Order</Link>
            </p>
          </div>
        ) : (
          <div className="login-section">
            <p>Click the button below to demo login and access the full platform.</p>
            <button className="demo-login-btn" onClick={handleDemoLogin}>
              Demo Login
            </button>
          </div>
        )}
      </div>

      <div className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🏪 Browse Restaurants</h3>
            <p>Explore restaurants by cuisine and ratings</p>
          </div>
          <div className="feature-card">
            <h3>🛒 Easy Ordering</h3>
            <p>Place orders securely with your address</p>
          </div>
          <div className="feature-card">
            <h3>📊 Track Orders</h3>
            <p>Real-time order status updates</p>
          </div>
          <div className="feature-card">
            <h3>⭐ Rate & Review</h3>
            <p>Share your experience with restaurants</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .hero {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(0, 0, 0, 0.2);
        }

        .hero h1 {
          margin: 0;
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .hero p {
          font-size: 1.3rem;
          margin: 0;
        }

        .intro-section {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 8px;
          color: #333;
          text-align: center;
        }

        .intro-section h2 {
          margin-top: 0;
          color: #667eea;
        }

        .logged-in-message p {
          margin: 1rem 0;
        }

        .logged-in-message a {
          color: #667eea;
          font-weight: bold;
          text-decoration: none;
        }

        .logged-in-message a:hover {
          text-decoration: underline;
        }

        .demo-login-btn {
          background-color: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .demo-login-btn:hover {
          background-color: #764ba2;
        }

        .features {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .features h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          color: #333;
        }

        .feature-card h3 {
          margin: 0 0 0.5rem 0;
          color: #667eea;
        }

        .feature-card p {
          margin: 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
