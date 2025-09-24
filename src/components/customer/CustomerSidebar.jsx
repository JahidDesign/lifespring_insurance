import { useState, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaMoneyBill,
  FaClipboardList,
  FaCog,
  FaChevronDown,
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const CustomerSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Navigation links
  const navLinks = useMemo(
    () => [
      { name: "Dashboard", path: "/customer", icon: FaHome },
       { name: "Reviews Section", path: "/customer/reviews", icon: FaFileAlt },
      { name: "My Policies", path: "/customer/my-policies", icon: FaClipboardList },
      { name: "Payment Status", path: "/customer/payment-status", icon: FaMoneyBill },
      { name: "Payment Page", path: "/customer/payment-page", icon: FaMoneyBill },
      { name: "Claim Requests", path: "/customer/claims", icon: FaFileAlt },
      { name: "Settings", path: "/customer/settings", icon: FaCog },
    ],
    []
  );

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Customer";

  const isLinkActive = (path) => pathname.startsWith(path);

  return (
    <div className="flex h-screen">
      <aside
        className={`h-screen bg-slate-900 text-white fixed overflow-y-auto flex flex-col transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">Customer Panel</h1>
              <p className="text-xs text-slate-400">My Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-slate-800/50"
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-2 space-y-1">
          {navLinks.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-700 transition ${
                isLinkActive(path) ? "bg-slate-700" : "text-slate-300"
              }`}
            >
              <Icon />
              {!isCollapsed && <span>{name}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-700 mt-auto">
            <div className="flex items-center gap-3 bg-slate-800/50 rounded p-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                👤
              </div>
              <div>
                <p className="text-sm">{displayName}</p>
                <p className="text-xs text-slate-400">{user?.status || "Active"}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="absolute top-4 left-4 z-50 lg:hidden bg-slate-900 text-white p-2 rounded"
      >
        <FaBars />
      </button>
    </div>
  );
};

export default CustomerSidebar;
