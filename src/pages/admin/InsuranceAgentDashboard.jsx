// File: src/components/InsuranceAgentDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, Eye, Pencil, PlusCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InsuranceAgentDashboard = () => {
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [policyClaims, setPolicyClaims] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", author: "" });
  const [previewStep, setPreviewStep] = useState(false);

  const [customerFilterStatus, setCustomerFilterStatus] = useState("All");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerPage, setCustomerPage] = useState(1);

  const [claimsPage, setClaimsPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCustomers();
    fetchPolicyClaims();
    fetchBlogs();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/policiesuser");
      setAssignedCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load assigned customers", "error");
    }
  };

  const fetchPolicyClaims = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/policiesuser");
      const claims = (res.data || []).filter((p) => p.claimRequested);
      setPolicyClaims(claims);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load policy claims", "error");
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/blogpost");
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load blogs", "error");
    }
  };

  // ------------------ STATUS BADGE ------------------
  const StatusBadge = ({ status }) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${colors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    );
  };

  // ------------------ HANDLERS ------------------
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://insurances-lmy8.onrender.com/policiesuser/${id}`, { status: newStatus });
      if (newStatus === "Approved") {
        await axios.patch(`https://insurances-lmy8.onrender.com/policiesuser/${id}/purchase`);
      }
      setAssignedCustomers((prev) =>
        prev.map((customer) => (customer._id === id ? { ...customer, status: newStatus } : customer))
      );
      Swal.fire("Success", `Status updated to ${newStatus}`, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleClaimApprove = async (id) => {
    try {
      await axios.patch(`https://insurances-lmy8.onrender.com/policiesuser/${id}`, { claimStatus: "Approved" });
      setPolicyClaims((prev) => prev.map((c) => (c._id === id ? { ...c, claimStatus: "Approved" } : c)));
      Swal.fire("Success", "Claim approved", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to approve claim", "error");
    }
  };

  const handleBlogCreate = async () => {
    if (!newBlog.title.trim() || !newBlog.content.trim() || !newBlog.author.trim()) {
      return Swal.fire("Warning", "Please fill all blog fields.", "warning");
    }
    try {
      const data = {
        ...newBlog,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalVisit: 0,
      };
      await axios.post("https://insurances-lmy8.onrender.com/blogpost", data);
      fetchBlogs();
      setNewBlog({ title: "", content: "", author: "" });
      setPreviewStep(false);
      Swal.fire("Success", "Blog created", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create blog", "error");
    }
  };

  // ------------------ FILTER & PAGINATION ------------------
  const filteredCustomers = assignedCustomers.filter((user) => {
    const matchStatus = customerFilterStatus === "All" || user.status === customerFilterStatus;
    const matchSearch =
      (user.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(customerSearch.toLowerCase())) ?? false;
    return matchStatus && matchSearch;
  });

  const totalCustomerPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const customerStart = (customerPage - 1) * itemsPerPage;
  const customerEnd = customerStart + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(customerStart, customerEnd);

  const totalClaimsPages = Math.ceil(policyClaims.length / itemsPerPage);
  const claimsStart = (claimsPage - 1) * itemsPerPage;
  const claimsEnd = claimsStart + itemsPerPage;
  const currentClaims = policyClaims.slice(claimsStart, claimsEnd);

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-8 text-gray-900 space-y-12">
      {/* Assigned Customers */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-500" /> Assigned Customers
        </h2>
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <select
            className="border px-3 py-1 rounded"
            value={customerFilterStatus}
            onChange={(e) => {
              setCustomerFilterStatus(e.target.value);
              setCustomerPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <input
            type="text"
            placeholder="Search by name or email"
            className="border px-3 py-1 rounded flex-1 min-w-[200px]"
            value={customerSearch}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setCustomerPage(1);
            }}
          />

          <button
            className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded transition"
            onClick={() => {
              setCustomerFilterStatus("All");
              setCustomerSearch("");
              setCustomerPage(1);
            }}
          >
            Reset
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Policies</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentCustomers.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.policies?.join(", ") || "-"}</td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <StatusBadge status={user.status || "Pending"} />
                      <select
                        className="border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-200"
                        value={user.status || "Pending"}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() =>
                          Swal.fire({
                            html: `<pre>${JSON.stringify(user, null, 2)}</pre>`,
                            width: 600,
                          })
                        }
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid gap-4">
          <AnimatePresence>
            {currentCustomers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white shadow rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{user.name}</h3>
                  <StatusBadge status={user.status || "Pending"} />
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-700">{user.policies?.join(", ") || "-"}</p>
                <div className="flex justify-between items-center mt-2">
                  <select
                    className="border rounded px-2 py-1 text-sm flex-1"
                    value={user.status || "Pending"}
                    onChange={(e) => handleStatusChange(user._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() =>
                      Swal.fire({ html: `<pre>${JSON.stringify(user, null, 2)}</pre>`, width: 600 })
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                  >
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ------------------ Policy Claims Section ------------------ */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-yellow-500" /> Policy Clearance
        </h2>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">Policy</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentClaims.map((claim, idx) => (
                  <motion.tr
                    key={claim._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-3">{claim.policyName}</td>
                    <td className="px-6 py-3">{claim.amount}</td>
                    <td className="px-6 py-3">{claim.customerName || claim.name || "-"}</td>
                    <td className="px-6 py-3 flex gap-3">
                      <button
                        onClick={() =>
                          Swal.fire({ html: `<pre>${JSON.stringify(claim, null, 2)}</pre>`, width: 600 })
                        }
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => handleClaimApprove(claim._id)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------ Blogs Section ------------------ */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Pencil className="h-6 w-6 text-green-500" /> Manage Blogs
        </h2>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          {!previewStep ? (
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Title"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="border px-4 py-2 rounded shadow-sm focus:ring focus:ring-blue-200"
              />
              <input
                type="text"
                placeholder="Author"
                value={newBlog.author}
                onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                className="border px-4 py-2 rounded shadow-sm focus:ring focus:ring-blue-200"
              />
              <textarea
                placeholder="Content"
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                className="border px-4 py-2 rounded shadow-sm col-span-full md:col-span-3 focus:ring focus:ring-blue-200"
                rows={4}
              />
              <button
                onClick={() => setPreviewStep(true)}
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition md:col-span-3 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Preview Blog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                <h4 className="text-xl font-bold">{newBlog.title}</h4>
                <p className="text-sm text-gray-600">By {newBlog.author} | {new Date().toLocaleDateString()}</p>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">{newBlog.content}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setPreviewStep(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleBlogCreate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Publish
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InsuranceAgentDashboard;
