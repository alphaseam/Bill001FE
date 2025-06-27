import React, { useContext } from 'react';
import { Navigate, } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';



const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.token) {
        <Navigate to={'/login'} />
    }
    return auth.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
