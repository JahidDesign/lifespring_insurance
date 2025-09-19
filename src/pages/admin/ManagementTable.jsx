import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2, X, CheckCircle, XCircle } from "lucide-react";

// ===================
// Modal Component
// ===================
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ===================
// Confirmation Modal
// ===================
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-4">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="border px-4 py-2 rounded hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </Modal>
  );
};

// ===================
// Main Management Table
// ===================
const ManagementTable = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    title: "",
    message: "",
    loading: false,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://insurances-lmy8.onrender.com/management");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Update status (Accept / Reject)
  const handleStatusUpdate = async (id, status) => {
    const appIndex = applications.findIndex((app) => app._id === id);
    if (appIndex === -1) return;
    const originalApp = { ...applications[appIndex] };

    try {
      setConfirmModal((prev) => ({ ...prev, loading: true }));

      // Optimistic UI update
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );

      await axios.patch(`https://insurances-lmy8.onrender.com/management/${id}`, { status });

      setConfirmModal({ isOpen: false, action: null, title: "", message: "", loading: false });
    } catch (err) {
      console.error("Status update failed:", err);

      // Rollback UI on error
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? originalApp : app))
      );

      alert(`Failed to update status to ${status}. Please try again.`);
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Delete application
  const handleDelete = async (id) => {
    const originalApps = [...applications];

    try {
      setConfirmModal((prev) => ({ ...prev, loading: true }));

      // Optimistic UI delete
      setApplications((prev) => prev.filter((app) => app._id !== id));

      await axios.delete(`https://insurances-lmy8.onrender.com/management/${id}`);

      setConfirmModal({ isOpen: false, action: null, title: "", message: "", loading: false });
    } catch (err) {
      console.error("Delete failed:", err);

      // Rollback UI on error
      setApplications(originalApps);
      alert("Failed to delete application. Please try again.");
      setConfirmModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Status badge classes
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm";
      case "Approved":
        return "bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm";
      case "Rejected":
        return "bg-red-200 text-red-800 px-2 py-1 rounded-full text-sm";
      default:
        return "";
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Insurance Applications</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Policy</th>
            <th className="border p-2">Nominee</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No applications found.
              </td>
            </tr>
          )}
          {applications.map((app) => (
            <tr key={app._id} className="hover:bg-gray-50">
              <td className="border p-2">{app.name}</td>
              <td className="border p-2">{app.email}</td>
              <td className="border p-2">{app.insuranceType}</td>
              <td className="border p-2">{app.nomineeName}</td>
              <td className="border p-2">
                <span className={getStatusClass(app.status)}>{app.status}</span>
              </td>
              <td className="border p-2 flex gap-2 flex-wrap">
                {/* View */}
                <button
                  onClick={() => setSelectedApp(app)}
                  className="bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
                >
                  <Eye size={16} /> View
                </button>

                {/* Accept */}
                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      action: () => handleStatusUpdate(app._id, "Approved"),
                      title: "Accept Application",
                      message: `Are you sure you want to accept ${app.name}'s application?`,
                      loading: false,
                    })
                  }
                  className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-green-700"
                >
                  <CheckCircle size={16} /> Accept
                </button>

                {/* Reject */}
                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      action: () => handleStatusUpdate(app._id, "Rejected"),
                      title: "Reject Application",
                      message: `Are you sure you want to reject ${app.name}'s application?`,
                      loading: false,
                    })
                  }
                  className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-red-600"
                >
                  <XCircle size={16} /> Reject
                </button>

                {/* Delete */}
                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: true,
                      action: () => handleDelete(app._id),
                      title: "Delete Application",
                      message: `Are you sure you want to delete ${app.name}'s application?`,
                      loading: false,
                    })
                  }
                  className="bg-gray-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-700"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
      >
        {selectedApp && (
          <div className="space-y-3">
            {selectedApp.image && (
              <img
                src={selectedApp.image}
                alt={selectedApp.name}
                className="w-32 h-32 object-cover rounded"
              />
            )}
            <p><b>Name:</b> {selectedApp.name}</p>
            <p><b>Date of Birth:</b> {selectedApp.dob}</p>
            <p><b>NID:</b> {selectedApp.nid}</p>
            <p><b>Phone:</b> {selectedApp.phone}</p>
            <p><b>Email:</b> {selectedApp.email}</p>
            <p><b>Insurance Type:</b> {selectedApp.insuranceType}</p>
            <p><b>Coverage:</b> {selectedApp.coverage}</p>
            <p><b>Payment Term:</b> {selectedApp.paymentTerm}</p>
            <p><b>Nominee Name:</b> {selectedApp.nomineeName}</p>
            <p><b>Nominee Relation:</b> {selectedApp.nomineeRelation}</p>
            <p><b>Nominee NID:</b> {selectedApp.nomineeNid}</p>
            {selectedApp.nidDocumentUrl && (
              <p>
                <b>NID Document:</b>{" "}
                <a
                  href={selectedApp.nidDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Document
                </a>
              </p>
            )}
            {selectedApp.additionalDocsUrl && (
              <p>
                <b>Additional Docs:</b>{" "}
                <a
                  href={selectedApp.additionalDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Document
                </a>
              </p>
            )}
            <p><b>Health Condition:</b> {selectedApp.healthCondition}</p>
            <p><b>Health Details:</b> {selectedApp.healthDetails}</p>
            <p><b>Status:</b> {selectedApp.status}</p>
          </div>
        )}
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: null, title: "", message: "", loading: false })
        }
        onConfirm={confirmModal.action}
        title={confirmModal.title}
        message={confirmModal.message}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default ManagementTable;
