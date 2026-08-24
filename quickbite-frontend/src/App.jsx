import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import OrderPage from './pages/OrderPage';
import ProtectedRoute from './components/ProtectedRoute';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading Admin Panel...</div>}>
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
