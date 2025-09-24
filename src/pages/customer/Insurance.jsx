// File: Insurance.jsx
import React, { useContext } from "react";
import QuoteLifeInsuranceForm from "./InsuranceForm.jsx";
import ClaimRequest from "./ClaimRequest.jsx";
import { AuthContext } from "../../context/AuthContext";

export default function Insurance() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-12">
      {/* Greeting Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Hello {user?.displayName || "Valued Customer"} 
        </h1>
        <p className="text-lg text-white/80">
          Welcome! Please fill out your insurance details below and manage your claims.
        </p>
      </div>

      {/* Insurance Quote Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">📝 Request a Life Insurance Quote</h2>
        <QuoteLifeInsuranceForm />
      </div>

      {/* Claim Requests */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">📄 Your Claim Requests</h2>
        <ClaimRequest />
      </div>

      {/* Optional: Download Documents */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Download Documents</h2>
        <p className="text-gray-600">
          You can download your policy documents and claim receipts here.
        </p>
      </div>
    </div>
  );
}
