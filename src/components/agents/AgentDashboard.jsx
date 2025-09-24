import React from "react";
import { Outlet } from "react-router-dom";
import PaymentsDashboard from "../../pages/PaymentsDashboard";
import AdminPaymentsTable from '../../components/AdminPaymentsTable';
import AgentApplicationsIns from '../../../src/pages/Applications/AgentApplicationsIns';
const AgentDashboard = () => {
  return (
    <div className="mt-10 p-6 w-full min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className=" ml-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Agent Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Manage policies, clients, and activities below.
        </p>
      </header>
       <div className="bg-white  shadow p-6 min-h-[70vh]">
        <AdminPaymentsTable/>
       </div>
       <div className="bg-white  shadow p-6 min-h-[70vh]">
        <AgentApplicationsIns/>
       </div>
       <div className="bg-white  shadow p-6 min-h-[70vh]">
        <PaymentsDashboard/>
       </div>
      {/* Main Content */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentDashboard;
