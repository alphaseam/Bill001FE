import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        user: JSON.stringify(localStorage.getItem('user')) || null,

        //testing perpose
        // token: 'dummy_token',
        // user: { name: 'Demo User' },

    });

    // Login handler
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth({ token, user: userData });

    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ setAuth, auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
