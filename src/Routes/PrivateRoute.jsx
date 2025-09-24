// File: src/components/PrivateRoute.jsx
import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Shield, AlertTriangle, RefreshCw, Home, Phone, Mail } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const MAIN_ADMIN_EMAIL = "jhadam904@gmail.com";

// ---------- Loading Component ----------
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
      <div className="mb-6 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin relative">
          <Shield className="absolute top-3 left-3 w-6 h-6 text-blue-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">SecureGuard Insurance</h2>
      <p className="text-gray-600 mb-4">Securing your account...</p>
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
      </div>
      <p className="text-sm text-gray-500 mt-4">Please wait while we verify your credentials</p>
    </div>
  </div>
);

// ---------- Error Component ----------
const ErrorComponent = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-lg mx-4">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
      <p className="text-gray-600 mb-6">We're having trouble connecting to your account</p>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-700 text-sm font-medium">Error Details:</p>
        <p className="text-red-600 text-sm mt-1">{error?.message || "An unexpected error occurred"}</p>
      </div>
      <div className="space-y-3">
        <button onClick={onRetry} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
        <button onClick={() => (window.location.href = "/")} className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
          <Home className="w-5 h-5" />
          <span>Return Home</span>
        </button>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Need immediate assistance?</p>
        <div className="flex justify-center space-x-6 text-sm">
          <a href="tel:1-800-SECURE" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
            <Phone className="w-4 h-4" /><span>1-800-SECURE</span>
          </a>
          <a href="mailto:support@secureguard.com" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
            <Mail className="w-4 h-4" /><span>Support</span>
          </a>
        </div>
      </div>
    </div>
  </div>
);

// ---------- PrivateRoute ----------
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, error, isAdmin, role } = useContext(AuthContext);
  const [retryKey, setRetryKey] = useState(0);

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} onRetry={() => setRetryKey(retryKey + 1)} />;
  if (!user) return <Navigate to="/login" replace />;

  // Main admin override
  if (user.email === MAIN_ADMIN_EMAIL || isAdmin) return children;

  // Role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default PrivateRoute;
