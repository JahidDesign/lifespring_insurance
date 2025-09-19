import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const CustomerCards = () => {
  const { authHeader } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    if (!authHeader) {
      setError("Authentication token missing. Please login.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetch("https://insurances-lmy8.onrender.com/customer", {
      headers: {
        Authorization: `Bearer ${authHeader}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Failed to fetch customers");
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Unexpected response format");
        setCustomers(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [authHeader]);

  // Filter and sort customers
  const filteredAndSortedCustomers = customers
    .filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "email") return a.email.localeCompare(b.email);
      return 0;
    });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No customers found.
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      {/* Customer Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredAndSortedCustomers.length} of {customers.length} customers
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Customer Cards Grid */}
      {filteredAndSortedCustomers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No customers match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedCustomers.map(({ _id, name, email, phone }) => (
            <div
              key={_id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-5 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
                <div className="w-2 h-2 bg-green-400 rounded-full" title="Active"></div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📧</span>
                  <span className="text-gray-700 truncate" title={email}>{email}</span>
                </div>

                {phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📞</span>
                    <span className="text-gray-700">{phone}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerCards;
