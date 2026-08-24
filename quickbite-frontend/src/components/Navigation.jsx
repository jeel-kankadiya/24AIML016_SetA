import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { auth, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍔 QuickBite
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/restaurants">Restaurants</Link>
          </li>
          {auth.token ? (
            <>
              <li>
                <Link to="/order">Place Order</Link>
              </li>
              <li>
                <Link to="/admin">Admin Panel</Link>
              </li>
              <li>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <span className="auth-status">Not logged in</span>
            </li>
          )}
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          background-color: #ff6b35;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .nav-links a:hover {
          opacity: 0.8;
        }

        .logout-btn {
          background-color: #d43f3a;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .logout-btn:hover {
          background-color: #ac2925;
        }

        .auth-status {
          color: #fff;
          font-size: 0.9rem;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
