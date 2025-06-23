import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';

const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();

    const isTokenValid = () => {
        if (!auth.token) return false;
    };

    const isAuthenticated = !!auth.token && isTokenValid();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return auth.token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
