import React from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;