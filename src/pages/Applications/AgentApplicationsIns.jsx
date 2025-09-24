// File: AgentApplicationsIns.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AgentApplicationsIns() {
  const [applications, setApplications] = useState([]);
  const [editingApp, setEditingApp] = useState(null);

  // Fetch all applications
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

  // Update status only (Approve/Reject)
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

  // Save edited application
  const saveEdit = async () => {
    try {
      await axios.put(
        `https://insurances-lmy8.onrender.com/management/${editingApp._id}`,
        editingApp
      );
      Swal.fire("Updated!", "Application details updated.", "success");
      setEditingApp(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error", "Could not update application", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">🧑‍💼 Agent - Manage Applications</h2>

      {/* Applications Table */}
      {applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-800 text-white">
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
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setEditingApp(app)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">✏️ Edit Application</h3>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={editingApp.name}
              onChange={(e) =>
                setEditingApp({ ...editingApp, name: e.target.value })
              }
            />
            <input
              type="email"
              className="w-full p-2 border rounded mb-2"
              value={editingApp.email}
              onChange={(e) =>
                setEditingApp({ ...editingApp, email: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={editingApp.insuranceType}
              onChange={(e) =>
                setEditingApp({
                  ...editingApp,
                  insuranceType: e.target.value,
                })
              }
            />
            <input
              type="number"
              className="w-full p-2 border rounded mb-2"
              value={editingApp.coverage}
              onChange={(e) =>
                setEditingApp({ ...editingApp, coverage: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingApp(null)}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
