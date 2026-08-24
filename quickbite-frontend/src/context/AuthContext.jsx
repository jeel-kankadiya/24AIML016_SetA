import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    customer: null,
    token: null
  });

  const login = (customer, token) => {
    setAuth({ customer, token });
    localStorage.setItem('authToken', token);
    localStorage.setItem('customer', JSON.stringify(customer));
  };

  const logout = () => {
    setAuth({ customer: null, token: null });
    localStorage.removeItem('authToken');
    localStorage.removeItem('customer');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
