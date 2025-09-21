// File: InsuranceCards.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { HeartIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function InsuranceCards() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchApplications = async () => {
      try {
        const { data } = await axios.get("https://insurances-lmy8.onrender.com/management");
        // Filter by logged-in user's email
        const userApps = data.filter(app => app.email === user.email);
        setApplications(userApps);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        Swal.fire({
          icon: "error",
          title: "❌ Failed to Load Applications",
          text: "Could not fetch your insurance applications. Please try again.",
        });
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.email]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading your applications...</p>;
  }

  if (applications.length === 0) {
    return <p className="text-center mt-10 text-gray-500">You have no insurance applications yet.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((app) => (
        <div
          key={app._id}
          className="border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{app.insuranceType?.toUpperCase() || "Insurance"}</h2>
            <HeartIcon className="w-6 h-6 text-red-500" />
          </div>
          <p><strong>Name:</strong> {app.name}</p>
          <p><strong>Email:</strong> {app.email}</p>
          <p><strong>Coverage:</strong> ${app.coverage}</p>
          <p><strong>Payment Term:</strong> {app.paymentTerm || "N/A"}</p>
          <p><strong>Status:</strong> {app.status || "Pending"}</p>
          {app.nomineeName && <p><strong>Nominee:</strong> {app.nomineeName} ({app.nomineeRelation || "Relation N/A"})</p>}
          {app.healthCondition && <p><strong>Health Condition:</strong> {app.healthCondition}</p>}
          {app.vehicleType && <p><strong>Vehicle:</strong> {app.vehicleType}</p>}
          {app.propertyType && <p><strong>Property:</strong> {app.propertyType}</p>}
          {app.image && (
            <img
              src={app.image}
              alt={app.name}
              className="mt-4 w-full h-48 object-cover rounded-lg"
            />
          )}
          <div className="mt-4 flex items-center gap-2 text-gray-500">
            <ClipboardDocumentListIcon className="w-5 h-5" />
            <span>Application ID: {app._id}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
