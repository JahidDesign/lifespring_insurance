import React, { Component } from 'react';
import { Outlet } from "react-router-dom";

const ManagementPage = () => {
  return (
    <div className="flex">
      <main className="ml-64 p-6 w-full min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagementPage;
