// File: src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedRoute component
 * - Redirects to /login if user is not authenticated
 * - Optionally restricts access to admin users only
 *
 * @param {ReactNode} children - Components to render if allowed
 * @param {boolean} adminOnly - Set true to restrict to admin users
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, isAdmin } = useContext(AuthContext);

  // Show loading state while checking auth
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if admin only route but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render child components if all checks pass
  return children;
};

export default ProtectedRoute;
