<<<<<<< HEAD
import React, { createContext, useState, useEffect } from 'react';
=======
import React, { createContext, useState, useEffect } from "react";
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
<<<<<<< HEAD
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || sessionStorage.getItem('token'),
        user: localStorage.getItem('user') || sessionStorage.getItem('user'),

    });

    // Login handler
    const login = (token, userData) => {
        localStorage.setItem('token', JSON.stringify(token)) || sessionStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('user', JSON.stringify(userData)) || sessionStorage.setItem('user', JSON.stringify(userData));
        setAuth({ token, user: userData });

    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem('token') || sessionStorage.removeItem('token');
        localStorage.removeItem('user') || sessionStorage.removeItem('user');
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ setAuth, auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
=======
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || sessionStorage.getItem("token"),
    user: localStorage.getItem("user") || sessionStorage.getItem("user"),
  });

  // Login handler
  const login = (token, userData) => {
    localStorage.setItem("token", JSON.stringify(token)) ||
      sessionStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(userData)) ||
      sessionStorage.setItem("user", JSON.stringify(userData));
    setAuth({ token, user: userData });
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token") || sessionStorage.removeItem("token");
    localStorage.removeItem("user") || sessionStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ setAuth, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
};

export { AuthContext, AuthProvider };
