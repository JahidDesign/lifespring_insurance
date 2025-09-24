// File: CustomerDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CustomerApplications from "./CustomerApplications";

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [time, setTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Dynamic greeting
  const hour = time.getHours();
  const greeting =
    hour < 12 ? "Good Morning" :
    hour < 18 ? "Good Afternoon" :
    "Good Evening";

  return (
    <div className="mt-24 p-6 w-full min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="mb-8 ml-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.displayName || user?.name || "User"}!
        </h1>
        <p className="text-gray-600 mt-1">
          This is your Customer Dashboard. Manage your policies, bookings, and activities below.
        </p>
      </header>

      {/* Dashboard Widgets / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Applications */}
        <div className="bg-white shadow-lg rounded-2xl p-6 min-h-[70vh]">
          <CustomerApplications />
        </div>

        {/* Additional Section: Service & Clock */}
        <div className="bg-white shadow-lg rounded-2xl p-6 min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-gray-800">
          <h2 className="text-2xl font-semibold">{greeting}, {user?.displayName || user?.name || "User"}!</h2>
          <div className="text-xl font-mono bg-gray-100 px-4 py-2 rounded shadow">
            {formattedTime}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">Service Hours</h3>
            <p>Mon - Sun: 9:00 AM - 6:00 PM</p>
            <p>Sat: 10:00 AM - 2:00 PM</p>
            <p>Fri: Closed</p>
          </div>
        </div>
      </div>

      {/* Main Content / Nested Routes */}
      <main className="mt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerDashboard;
