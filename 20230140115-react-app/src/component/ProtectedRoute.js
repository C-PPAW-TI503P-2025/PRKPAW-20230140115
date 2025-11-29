import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        return <Navigate to="/dashboard" />;
      }
    } catch (error) {
      return <Navigate to="/login" />;
    }
  }

  return children;
}

export default ProtectedRoute;
