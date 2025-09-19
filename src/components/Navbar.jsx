// File: src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "All Policies", path: "/all-policies" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "BookedQuote", path: "/mybook-quote" },
];

const Navbar = () => {
  const { user, logout, role } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [bookedCount, setBookedCount] = useState(0);

  const isAdmin = role === "admin";
  const displayName =
    user?.displayName || user?.name || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || user?.photo || "/default-avatar.png";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch booked quotes count
  useEffect(() => {
    const fetchBookedCount = async () => {
      if (!user) return setBookedCount(0);

      try {
        const res = await fetch(
          `https://insurances-lmy8.onrender.com/bookInsurance?email=${user.email}`
        );
        const data = await res.json();
        setBookedCount(data.length);
      } catch (error) {
        console.error("Failed to fetch booked quotes:", error);
      }
    };

    fetchBookedCount();
  }, [user]);

  return (
    <>
      <div className="h-20"></div>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20"
            : "bg-white/50 backdrop-blur-xl shadow-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="insurancen.svg"
              alt="LifeSecure"
              className="w-36 h-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 text-sm font-medium">
            {navLinks.map(({ name, path }) => {
              const isBookQuote = path === "/mybook-quote";
              return (
                <Link
                  key={name}
                  to={path}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-500 ${
                    location.pathname === path
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {name}
                  {isBookQuote && bookedCount > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                      {bookedCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                Admin Panel
              </Link>
            )}

            {/* Profile */}
            {user ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <img
                    src={photoURL}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="hidden xl:block text-gray-800">{displayName}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl py-2 z-50">
                    <div className="px-4 py-2 border-b flex items-center gap-3">
                      <img
                        src={photoURL}
                        alt="avatar"
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{displayName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-sm"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => setSideMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Side Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-xl z-50 transform transition-transform duration-500 ${
            sideMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <Link to="/" className="font-bold text-lg">
              LifeSecure
            </Link>
            <button onClick={() => setSideMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col px-6 py-4 space-y-3 text-sm font-medium">
            {navLinks.map(({ name, path }) => {
              const isBookQuote = path === "/mybook-quote";
              return (
                <Link
                  key={name}
                  to={path}
                  onClick={() => setSideMenuOpen(false)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === path
                      ? "bg-blue-500 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {name}
                  {isBookQuote && bookedCount > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                      {bookedCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setSideMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                Admin Panel
              </Link>
            )}

            {user && (
              <div className="mt-6 border-t pt-4 space-y-3">
                <div className="flex items-center gap-3 py-2">
                  <img
                    src={photoURL}
                    alt="avatar"
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{displayName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setSideMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setSideMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
