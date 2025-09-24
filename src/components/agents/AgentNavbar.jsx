// File: src/components/AgentNavbar.jsx
import React, { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bell, ChevronDown, Search, Settings, Home } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

// --- Notifications Dropdown ---
const NotificationsDropdown = ({ notifications, onClose }) => {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="absolute right-0 mt-2 w-[17.5rem] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 py-1 z-50 overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100/50 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
          {unreadCount} new
        </span>
      </div>

      <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-lg ${
              n.unread ? "bg-blue-50/50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <p className={`text-sm ${n.unread ? "font-medium text-gray-900" : "text-gray-700"}`}>
              {n.text}
            </p>
            <p className="text-xs text-gray-500 mt-1">{n.time}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-gray-100/50 text-right">
        <button
          onClick={onClose}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
        >
          View all →
        </button>
      </div>
    </div>
  );
};

// --- Profile Dropdown ---
const ProfileDropdown = ({ user, logout, onClose }) => {
  const photoURL = user?.photoURL || user?.photo || "/default-avatar.png";
 const displayName =
    user?.displayName || user?.name || user?.email?.split("@")[0] || "User";
  return (
    <div className="absolute right-0 mt-2 w-[17.5rem] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 py-1 z-50 overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100/50 flex items-center space-x-3">
        <img
          src={photoURL}
          alt="Agent"
          className="w-12 h-12 rounded-2xl object-cover shadow-md ring-2 ring-white/50"
        />
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-600">{user.email}</p>
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mt-1 shadow-sm">
            ✨ AGENT
          </span>
        </div>
      </div>

      <Link to="/agent/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all">
        Profile Settings
      </Link>
      <Link to="/agent/settings" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all">
        Preferences
      </Link>
      <button
        onClick={logout}
        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all"
      >
        Sign Out
      </button>
    </div>
  );
};

// --- Main Navbar ---
const AgentNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "New client booking", time: "5 min ago", unread: true },
    { id: 2, text: "Policy updated", time: "30 min ago", unread: false },
    { id: 3, text: "Monthly report ready", time: "2 hours ago", unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Breadcrumb segments
  const formatPathSegments = (path) => {
    const segments = path.replace(/^\/agent/, '').split("/").filter(Boolean);
    return [{ name: "Home", path: "/" }, ...segments.map((seg, idx) => ({
      name: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/[-_]/g, " "),
      path: "/agent/" + segments.slice(0, idx + 1).join("/"),
    }))];
  };
  const pathSegments = formatPathSegments(pathname);

  return (
    <div className="relative">
      <nav className="h-18 bg-white/90 backdrop-blur-2xl border-b border-gray-200/30 flex items-center justify-between px-8 shadow-xl fixed top-0 left-0 right-0 z-50">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 flex-wrap">
          {pathSegments.map((segment, idx) => (
            <React.Fragment key={idx}>
              {idx !== 0 && <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-1" />}
              <button
                onClick={() => navigate(segment.path)}
                className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-2xl border transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-105 ${
                  idx === 0
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-none shadow-lg animate-gradient-slide"
                    : "text-gray-700 bg-white/70 border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200"
                }`}
              >
                {idx === 0 && <Home className="w-4 h-4" />}
                <span>{segment.name}</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-12 pr-6 py-3 bg-white/70 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 hover:bg-white/90 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">

          {/* Settings */}
          <button className="relative p-3 rounded-2xl bg-white/70 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200/50 transition-all duration-300 group shadow-sm hover:shadow-md transform hover:scale-110">
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:rotate-180 transition-all duration-500" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-2xl bg-white/70 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200/50 transition-all duration-300 group shadow-sm hover:shadow-md transform hover:scale-110"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                  <span className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full animate-bounce shadow-lg ring-2 ring-white">
                    {unreadCount}
                  </span>
                  <span className="absolute w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-20" />
                </div>
              )}
            </button>
            {showNotifications && (
              <NotificationsDropdown
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          {/* Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-white/70 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200/50 transition-all duration-300 group shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt="Agent"
                    className="w-10 h-8 rounded-2xl object-cover ring-2 ring-white/50 group-hover:ring-blue-300 transition-all duration-300 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-3 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-blue-800 transition-colors">{displayName}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mt-0.5 shadow-sm">
                    ✨ AGENT
                  </span>
                </div>
                <ChevronDown className={`w-4 h-3 text-gray-500 group-hover:text-blue-600 transition-all duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showProfileDropdown && (
                <ProfileDropdown
                  user={user}
                  logout={logout}
                  onClose={() => setShowProfileDropdown(false)}
                />
              )}
            </div>
          )}
        </div>

        {/* Overlay */}
        {(showProfileDropdown || showNotifications) && (
          <div
            className="fixed inset-0 z-10 backdrop-blur-sm bg-black/5"
            onClick={() => {
              setShowProfileDropdown(false);
              setShowNotifications(false);
            }}
          />
        )}
      </nav>

      {/* Tailwind Animations & Scrollbar */}
      <style>
        {`
          @keyframes gradient-slide {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-slide { background-size: 400% 400%; animation: gradient-slide 4s ease infinite; }

          .scrollbar-thin::-webkit-scrollbar { width: 6px; }
          .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
          .scrollbar-thin::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #3b82f6, #8b5cf6); border-radius: 9999px; }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #2563eb, #7c3aed); }
        `}
      </style>
    </div>
  );
};

export default AgentNavbar;
