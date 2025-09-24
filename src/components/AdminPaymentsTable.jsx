// File: src/components/AdminPaymentsTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminPaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const { data } = await axios.get("https://insurances-lmy8.onrender.com/payments");
      setPayments(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Count payments per policy
  const policyCounts = payments.reduce((acc, p) => {
    acc[p.policyId] = (acc[p.policyId] || 0) + 1;
    return acc;
  }, {});

  // Count payments by status
  const statusCounts = payments.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    { pending: 0, completed: 0, rejected: 0 }
  );

  // Update payment status
  const updateStatus = async (id, newStatus) => {
    setPayments((prev) => prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)));
    try {
      const { data } = await axios.patch(`https://insurances-lmy8.onrender.com/payments/${id}`, {
        status: newStatus,
      });
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: data.status, updatedAt: data.updatedAt } : p))
      );
      Swal.fire(
        "Success",
        `Payment status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
      setPayments((prev) => prev.map((p) => (p._id === id ? { ...p, status: "pending" } : p)));
    }
  };

  if (loading) return <p className="text-center py-8">Loading payments...</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Filtered + searched payments
  const filteredPayments = payments.filter((p) => {
    const matchTitle = filterTitle === "All" || p.title === filterTitle;
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTitle && matchStatus && matchSearch;
  });

  // Total amount collected (filtered)
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.premium, 0);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Unique policy titles for dropdown
  const uniqueTitles = Array.from(new Set(payments.map((p) => p.title)));

  // Reset all filters and search
  const resetFilters = () => {
    setFilterTitle("All");
    setFilterStatus("All");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">All Payments</h2>

      {/* Status Summary Bar */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded font-semibold">
          Pending: {statusCounts.pending}
        </div>
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded font-semibold">
          Completed: {statusCounts.completed}
        </div>
        <div className="px-4 py-2 bg-red-100 text-red-800 rounded font-semibold">
          Rejected: {statusCounts.rejected}
        </div>
        <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded font-semibold">
          Total Collected: ${totalAmount}
        </div>
      </div>

      {/* Filters + Search + Reset */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="font-semibold mr-2">Filter by Policy:</label>
          <select
            value={filterTitle}
            onChange={(e) => {
              setFilterTitle(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="All">All</option>
            {uniqueTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold mr-2">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by policy title or payment ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1 w-full"
          />
        </div>

        <button
          onClick={resetFilters}
          className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Payments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentPayments.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{p.title}</h3>
              <span
                className={`px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(
                  p.status
                )}`}
              >
                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
              </span>
            </div>

            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Type:</span> {p.type}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Amount:</span> ${p.premium}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Policy ID:</span> {p.policyId}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Total Payments for this Policy:</span> {policyCounts[p.policyId]}
            </p>
            <p className="text-gray-500 text-sm mb-3">
              Created: {new Date(p.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-2">
              {p.status === "pending" ? (
                <>
                  <button
                    onClick={() => updateStatus(p._id, "completed")}
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => updateStatus(p._id, "rejected")}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span className="text-gray-400 italic">No Action</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsTable;
