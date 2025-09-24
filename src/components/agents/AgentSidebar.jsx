// File: src/components/agents/AgentSidebar.jsx
import { useState, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaMoneyBill,
  FaChevronDown,
  FaCog,
  FaClipboardList,
  FaEnvelope,
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const AgentSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  const [openMenus, setOpenMenus] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (path) => {
    setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // ---------------- Agent Navigation Links ----------------
  const navLinks = useMemo(
    () => [
      {
        name: "Dashboard",
        path: "/agent",
        icon: FaHome,
        color: "from-blue-500 to-cyan-400",
        subLinks: [],
        roles: ["agent"],
      },
      {
        name: "All Policies",
        path: "/agent/policies",
        icon: FaClipboardList,
        color: "from-purple-500 to-pink-400",
        subLinks: [
          { name: "Add Policy", path: "/agent/policies/add" },
          { name: "Edit Policy", path: "/agent/policies/edit" },
        ],
        roles: ["agent"],
      },
      {
        name: "Blog Management",
        path: "/agent/agent-management-blog",
        icon: FaFileAlt,
        color: "from-rose-500 to-pink-400",
        subLinks: [
          { name: "Add Blog", path: "/agent/agent-management-blog/add" },
          { name: "Edit Blog", path: "/agent/agent-management-blog/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "Manage Blog",
        path: "/agent/agent-manage-blog",
        icon: FaFileAlt,
        color: "from-rose-500 to-pink-400",
        subLinks: [
          { name: "Add Blog", path: "/agent/agent-manage-blog/add" },
          { name: "Edit Blog", path: "/agent/agent-manage-blog/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "Users",
        path: "/agent/users",
        icon: FaUsers,
        color: "from-orange-500 to-red-400",
        subLinks: [],
        roles: ["agent"],
      },
      {
        name: "Messages",
        path: "/agent/messages",
        icon: FaEnvelope,
        color: "from-violet-500 to-purple-400",
        subLinks: [],
        roles: ["agent"],
      },
      {
        name: "Settings",
        path: "/agent/settings",
        icon: FaCog,
        color: "from-slate-500 to-gray-400",
        subLinks: [],
        roles: ["agent"],
      },
    ],
    []
  );

  const isLinkActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  const handleLinkClick = () => setIsMobileOpen(false);

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Agent User";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Agent Sidebar"
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
                  Agent Panel
                </h1>
                <p className="text-xs text-slate-400">Management Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 flex-1 overflow-y-auto space-y-1">
          {navLinks
            .filter((link) => link.roles.includes(user?.role))
            .map(({ name, path, icon: Icon, subLinks, color }) => {
              const isActive = isLinkActive(path);
              const isOpen = openMenus[path] || pathname.startsWith(path);

              return (
                <div key={name} className="group">
                  <button
                    onClick={() =>
                      subLinks.length > 0 ? toggleMenu(path) : handleLinkClick()
                    }
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${name}`}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? `bg-gradient-to-r ${color} shadow-lg text-white`
                        : "hover:bg-slate-800/50 hover:shadow-md text-slate-300 hover:text-white"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 shadow-inner"
                          : "bg-slate-700/50 group-hover:bg-slate-600/50"
                      }`}
                    >
                      <Icon className="text-base" />
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{name}</span>
                    )}
                    {!isCollapsed && subLinks.length > 0 && (
                      <FaChevronDown
                        className={`ml-auto transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
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
                            onClick={handleLinkClick}
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
                <p className="text-xs font-medium text-white">{displayName}</p>
                <p className="text-xs text-slate-400">
                  {user?.status || "Online"}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="absolute top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg shadow-lg lg:hidden"
        aria-expanded={isMobileOpen}
        aria-label="Toggle Mobile Sidebar"
      >
        <FaBars />
      </button>
    </div>
  );
};

export default AgentSidebar;
