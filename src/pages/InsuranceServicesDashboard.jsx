// src/components/InsuranceServicesDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Building,
  DollarSign,
  Mail,
  Phone,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://insurances-lmy8.onrender.com/insuranceservices";
const PAGE_SIZE = 5;

export default function InsuranceServicesDashboard() {
  // ---------------------- STATES ----------------------
  const [formData, setFormData] = useState({
    serviceName: "",
    providerName: "",
    coverageAmount: "",
    premium: "",
    contactEmail: "",
    contactNumber: "",
    imageUrl: "",
    description: "",
    status: "Pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editData, setEditData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const [notification, setNotification] = useState(null);
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // ---------------------- FETCH SERVICES ----------------------
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch {
      showNotification("error", "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ---------------------- FORM HANDLERS ----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.serviceName.trim()) return "Service Name is required";
    if (!formData.providerName.trim()) return "Provider Name is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) return showNotification("error", err);

    setIsSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Create failed");
      showNotification("success", "Service added successfully!");
      setFormData({
        serviceName: "",
        providerName: "",
        coverageAmount: "",
        premium: "",
        contactEmail: "",
        contactNumber: "",
        imageUrl: "",
        description: "",
        status: "Pending",
      });
      fetchServices();
    } catch {
      showNotification("error", "Failed to add service");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------- EDIT ----------------------
  const openEdit = (item) => {
    setEditData(item);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setEditData(null);
    setEditOpen(false);
  };
  const saveEdit = async () => {
    if (!editData) return;
    setSavingEdit(true);
    try {
      await fetch(`${API_URL}/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      showNotification("success", "Service updated");
      fetchServices();
      closeEdit();
    } catch {
      showNotification("error", "Update failed");
    } finally {
      setSavingEdit(false);
    }
  };

  // ---------------------- DELETE ----------------------
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this service?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });
    if (!confirm.isConfirmed) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      showNotification("success", "Deleted successfully");
      fetchServices();
    } catch {
      showNotification("error", "Failed to delete");
    }
  };

  // ---------------------- STATUS ----------------------
  const updateStatus = async (srv, newStatus) => {
    setStatusUpdatingId(srv._id);
    try {
      await fetch(`${API_URL}/${srv._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchServices();
    } catch {
      showNotification("error", "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // ---------------------- SEARCH + PAGINATION ----------------------
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q
      ? services.filter((s) =>
          [s.serviceName, s.providerName, s.contactEmail, s.contactNumber]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q))
        )
      : services;
  }, [services, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const inputFields = [
    { name: "serviceName", placeholder: "Service Name", icon: Shield },
    { name: "providerName", placeholder: "Provider Name", icon: Building },
    { name: "coverageAmount", placeholder: "Coverage ($)", icon: DollarSign },
    { name: "premium", placeholder: "Premium ($)", icon: DollarSign },
    { name: "contactEmail", placeholder: "Email", icon: Mail },
    { name: "contactNumber", placeholder: "Contact Number", icon: Phone },
    { name: "imageUrl", placeholder: "Image URL", icon: ImageIcon },
  ];

  // ---------------------- RENDER ----------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Insurance Services Dashboard</h1>

      {/* Search */}
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by name, provider, email or phone..."
          className="border rounded px-3 py-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchServices}
          className="px-4 py-2 border rounded bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="font-semibold mb-3">Add New Service</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {inputFields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1">
                  {f.placeholder}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded"
                  />
                </div>
              </div>
            );
          })}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isSubmitting ? "Submitting..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Premium</th>
              <th className="px-4 py-2">Coverage</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center">
                  <Loader2 className="animate-spin mx-auto" size={24} />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2">
                    {s.imageUrl && (
                      <img
                        src={s.imageUrl}
                        alt={s.serviceName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">{s.serviceName}</td>
                  <td className="px-4 py-2">{s.providerName}</td>
                  <td className="px-4 py-2">${s.premium}</td>
                  <td className="px-4 py-2">${s.coverageAmount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        s.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : s.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-1 flex-wrap">
                    {s.status === "Pending" && (
                      <>
                        <button
                          disabled={statusUpdatingId === s._id}
                          onClick={() => updateStatus(s, "Accepted")}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          disabled={statusUpdatingId === s._id}
                          onClick={() => updateStatus(s, "Rejected")}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1 border rounded hover:bg-gray-200"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-1 border rounded hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Drawer */}
      <AnimatePresence>
        {editOpen && editData && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeEdit}
            ></div>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="ml-auto w-full max-w-xl bg-white p-6 overflow-y-auto shadow-2xl rounded-l-3xl"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
              {inputFields.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.name} className="mb-3">
                    <label className="block text-sm mb-1">{f.placeholder}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name={f.name}
                        value={editData[f.name] || ""}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            [f.name]: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-2 py-2 border rounded"
                      />
                    </div>
                  </div>
                );
              })}
              <div className="mb-3">
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
