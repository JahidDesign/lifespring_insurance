// File: src/components/agents/AgentLayout.jsx
import { Outlet } from "react-router-dom";
import AgentSidebar from "./AgentSidebar";
import AgentNavbar from "./AgentNavbar";

const AgentLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r hidden md:flex flex-col">
        <AgentSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="sticky top-0 z-20 bg-white shadow-sm border-b">
          <AgentNavbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;
