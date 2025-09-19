// File: InsuranceAgentDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, Eye, Pencil, PlusCircle, Users } from "lucide-react";

const InsuranceAgentDashboard = () => {
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [policyClaims, setPolicyClaims] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", author: "" });
  const [previewStep, setPreviewStep] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchPolicyClaims();
    fetchBlogs();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/policiesuser");
      setAssignedCustomers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load assigned customers", "error");
    }
  };

  const fetchPolicyClaims = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/policiesuser");
      const claims = res.data.filter((p) => p.claimRequested);
      setPolicyClaims(claims);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load policy claims", "error");
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/blogpost");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load blogs", "error");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`https://insurances-lmy8.onrender.com/policiesuser/${id}`, { status: newStatus });
      if (newStatus === "Approved") {
        await axios.patch(`https://insurances-lmy8.onrender.com/policiesuser/${id}/purchase`);
      }
      fetchCustomers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
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

  const handleClaimApprove = async (id) => {
    try {
      await axios.patch(`https://insurances-lmy8.onrender.com/policiesuser/${id}`, { claimStatus: "Approved" });
      fetchPolicyClaims();
      Swal.fire("Success", "Claim approved", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to approve claim", "error");
    }
  };

  // Badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 text-gray-900 space-y-12">
      {/* Assigned Customers */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-500" /> Assigned Customers
        </h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
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
              {assignedCustomers.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.policies?.join(", ") || "-"}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={user.status || "Pending"} />
                    <select
                      className="ml-2 border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-200"
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
                </tr>
              ))}
              {assignedCustomers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No assigned customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manage Blogs */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Pencil className="h-6 w-6 text-green-500" /> Manage Blogs
        </h2>
        <div className="bg-white rounded-xl shadow p-6">
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

        {/* Blog List */}
        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, idx) => (
                <tr
                  key={blog._id}
                  className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="px-6 py-3">{blog.title}</td>
                  <td className="px-6 py-3">{blog.author}</td>
                  <td className="px-6 py-3">{blog.date}</td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Policy Clearance */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-yellow-500" /> Policy Clearance
        </h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">Policy</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {policyClaims.map((claim, idx) => (
                <tr
                  key={claim._id}
                  className={`transition hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="px-6 py-3">{claim.policyName}</td>
                  <td className="px-6 py-3">{claim.amount}</td>
                  <td className="px-6 py-3">{claim.customerName || claim.name || "-"}</td>
                  <td className="px-6 py-3 flex gap-3">
                    <button
                      onClick={() =>
                        Swal.fire({
                          html: `<pre>${JSON.stringify(claim, null, 2)}</pre>`,
                          width: 600,
                        })
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
                </tr>
              ))}
              {policyClaims.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No claims requested.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InsuranceAgentDashboard;
