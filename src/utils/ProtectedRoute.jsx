import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const IsLoggedIn = localStorage.getItem("IsLoggedIn");
  return IsLoggedIn === "true" ? children : <Navigate to="/home" />;
};

export default ProtectedRoute;
