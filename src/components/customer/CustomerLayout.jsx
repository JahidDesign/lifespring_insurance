// File: src/components/layouts/CustomLayout.jsx
import Sidebar from "./CustomerSidebar";
import CustomerNavbar from "./CustomerNavbar";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CustomLayout = () => {
  return (
    <div className="flex">
      {/* Global Helmet */}
      <Helmet>
        <title>Dashboard | Smart Insurance</title>
        <meta
          name="description"
          content="Smart Insurance dashboard for managing data, content, and settings."
        />
        <meta
          name="keywords"
          content="dashboard, smart insurance, management"
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
        <CustomerNavbar />
        
        {/* Page Content */}
        <main className="pt-16 p-6 w-full min-h-screen bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomLayout;
