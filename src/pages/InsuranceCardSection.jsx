// src/components/InsuranceDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiFilter, FiShield, FiUser, FiDollarSign } from "react-icons/fi";
import Swal from "sweetalert2";

const InsuranceDashboard = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [coverageMin, setCoverageMin] = useState("");
  const [coverageMax, setCoverageMax] = useState("");
  const [premiumMin, setPremiumMin] = useState("");
  const [premiumMax, setPremiumMax] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 6;

  const fetchServices = async () => {
    try {
      let query = `?q=${search}&page=${page}&limit=${limit}`;
      if (providerFilter) query += `&providerName=${providerFilter}`;
      if (coverageMin) query += `&coverageMin=${coverageMin}`;
      if (coverageMax) query += `&coverageMax=${coverageMax}`;
      if (premiumMin) query += `&premiumMin=${premiumMin}`;
      if (premiumMax) query += `&premiumMax=${premiumMax}`;

      const response = await fetch(`https://insurances-lmy8.onrender.com/ourInsurancePolice${query}`);
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Unable to fetch services.", "error");
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, search, providerFilter, coverageMin, coverageMax, premiumMin, premiumMax]);

  const providerOptions = [...new Set(services.map((s) => s.providerName))];

  // Top Stats
  const totalServices = services.length;
  const activeProviders = new Set(services.map((s) => s.providerName)).size;
  const avgPremium =
    services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + s.premium, 0) / services.length)
      : 0;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 mb-6 shadow-lg">
        <h1 className="text-3xl font-bold">Insurance Services Dashboard</h1>
        <p className="mt-2 text-blue-100">Manage and browse insurance services efficiently.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex items-center gap-4">
          <FiShield className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Services</p>
            <p className="font-bold text-xl">{totalServices}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex items-center gap-4">
          <FiUser className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Active Providers</p>
            <p className="font-bold text-xl">{activeProviders}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex items-center gap-4">
          <FiDollarSign className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-gray-500 text-sm">Average Premium</p>
            <p className="font-bold text-xl">${avgPremium}</p>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4 flex justify-end">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${
          showFilters ? "flex flex-col mb-6 gap-4" : "hidden"
        } md:flex md:flex-row md:gap-4 md:mb-6 bg-white p-4 rounded-xl shadow-lg`}
      >
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        />
        <select
          value={providerFilter}
          onChange={(e) => {
            setProviderFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All Providers</option>
          {providerOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Coverage"
          value={coverageMin}
          onChange={(e) => {
            setCoverageMin(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="number"
          placeholder="Max Coverage"
          value={coverageMax}
          onChange={(e) => {
            setCoverageMax(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="number"
          placeholder="Min Premium"
          value={premiumMin}
          onChange={(e) => {
            setPremiumMin(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="number"
          placeholder="Max Premium"
          value={premiumMax}
          onChange={(e) => {
            setPremiumMax(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-4 flex flex-col justify-between"
          >
            <img
              src={s.imageUrl || "https://via.placeholder.com/300x150"}
              alt={s.serviceName}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="font-bold text-xl text-gray-900">{s.serviceName}</h3>
            <p className="text-gray-600">{s.providerName}</p>
            <p className="text-gray-500 mt-1 text-sm line-clamp-3">{s.description}</p>
            <div className="mt-3 space-y-1">
              <p>
                <span className="font-medium">Coverage:</span> ${s.coverageAmount.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Premium:</span> ${s.premium.toLocaleString()}
              </p>
            </div>
            <Link
              to={`/insurance/${s._id}`}
              className="mt-4 w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow"
            >
              Get Quote
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-white rounded-lg shadow">{page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InsuranceDashboard;
