// src/components/InsuranceDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import VisitorCount from "./VisitorCount"; // import the visitor component

const InsuranceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // =================== Fetch Service ===================
  const fetchService = async () => {
    try {
      const res = await fetch(`https://insurances-lmy8.onrender.com/ourInsurancePolice/${id}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setService(data.service);
      } else {
        Swal.fire("Error", data.message || "Service not found", "error");
      }
    } catch (err) {
      console.error("Fetch service error:", err);
      Swal.fire("Error", "Server error", "error");
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  // =================== Handle Booking ===================
  const handleBookQuote = async () => {
    if (!user) {
      Swal.fire("Login Required", "Please log in to book a quote.", "warning");
      navigate("/login");
      return;
    }

    if (!service) {
      Swal.fire("Error", "Service details are missing.", "error");
      return;
    }

    const bookingData = {
      insuranceId: service._id,
      serviceName: service.serviceName,
      providerName: service.providerName,
      coverageAmount: service.coverageAmount,
      premium: service.premium,
      userName: user.displayName || "Anonymous",
      userEmail: user.email,
      userPhoto: user.photoURL || "",
      bookedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/bookInsurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire("✅ Success", "Quote booked successfully!", "success").then(
          () => {
            navigate("/quote-insurance"); // only redirect if save succeeded
          }
        );
      } else {
        Swal.fire("Error", data.message || "Booking failed", "error");
      }
    } catch (err) {
      console.error("Booking error:", err);
      Swal.fire("Error", "Server error. Please try again later.", "error");
    }
  };

  // =================== Loading ===================
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading service details...</p>
      </div>
    );
  }

  // =================== UI ===================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50 py-10 px-6 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
        {/* Banner */}
        <div className="relative">
          <img
            src={service.imageUrl || "https://via.placeholder.com/800x400"}
            alt={service.serviceName}
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end justify-between px-6 pb-4">
            <h2 className="text-3xl font-bold text-white">
              {service.serviceName}
            </h2>
            {/* Visitor Count */}
            <VisitorCount blogId={service._id} initialCount={service.views || 0} />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Provider */}
          <p className="text-lg font-semibold text-gray-800 mb-2">
            {service.providerName}
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {service.description}
          </p>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Coverage Amount</p>
              <p className="text-xl font-bold text-indigo-700">
                ${service.coverageAmount}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Premium</p>
              <p className="text-xl font-bold text-blue-700">
                ${service.premium}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm sm:col-span-2">
              <p className="text-sm text-gray-500">Contact</p>
              <p className="text-lg font-medium text-green-700">
                {service.contactEmail || "N/A"} / {service.contactNumber || "N/A"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Link
              to="/"
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              ← Back
            </Link>
            <button
              onClick={handleBookQuote}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              Book Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDetails;
