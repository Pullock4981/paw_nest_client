import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, role } = useContext(AuthContext); // make sure 'role' is available
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (user && role === 'admin') return children;

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
