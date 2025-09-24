// File: AdminApplicationsIns.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminApplicationsIns() {
  const [applications, setApplications] = useState([]);
  const [newApp, setNewApp] = useState({
    name: "",
    email: "",
    insuranceType: "",
    coverage: "",
    status: "Pending",
  });
  const [editApp, setEditApp] = useState(null);

  // ---------------- Fetch All ----------------
  const fetchData = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/management");
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- Create ----------------
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://insurances-lmy8.onrender.com/management", newApp);
      Swal.fire("Success", "New application added!", "success");
      setNewApp({ name: "", email: "", insuranceType: "", coverage: "", status: "Pending" });
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Could not create application", "error");
    }
  };

  // ---------------- Update Status ----------------
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://insurances-lmy8.onrender.com/management/${id}`, {
        status: newStatus,
      });
      Swal.fire("Updated!", `Status changed to ${newStatus}`, "success");
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Could not update status", "error");
    }
  };

  // ---------------- Full Edit ----------------
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://insurances-lmy8.onrender.com/management/${editApp._id}`, editApp);
      Swal.fire("Updated!", "Application updated successfully", "success");
      setEditApp(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Could not update application", "error");
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the application!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://insurances-lmy8.onrender.com/management/${id}`);
          Swal.fire("Deleted!", "Application has been removed.", "success");
          fetchData();
        } catch (err) {
          Swal.fire("Error", "Could not delete application", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">👨‍💼 Admin - Applications Management (CRUD)</h2>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="grid grid-cols-5 gap-4 mb-8">
        <input
          type="text"
          placeholder="Name"
          value={newApp.name}
          onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newApp.email}
          onChange={(e) => setNewApp({ ...newApp, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Insurance Type"
          value={newApp.insuranceType}
          onChange={(e) => setNewApp({ ...newApp, insuranceType: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Coverage"
          value={newApp.coverage}
          onChange={(e) => setNewApp({ ...newApp, coverage: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          Add
        </button>
      </form>

      {/* Applications Table */}
      {applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Type</th>
              <th className="p-3">Coverage</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{app.name}</td>
                <td className="p-3">{app.email}</td>
                <td className="p-3 capitalize">{app.insuranceType}</td>
                <td className="p-3">${app.coverage}</td>
                <td className="p-3 font-semibold">{app.status}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => updateStatus(app._id, "Approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setEditApp(app)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleEdit}
            className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
          >
            <h3 className="text-lg font-bold">Edit Application</h3>
            <input
              type="text"
              value={editApp.name}
              onChange={(e) => setEditApp({ ...editApp, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              value={editApp.email}
              onChange={(e) => setEditApp({ ...editApp, email: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              value={editApp.insuranceType}
              onChange={(e) => setEditApp({ ...editApp, insuranceType: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              value={editApp.coverage}
              onChange={(e) => setEditApp({ ...editApp, coverage: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <select
              value={editApp.status}
              onChange={(e) => setEditApp({ ...editApp, status: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditApp(null)}
                className="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
