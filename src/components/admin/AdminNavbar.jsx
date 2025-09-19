// File: AdminNavbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const { pathname } = useLocation();

  // Format path to a readable title
  const formatPath = (path) => {
    if (path === "/") return "Home";
    return path
      .split("/")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" → ");
  };

  return (
    <nav className="fixed top-0 left-72 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-20">
      {/* Left: Home link */}
      <div>
        <Link to="/" className="text-blue-600 font-semibold hover:underline">
          Admin
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800 font-medium">{formatPath(pathname)}</span>
      </div>

      {/* Right: Optional placeholder for user */}
      <div className="text-gray-600 font-medium">
        <Link to="/" className="hover:underline">
          Home
          </Link>
        </div>
    </nav>
  );
};

export default AdminNavbar;
