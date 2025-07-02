import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),

  });

  // Login handler
  const login = (token, userData) => {
    localStorage.setItem('token', JSON.stringify(token)) || sessionStorage.setItem('token', JSON.stringify(token));
    setAuth({ token });

  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token') || sessionStorage.removeItem('token');

    setAuth({ token: null });
  };

  return (
    <AuthContext.Provider value={{ setAuth, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
