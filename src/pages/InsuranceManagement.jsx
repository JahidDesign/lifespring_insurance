// src/InsuranceManagement.jsx
import React, { useEffect, useState } from "react";

const InsuranceManagement = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // ---------------------------
  // Fake admin login
  // ---------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminEmail.trim()) setIsLoggedIn(true);
  };

  // ---------------------------
  // Fetch insurance data
  // ---------------------------
  const fetchInsuranceData = async () => {
    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/management");
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
      setFiltered(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchInsuranceData();
  }, [isLoggedIn]);

  // ---------------------------
  // Filter by email
  // ---------------------------
  useEffect(() => {
    if (searchEmail.trim() === "") setFiltered(data);
    else
      setFiltered(
        data.filter((item) =>
          item.email.toLowerCase().includes(searchEmail.toLowerCase())
        )
      );
  }, [searchEmail, data]);

  // ---------------------------
  // Render Login
  // ---------------------------
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <input
            type="email"
            placeholder="Enter Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // ---------------------------
  // Loading/Error States
  // ---------------------------
  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
    );

  // ---------------------------
  // Main Dashboard
  // ---------------------------
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Insurance Management
      </h2>

      {/* Email Search Filter */}
      <div className="flex justify-center mb-6">
        <input
          type="email"
          placeholder="Search by applicant email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Insurance Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl shadow-md p-4 bg-white hover:shadow-xl transition duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p>
                <span className="font-medium">Email:</span> {item.email}
              </p>
              <p>
                <span className="font-medium">Insurance Type:</span>{" "}
                {item.insuranceType}
              </p>
              <p>
                <span className="font-medium">Coverage:</span> {item.coverage}
              </p>
              <p>
                <span className="font-medium">Payment Term:</span>{" "}
                {item.paymentTerm}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    item.status === "Pending"
                      ? "text-yellow-500"
                      : item.status === "Approved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No applications found for this email.
          </p>
        )}
      </div>
    </div>
  );
};

export default InsuranceManagement;
