import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

const API_URL = "https://insurances-lmy8.onrender.com/paymentsInsurance";

const Badge = ({ status }) => {
  if (status === "Accept")
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-green-800 bg-green-100 text-xs font-semibold gap-1">
        <CheckCircle size={14} /> Accept
      </span>
    );
  if (status === "Reject")
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-red-800 bg-red-100 text-xs font-semibold gap-1">
        <XCircle size={14} /> Reject
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-yellow-800 bg-yellow-100 text-xs font-semibold gap-1">
      <Clock size={14} /> Pending
    </span>
  );
};

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-3 py-1 rounded-md font-medium transition ${className}`}
  >
    {children}
  </button>
);

export default function AdminPaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPayment, setEditingPayment] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const deletePayment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setPayments(payments.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updatePayment = async () => {
    try {
      await fetch(`${API_URL}/${editingPayment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPayment),
      });
      setEditingPayment(null);
      fetchPayments();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Filter and search payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? p.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p className="p-6">Loading payments...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payments Management</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Search by title or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-64"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded w-full sm:w-48"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="Accept">Accept</option>
          <option value="Reject">Reject</option>
        </select>
        <Button
          className="bg-gray-200 hover:bg-gray-300"
          onClick={() => {
            setSearch("");
            setFilterStatus("");
          }}
        >
          Reset
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Premium
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Coverage
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((p) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <td className="px-4 py-2 text-sm">{p.title}</td>
                <td className="px-4 py-2 text-sm">{p.type}</td>
                <td className="px-4 py-2 text-sm">${p.premium}</td>
                <td className="px-4 py-2 text-sm">${p.coverageAmount}</td>
                <td className="px-4 py-2 text-sm">
                  <Badge status={p.status} />
                </td>
                <td className="px-4 py-2 text-sm flex justify-end gap-2">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => setEditingPayment(p)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => deletePayment(p._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 space-y-3">
            <h3 className="text-xl font-bold mb-2">Edit Payment</h3>
            <input
              className="w-full border p-2 rounded"
              value={editingPayment.title}
              onChange={(e) =>
                setEditingPayment({ ...editingPayment, title: e.target.value })
              }
              placeholder="Title"
            />
            <input
              className="w-full border p-2 rounded"
              value={editingPayment.type}
              onChange={(e) =>
                setEditingPayment({ ...editingPayment, type: e.target.value })
              }
              placeholder="Type"
            />
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={editingPayment.premium}
              onChange={(e) =>
                setEditingPayment({ ...editingPayment, premium: e.target.value })
              }
              placeholder="Premium"
            />
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={editingPayment.coverageAmount}
              onChange={(e) =>
                setEditingPayment({
                  ...editingPayment,
                  coverageAmount: e.target.value,
                })
              }
              placeholder="Coverage"
            />
            <select
              className="w-full border p-2 rounded"
              value={editingPayment.status}
              onChange={(e) =>
                setEditingPayment({ ...editingPayment, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="Accept">Accept</option>
              <option value="Reject">Reject</option>
            </select>

            <div className="flex justify-end gap-2 mt-2">
              <Button
                className="bg-gray-200 hover:bg-gray-300"
                onClick={() => setEditingPayment(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={updatePayment}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
