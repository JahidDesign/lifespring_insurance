import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import { Outlet, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user } = useContext(AuthContext);

  // Role check: only allow admin or agent
  if (!user || !["admin", "agent"].includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // redirect non-admin/agent users
  }

  return (
    <div className="flex">
      {/* Global Helmet for Admin Panel */}
      <Helmet>
        <title>Admin Dashboard | Smart Insurance</title>
        <meta
          name="description"
          content="Manage policies, users, and claims securely from the admin dashboard of Smart Insurance."
        />
        <meta
          name="keywords"
          content="admin, dashboard, smart insurance, management, policies, users, claims"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Helmet>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Navbar */}
        <AdminNavbar />

        {/* Main content with top padding for navbar */}
        <main className="pt-16 p-6 w-full min-h-screen bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
