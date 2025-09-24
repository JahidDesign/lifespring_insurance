// File: src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

// ---------------- Navigation Links ----------------
const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "All Policies", path: "/all-policies" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "BookedQuote", path: "/mybook-quote" },
];

// Agent roles
const AGENT_ROLES = ["agent"];

// ---------------- NavLinks Component ----------------
const NavLinks = ({ closeMenu, location, bookedCount }) =>
  navLinks.map(({ name, path }) => {
    const isBookQuote = path === "/mybook-quote";
    const isActive = location.pathname === path;
    return (
      <Link
        key={name}
        to={path}
        onClick={closeMenu}
        className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
        }`}
      >
        <span className="relative z-10">{name}</span>
        {!isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        {isBookQuote && bookedCount > 0 && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg animate-pulse">
            {bookedCount}
          </span>
        )}
      </Link>
    );
  });

// ---------------- PanelLinks Component ----------------
const PanelLinks = ({ userRole }) => {
  if (userRole === "admin") {
    return (
      <Link
        to="/admin"
        className="px-4 py-2.5 rounded-xl transition-all duration-300 border flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50/80 border-orange-300/50 hover:border-orange-400/70"
      >
        <Shield className="w-4 h-4" />
        Admin Panel
      </Link>
    );
  }
  if (AGENT_ROLES.includes(userRole)) {
    return (
      <Link
        to="/agent"
        className="px-4 py-2.5 rounded-xl transition-all duration-300 border flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 border-blue-300/50 hover:border-blue-400/70"
      >
        <Shield className="w-4 h-4" />
        Agent Panel
      </Link>
    );
  }
  return null;
};

// ---------------- UserMenu Component ----------------
const UserMenu = ({ user, photoURL, displayName, userRole, isAdmin, isAgent, onClose, logout }) => (
  <div className="mt-4 border-t border-gray-200/50 pt-4 space-y-3">
    <div className="flex items-center gap-4 py-3 px-4 rounded-xl bg-gray-100/60 border border-gray-200/60">
      <div className="relative">
        <img
          src={photoURL}
          alt="avatar"
          className="w-14 h-14 rounded-xl object-cover border-2 border-gray-300/50"
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div>
        <div className="font-semibold text-gray-900 flex items-center gap-2">
          {displayName}
          {userRole && (
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                isAdmin
                  ? "bg-orange-200 text-orange-800"
                  : isAgent
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {userRole.toUpperCase()}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    </div>
    <Link
      to="/profile"
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-300 mx-2 rounded-xl"
    >
      <User className="w-4 h-4" />
      Profile Settings
    </Link>
    <Link
      to="/customer"
      className="px-3 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 mx-2 block text-center"
      onClick={onClose}
    >
      Customer Dashboard
    </Link>
    <button
      onClick={() => {
        logout();
        onClose();
      }}
      className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 mx-2"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  </div>
);

// ---------------- Navbar Component ----------------
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [bookedCount, setBookedCount] = useState(0);

  const displayName =
    user?.displayName || user?.name || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || user?.photo || "/default-avatar.png";
  const userRole = user?.role || "customer";

  const isAdmin = userRole === "admin";
  const isAgent = AGENT_ROLES.includes(userRole);

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
    if (!user) return;
    const fetchBookedCount = async () => {
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
    const interval = setInterval(fetchBookedCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <>
      <div className="h-20"></div>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-2xl shadow-xl border-b border-gray-200/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="insurancen.svg"
                alt="LifeSecure"
                className="w-36 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2 text-sm font-medium">
            <NavLinks location={location} bookedCount={bookedCount} />
            <PanelLinks userRole={userRole} />

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 pl-3 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-300 border border-gray-300/50 hover:border-gray-400/50 group"
                >
                  <span className="hidden xl:block text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {displayName}
                  </span>
                  <div className="relative">
                    <img
                      src={photoURL}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300/50 group-hover:border-blue-500/50 transition-all duration-300"
                    />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl py-3 z-50 border border-gray-200/50">
                    <UserMenu
                      user={user}
                      photoURL={photoURL}
                      displayName={displayName}
                      userRole={userRole}
                      isAdmin={isAdmin}
                      isAgent={isAgent}
                      onClose={() => setDropdownOpen(false)}
                      logout={logout}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-sm font-semibold hover:scale-105"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-3 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-300 border border-gray-300/50 hover:border-gray-400/50 group"
            onClick={() => setSideMenuOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors duration-300" />
          </button>
        </div>

        {/* Mobile Side Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-80 bg-white/95 backdrop-blur-2xl shadow-2xl z-50 transform transition-all duration-500 border-l border-gray-200/50 ${
            sideMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-6 border-b border-gray-200/50">
            <Link to="/" className="font-bold text-xl text-gray-900">
              LifeSecure
            </Link>
            <button
              onClick={() => setSideMenuOpen(false)}
              className="p-2 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-300 border border-gray-300/50"
            >
              <X className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors duration-300" />
            </button>
          </div>

          <div className="flex flex-col px-6 py-6 space-y-2 text-sm font-medium">
            <NavLinks location={location} bookedCount={bookedCount} closeMenu={() => setSideMenuOpen(false)} />
            <PanelLinks userRole={userRole} />
            {user ? (
              <UserMenu
                user={user}
                photoURL={photoURL}
                displayName={displayName}
                userRole={userRole}
                isAdmin={isAdmin}
                isAgent={isAgent}
                onClose={() => setSideMenuOpen(false)}
                logout={logout}
              />
            ) : (
              <div className="mt-8 border-t border-gray-200/50 pt-6">
                <Link
                  to="/login"
                  onClick={() => setSideMenuOpen(false)}
                  className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg text-center font-semibold hover:scale-105 transition-transform duration-300"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop overlay for mobile menu */}
        {sideMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSideMenuOpen(false)}
          ></div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
