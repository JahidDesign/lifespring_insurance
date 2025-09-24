// File: src/components/CustomerNavbar.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

const CustomerNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
 const displayName =
    user?.displayName || user?.name || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || user?.photo || "/default-avatar.png";
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="insurancen.svg"
          alt="Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h1 className="text-2xl font-bold text-blue-600">Smart Insurance</h1>
      </Link>

      {/* User Info */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 focus:outline-none"
        >
          {user?.photoURL ? (
            <img
              src={photoURL}
              alt={user.displayName || user.email}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-semibold text-lg shadow-md border-2 border-blue-500">
              {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div className="hidden md:flex flex-col text-left">
            <span className="font-medium text-gray-800">{displayName}</span>
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-all rounded-t-lg"
              onClick={() => setDropdownOpen(false)}
            >
              <User className="w-5 h-5" /> Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 hover:bg-blue-100 transition-all"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings className="w-5 h-5" /> Settings
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-500 hover:text-white transition-all rounded-b-lg"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavbar;
