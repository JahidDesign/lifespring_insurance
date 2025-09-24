// File: AdminApplications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [newApp, setNewApp] = useState({
    name: "",
    email: "",
    insuranceType: "",
    coverage: "",
    status: "Pending",
  });

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

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://insurances-lmy8.onrender.com/management", newApp);
      Swal.fire("Created!", "New application has been added.", "success");
      setNewApp({ name: "", email: "", insuranceType: "", coverage: "", status: "Pending" });
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Could not create application", "error");
    }
  };

  // UPDATE
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

  // DELETE
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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
      <h2 className="text-2xl font-bold mb-4">👨‍💼 Admin - Manage Applications (CRUD)</h2>

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Name"
          value={newApp.name}
          onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newApp.email}
          onChange={(e) => setNewApp({ ...newApp, email: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <select
          value={newApp.insuranceType}
          onChange={(e) => setNewApp({ ...newApp, insuranceType: e.target.value })}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="life">Life</option>
          <option value="health">Health</option>
          <option value="vehicle">Vehicle</option>
          <option value="property">Property</option>
        </select>
        <input
          type="number"
          placeholder="Coverage"
          value={newApp.coverage}
          onChange={(e) => setNewApp({ ...newApp, coverage: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
          ➕ Add
        </button>
      </form>

      {/* TABLE */}
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
                <td className="p-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(app._id, "Approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
