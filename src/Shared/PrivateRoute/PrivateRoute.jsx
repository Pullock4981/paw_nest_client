import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return <Navigate to="/logIn" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
