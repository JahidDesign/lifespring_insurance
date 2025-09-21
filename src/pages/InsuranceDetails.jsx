// src/components/InsuranceDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react"; // Optional: icon for back button

const InsuranceDetails = ({ onBookingSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ==================== STATE ====================
  const [service, setService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // ==================== FETCH SERVICE ====================
  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://insurances-lmy8.onrender.com/ourInsurancePolice/${id}`
        );
        const data = await res.json();

        if (res.ok && (data.success || data._id || data.service)) {
          setService(data.service || data);
        } else {
          Swal.fire("Error", data.message || "Service not found", "error");
        }
      } catch (err) {
        console.error("Fetch service error:", err);
        Swal.fire("Error", "Server error while fetching service", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // ==================== OPEN MODAL ====================
  const openModal = () => {
    if (!user) {
      Swal.fire("Login Required", "Please log in to book a quote.", "warning");
      return;
    }
    setEditName(user.displayName || "");
    setEditEmail(user.email || "");
    setIsModalOpen(true);
  };

  // ==================== HANDLE BOOKING ====================
  const handleBookQuote = async (e) => {
    e.preventDefault();
    if (!service) return;

    const bookingData = {
      insuranceId: service._id,
      serviceName: service.serviceName || "",
      providerName: service.providerName || "",
      coverageAmount: service.coverageAmount || "",
      premium: service.premium || "",
      contactEmail: service.contactEmail || "",
      contactNumber: service.contactNumber || "",
      imageUrl: service.imageUrl || "",
      description: service.description || "",
      userId: user?.uid || "",
      userName: editName,
      userEmail: editEmail,
      userPhoto: user?.photoURL || "",
      bookedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        "https://insurances-lmy8.onrender.com/bookInsurance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        }
      );
      const data = await res.json();

      if (res.ok && (data.success || data.insertedId)) {
        await Swal.fire({
          title: "Booking Confirmed 🎉",
          html: `
            <div style="text-align:left">
              <p><b>Service:</b> ${bookingData.serviceName}</p>
              <p><b>Provider:</b> ${bookingData.providerName}</p>
              <p><b>Coverage:</b> $${bookingData.coverageAmount}</p>
              <p><b>Premium:</b> $${bookingData.premium}</p>
              <hr/>
              <p><b>User:</b> ${bookingData.userName}</p>
              <p><b>Email:</b> ${bookingData.userEmail}</p>
              <p><b>Booked At:</b> ${new Date(
                bookingData.bookedAt
              ).toLocaleString()}</p>
            </div>
          `,
          imageUrl: bookingData.userPhoto || bookingData.imageUrl,
          imageWidth: 100,
          imageHeight: 100,
          confirmButtonText: "OK",
        });

        setIsModalOpen(false);
        navigate("/all-policies"); 
        if (onBookingSuccess) onBookingSuccess(bookingData);
      } else {
        Swal.fire("Error", data.message || "Booking failed", "error");
      }
    } catch (err) {
      console.error("Booking error:", err);
      Swal.fire("Error", "Server error. Please try again later.", "error");
    }
  };

  // ==================== LOADING UI ====================
  if (loading || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading service details...</p>
      </div>
    );
  }

  // ==================== MAIN UI ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50 py-10 px-6 flex justify-center items-start">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-700 font-semibold"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Banner Image */}
          <div className="relative">
            <img
              src={service.imageUrl || "https://via.placeholder.com/800x400"}
              alt={service.serviceName}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end px-6 pb-4">
              <h2 className="text-3xl font-bold text-white">
                {service.serviceName}
              </h2>
            </div>
          </div>

          {/* Service Content */}
          <div className="p-8">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {service.providerName}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {service.description}
            </p>

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
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={openModal}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Book Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
          <form
            onSubmit={handleBookQuote}
            className="bg-white rounded-xl p-8 w-full max-w-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Confirm Booking
            </h2>

            <div className="mb-4 flex justify-center">
              <img
                src={service.imageUrl || "https://via.placeholder.com/300x150"}
                alt={service.serviceName}
                className="w-full max-w-xs object-cover rounded-lg shadow"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg mb-4">
              <p>
                <span className="font-medium">Insurance ID:</span> {service._id}
              </p>
              <p>
                <span className="font-medium">Service:</span> {service.serviceName}
              </p>
              <p>
                <span className="font-medium">Provider:</span> {service.providerName}
              </p>
              <p>
                <span className="font-medium">Coverage:</span> ${service.coverageAmount}
              </p>
              <p>
                <span className="font-medium">Premium:</span> ${service.premium}
              </p>
              <p>
                <span className="font-medium">Contact Email:</span> {service.contactEmail || "N/A"}
              </p>
              <p>
                <span className="font-medium">Contact Number:</span> {service.contactNumber || "N/A"}
              </p>
              <p>
                <span className="font-medium">Description:</span> {service.description || "N/A"}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-medium">User:</span>
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-10 h-10 rounded-full border"
                  />
                )}
                <span>{editName} ({editEmail})</span>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InsuranceDetails;
