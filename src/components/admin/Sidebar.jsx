// File: src/components/admin/Sidebar.jsx
import { useState, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaMoneyBill,
  FaChevronDown,
  FaEye,
  FaCog,
  FaClipboardList,
  FaNewspaper,
  FaUserCheck,
  FaEnvelope,
  FaStar,
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  const [openMenus, setOpenMenus] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (path) => {
    setOpenMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // ---------------- Nav Links Config ----------------
  const navLinks = useMemo(() => [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FaHome,
      color: "from-blue-500 to-cyan-400",
      subLinks: [],
    },
    {
      name: "All Policies",
      path: "/admin/all-policies",
      icon: FaClipboardList,
      color: "from-purple-500 to-pink-400",
      subLinks: [
        { name: "Add OurInsurance", path: "/admin/all-policies/add" },
        { name: "Edit OurInsurance", path: "/admin/all-policies/edit" },
      ],
    },
    {
      name: "Carousel",
      path: "/admin/manage-policies",
      icon: FaFileAlt,
      color: "from-green-500 to-emerald-400",
      subLinks: [
        { name: "Add Carousel", path: "/admin/manage-policies/add" },
        { name: "Edit Carousel", path: "/admin/manage-policies/edit" },
      ],
    },
    {
      name: "Hero Carousel",
      path: "/admin/hero-section",
      icon: FaFileAlt,
      color: "from-teal-500 to-emerald-400",
      subLinks: [
        { name: "Add Hero", path: "/admin/hero-section/add" },
        { name: "Edit Hero", path: "/admin/hero-section/edit" },
      ],
    },
    {
      name: "Policies",
      path: "/admin/policies",
      icon: FaFileAlt,
      color: "from-green-500 to-emerald-400",
      subLinks: [
        { name: "Add Policy", path: "/admin/policies/add" },
        { name: "Edit Policy", path: "/admin/policies/edit" },
      ],
    },
    {
      name: "Manage Users",
      path: "/admin/manage-users",
      icon: FaUsers,
      color: "from-orange-500 to-red-400",
      subLinks: [
        { name: "Add User", path: "/admin/manage-users/add" },
        { name: "Edit User", path: "/admin/manage-users/edit" },
      ],
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: FaMoneyBill,
      color: "from-yellow-500 to-amber-400",
      subLinks: [],
    },
    {
      name: "Insurance",
      path: "/admin/insurance",
      icon: FaUserCheck,
      color: "from-teal-500 to-cyan-400",
      subLinks: [
        { name: "Add Insurance", path: "/admin/insurance-policies/add" },
        { name: "Edit Insurance", path: "/admin/insurance-policies/edit" },
      ],
    },
    {
      name: "Manage Blog",
      path: "/admin/manage-blog",
      icon: FaFileAlt,
      color: "from-rose-500 to-pink-400",
      subLinks: [
        { name: "Add Blog", path: "/admin/manage-blog/add" },
        { name: "Edit Blog", path: "/admin/manage-blog/edit" },
      ],
    },
    {
      name: "Visitor Posts",
      path: "/admin/visitor-news",
      icon: FaNewspaper,
      color: "from-violet-500 to-purple-400",
      subLinks: [
        { name: "Add News", path: "/admin/visitor-news/add" },
        { name: "Edit News", path: "/admin/visitor-news/edit" },
      ],
    },
    {
      name: "Reviews Section",
      path: "/admin/reviews-section",
      icon: FaStar,
      color: "from-violet-500 to-purple-400",
      subLinks: [
        { name: "Add Review", path: "/admin/reviews-section/add" },
        { name: "Edit Review", path: "/admin/reviews-section/edit" },
      ],
    },
    {
      name: "Messages Section",
      path: "/admin/messages-section",
      icon: FaEnvelope,
      color: "from-violet-500 to-purple-400",
      subLinks: [
        { name: "Messages", path: "/admin/messages-section/add" },
        { name: "Solve Messages", path: "/admin/messages-section/edit" },
      ],
    },
    {
      name: "View Pages",
      path: "/",
      icon: FaEye,
      color: "from-slate-500 to-gray-400",
      subLinks: [],
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: FaCog,
      color: "from-slate-500 to-gray-400",
      subLinks: [],
    },
  ], []);

  // ---------------- Helpers ----------------
  const isLinkActive = (path) => pathname === path || pathname.startsWith(path + "/");

  // ---------------- Render ----------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`h-screen bg-slate-900 text-white fixed overflow-y-auto shadow-2xl flex flex-col transition-all duration-300
        ${isCollapsed ? "w-20" : "w-72"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-72"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between gap-3">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-slate-400">Management Dashboard</p>
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 flex-1 overflow-y-auto space-y-1">
          {navLinks.map(({ name, path, icon: Icon, subLinks, color }) => {
            const isActive = isLinkActive(path);
            const isOpen = openMenus[path] || subLinks.some(sub => pathname === sub.path);

            return (
              <div key={name} className="group">
                <button
                  onClick={() => toggleMenu(path)}
                  aria-expanded={isOpen}
                  aria-controls={`submenu-${name}`}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                    isActive
                      ? `bg-gradient-to-r ${color} shadow-lg text-white`
                      : "hover:bg-slate-800/50 hover:shadow-md text-slate-300 hover:text-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive ? "bg-white/20 shadow-inner" : "bg-slate-700/50 group-hover:bg-slate-600/50"
                  }`}>
                    <Icon className="text-base" />
                  </div>
                  {!isCollapsed && <span className="font-medium text-sm">{name}</span>}
                  {!isCollapsed && subLinks.length > 0 && (
                    <FaChevronDown className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </button>

                {/* Submenu */}
                {!isCollapsed && subLinks.length > 0 && (
                  <div
                    id={`submenu-${name}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-6 space-y-1 border-l-2 border-slate-700/50 pl-2">
                      {subLinks.map((sub, index) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`block text-sm px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                            pathname === sub.path
                              ? `bg-gradient-to-r ${color} shadow-md text-white`
                              : "text-slate-400 hover:text-white hover:bg-slate-800/40 hover:shadow-sm"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 bg-gradient-to-t from-slate-900 to-transparent">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 flex items-center gap-3 hover:bg-slate-700/60 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white">{user?.name || "Admin User"}</p>
                <p className="text-xs text-slate-400">{user?.status || "Online"}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="absolute top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg shadow-lg lg:hidden"
      >
        <FaBars />
      </button>
    </div>
  );
};

export default Sidebar;
