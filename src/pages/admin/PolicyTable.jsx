import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PolicyTable = () => {
  const [policies, setPolicies] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/policiesuser");
      setPolicies(res.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This policy will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://insurances-lmy8.onrender.com/policiesuser/${id}`);
        Swal.fire("Deleted!", "Policy has been deleted.", "success");
        fetchPolicies();
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete policy", "error");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`https://insurances-lmy8.onrender.com/policiesuser/${id}`, { status });
      Swal.fire("Updated!", `Policy status changed to ${status}`, "success");
      fetchPolicies();
    } catch (error) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleEdit = (policy) => {
    setEditData(policy);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://insurances-lmy8.onrender.com/policiesuser/${editData._id}`, editData);
      Swal.fire("Success", "Policy updated successfully", "success");
      setEditData(null);
      fetchPolicies();
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Failed to update policy", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl text-black">
      <h2 className="text-2xl font-bold mb-6">📋 All Insurance Policies</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["Title", "Category", "Age", "Coverage", "Duration", "Base Rate", "Status", "Actions"].map((h) => (
                <th key={h} className="p-3 border font-semibold text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy._id} className="hover:bg-gray-50 transition">
                <td className="p-3 border">{policy.title}</td>
                <td className="p-3 border">{policy.category}</td>
                <td className="p-3 border">
                  {policy.minAge} - {policy.maxAge}
                </td>
                <td className="p-3 border">{policy.coverage}</td>
                <td className="p-3 border">{policy.duration}</td>
                <td className="p-3 border">${policy.baseRate}</td>
                <td className="p-3 border">{policy.status || "Pending"}</td>
                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => handleEdit(policy)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(policy._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <select
                    onChange={(e) => handleStatusChange(policy._id, e.target.value)}
                    value={policy.status || "Pending"}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4"
          >
            <h3 className="text-xl font-semibold mb-2">✏️ Edit Policy</h3>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Policy Title"
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows="3"
              className="w-full border px-3 py-2 rounded"
              placeholder="Description"
            />
            <div className="flex gap-4">
              <input
                type="number"
                value={editData.minAge}
                onChange={(e) => setEditData({ ...editData, minAge: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Min Age"
              />
              <input
                type="number"
                value={editData.maxAge}
                onChange={(e) => setEditData({ ...editData, maxAge: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Max Age"
              />
            </div>
            <input
              type="text"
              value={editData.coverage}
              onChange={(e) => setEditData({ ...editData, coverage: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Coverage"
            />
            <input
              type="text"
              value={editData.duration}
              onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Duration"
            />
            <input
              type="number"
              value={editData.baseRate}
              onChange={(e) => setEditData({ ...editData, baseRate: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Base Premium Rate"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditData(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PolicyTable;
