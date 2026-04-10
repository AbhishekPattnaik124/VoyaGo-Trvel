import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if user is authenticated (token exists)
    const isAuthenticated = localStorage.getItem('authToken');

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Navigate to="/" replace />;
    }

    // If authenticated, render the child components (the protected route)
    return children;
};

export default ProtectedRoute;
