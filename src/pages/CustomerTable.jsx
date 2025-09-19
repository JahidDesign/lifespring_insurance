// File: CustomerTable.jsx
import { useEffect, useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { FiTrash2, FiEdit, FiChevronDown, FiUpload } from "react-icons/fi";

// =================== Config ===================
const API_BASE_URL = "https://insurances-lmy8.onrender.com"; // Replace with production URL
const AGENTS = ["a", "b", "c", "d", "e"];
const ROLES = ["admin", "customer", ...AGENTS];
const STATUSES = ["active", "inactive"];

const ROLE_LABELS = {
  admin: "Admin",
  customer: "Customer",
  a: "Group A",
  b: "Group B",
  c: "Group C",
  d: "Group D",
  e: "Group E",
};

const STATUS_STYLES = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-rose-100 text-rose-700",
};

const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-700",
  customer: "bg-gray-100 text-gray-700",
  a: "bg-blue-100 text-blue-700",
  b: "bg-teal-100 text-teal-700",
  c: "bg-green-100 text-green-700",
  d: "bg-orange-100 text-orange-700",
  e: "bg-pink-100 text-pink-700",
};

// =================== Main Component ===================
const CustomerTable = () => {
  const { user } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
    photo: null,
  });

  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
    photo: null,
  });

  const [adding, setAdding] = useState(false);

  // ---------------- Pagination ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ---------------- API Helper ----------------
  const makeApiCall = async (endpoint, method, body = null) => {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: body instanceof FormData ? {} : { "Content-Type": "application/json" },
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // ---------------- Fetch Customers ----------------
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await makeApiCall("/customer", "GET");
      const list = Array.isArray(data) ? data : [data];
      setCustomers(list);
      setFilteredCustomers(list);
    } catch (err) {
      setCustomers([]);
      setFilteredCustomers([]);
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ---------------- Filter & Search ----------------
  useEffect(() => {
    let result = [...customers];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          ROLE_LABELS[c.role]?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((c) => c.status === statusFilter);
    if (roleFilter !== "all") result = result.filter((c) => c.role === roleFilter);
    setFilteredCustomers(result);
    setCurrentPage(1); // Reset page after filter
  }, [searchTerm, statusFilter, roleFilter, customers]);

  // ---------------- Delete Customer ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    const prevCustomers = [...customers];
    setCustomers((prev) => prev.filter((c) => c._id !== id));
    setFilteredCustomers((prev) => prev.filter((c) => c._id !== id));

    try {
      await makeApiCall(`/customer/${id}`, "DELETE");
      toast.success("Customer removed successfully");
    } catch (err) {
      setCustomers(prevCustomers);
      setFilteredCustomers(prevCustomers);
      toast.error("Delete failed");
    }
  };

  // ---------------- Inline Status / Role Update ----------------
  const handleStatusChange = async (id, newStatus) => {
    const prevCustomers = [...customers];
    setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
    setFilteredCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));

    try {
      await makeApiCall(`/customer/${id}/status`, "PATCH", { status: newStatus });
      toast.success("Status updated");
    } catch (err) {
      setCustomers(prevCustomers);
      setFilteredCustomers(prevCustomers);
      toast.error("Status update failed");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const prevCustomers = [...customers];
    setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, role: newRole } : c)));
    setFilteredCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, role: newRole } : c)));

    try {
      await makeApiCall(`/customer/${id}/role`, "PATCH", { role: newRole });
      toast.success("Role updated");
    } catch (err) {
      setCustomers(prevCustomers);
      setFilteredCustomers(prevCustomers);
      toast.error("Role update failed");
    }
  };

  // ---------------- Edit Customer ----------------
  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      role: customer.role,
      status: customer.status,
      photo: null,
    });
  };

  const handleFormChange = (e, isNew = false) => {
    const { name, value, files } = e.target;
    if (isNew) {
      setNewCustomerData({ ...newCustomerData, [name]: files ? files[0] : value });
    } else {
      setFormData({ ...formData, [name]: files ? files[0] : value });
    }
  };

  const handleSave = async () => {
    const body = new FormData();
    body.append("name", formData.name);
    body.append("email", formData.email);
    body.append("role", formData.role);
    body.append("status", formData.status);
    if (formData.photo) body.append("photo", formData.photo);

    const prevCustomers = [...customers];
    setCustomers((prev) =>
      prev.map((c) =>
        c._id === editingCustomer._id
          ? { ...c, ...formData, photo: formData.photo ? URL.createObjectURL(formData.photo) : c.photo }
          : c
      )
    );
    setFilteredCustomers((prev) =>
      prev.map((c) =>
        c._id === editingCustomer._id
          ? { ...c, ...formData, photo: formData.photo ? URL.createObjectURL(formData.photo) : c.photo }
          : c
      )
    );

    try {
      await makeApiCall(`/customer/${editingCustomer._id}`, "PUT", body);
      toast.success("Customer updated successfully");
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      setCustomers(prevCustomers);
      setFilteredCustomers(prevCustomers);
      toast.error("Update failed");
    }
  };

  // ---------------- Add New Customer ----------------
  const handleAddCustomer = async () => {
    const { name, email, role, status, photo } = newCustomerData;
    if (!name || !email) return toast.error("Name and Email are required");

    setAdding(true);
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("role", role);
    body.append("status", status);
    if (photo) body.append("photo", photo);

    try {
      const newCustomer = await makeApiCall("/customer", "POST", body);
      setCustomers([newCustomer, ...customers]);
      setFilteredCustomers([newCustomer, ...filteredCustomers]);
      setNewCustomerData({ name: "", email: "", role: "customer", status: "active", photo: null });
      toast.success("Customer added successfully");
    } catch (err) {
      toast.error("Failed to add customer");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Add Customer Form */}
      <div className="mb-6 p-5 border rounded-xl bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-3">➕ Add New Customer</h2>
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newCustomerData.name}
            onChange={(e) => handleFormChange(e, true)}
            className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newCustomerData.email}
            onChange={(e) => handleFormChange(e, true)}
            className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <select
            name="status"
            value={newCustomerData.status}
            onChange={(e) => handleFormChange(e, true)}
            className="border rounded-lg px-3 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            name="role"
            value={newCustomerData.role}
            onChange={(e) => handleFormChange(e, true)}
            className="border rounded-lg px-3 py-2"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <FiUpload /> {newCustomerData.photo ? newCustomerData.photo.name : "Upload Photo"}
            <input type="file" name="photo" onChange={(e) => handleFormChange(e, true)} className="hidden" />
          </label>
          <button
            onClick={handleAddCustomer}
            disabled={adding}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Customer"}
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
        />
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="px-4 py-2 border rounded-lg bg-gray-100 flex items-center gap-2 hover:bg-gray-200 transition"
        >
          {filtersOpen ? "Hide Filters" : "Show Filters"} <FiChevronDown />
        </button>
      </div>

      {filtersOpen && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="all">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Customer Cards */}
      {loading ? (
        <div className="flex justify-center py-10 text-lg font-medium">Loading...</div>
      ) : paginatedCustomers.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">No customers found.</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCustomers.map((c) => (
              <div
                key={c._id}
                className="bg-white shadow-md hover:shadow-xl rounded-xl p-5 border transition transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <img
                      src={c.photo || "https://via.placeholder.com/50"}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-gray-500 text-sm">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(c)} className="text-blue-600 hover:text-blue-800">
                      <FiEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Status & Role */}
                <div className="flex gap-2 flex-wrap mt-3 items-center">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer ${STATUS_STYLES[c.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={c.role}
                    onChange={(e) => handleRoleChange(c._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border outline-none cursor-pointer ${ROLE_STYLES[c.role]}`}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>

            {/* Photo Upload */}
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer mb-4 bg-gray-50 hover:bg-gray-100 transition">
              <FiUpload /> {formData.photo ? formData.photo.name : "Upload Photo"}
              <input type="file" name="photo" onChange={handleFormChange} className="hidden" />
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
