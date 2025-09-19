// File: ApplicationManager.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://insurances-lmy8.onrender.com/management";

const defaultForm = {
  name: "",
  dob: "",
  nid: "",
  phone: "",
  email: "",
  image: "",
  insuranceType: "",
  coverage: "",
  paymentTerm: "",
  nomineeName: "",
  nomineeRelation: "",
  nomineeNid: "",
  nidDocumentUrl: "",
  additionalDocsUrl: "",
  healthCondition: "",
  healthDetails: "",
  status: "Pending",
};

// ------------------- Icons -------------------
const EditIcon = () => <span>Edit</span>;
const TrashIcon = () => <span>Delete</span>;
const ViewIcon = () => <span>View</span>;

// ------------------- Utility Functions -------------------
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
};

const validateForm = (form) => {
  if (!form.name) return "Name is required";
  if (!form.email) return "Email is required";
  if (!form.insuranceType) return "Insurance Type is required";
  return null;
};

// ------------------- Application Form -------------------
const ApplicationForm = ({ formData, onChange, onSave, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-auto">
      <form
        onSubmit={onSave}
        className="bg-white p-6 rounded shadow max-w-4xl mx-auto mt-10 mb-10 w-full"
      >
        <h2 className="text-xl font-bold mb-4">
          {formData._id ? "Edit Application" : "Add Application"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(defaultForm).map((key) => {
            if (key === "status") return null;
            return (
              <input
                key={key}
                name={key}
                value={formData[key] || ""}
                onChange={onChange}
                placeholder={key}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            );
          })}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

// ------------------- Application View Modal -------------------
const ApplicationView = ({ app, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-2xl w-full max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Application Details</h2>
        <div className="space-y-2 text-sm">
          {Object.entries(app).map(([key, value]) => (
            <p key={key}>
              <b>{key}:</b> {value?.toString()}
            </p>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------- Main Table Component -------------------
const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingApp, setEditingApp] = useState(null);
  const [viewingApp, setViewingApp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  // ------------------- Fetch Applications -------------------
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchJSON(API_URL);
      setApplications(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ------------------- Form Handlers -------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openForm = (app = null) => {
    setEditingApp(app);
    setFormData(app || defaultForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingApp(null);
    setFormData(defaultForm);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const error = validateForm(formData);
    if (error) return toast.error(error);

    try {
      const method = editingApp ? "PUT" : "POST";
      const url = editingApp ? `${API_URL}/${editingApp._id}` : API_URL;
      const saved = await fetchJSON(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setApplications((prev) =>
        editingApp
          ? prev.map((a) => (a._id.toString() === saved._id.toString() ? saved : a))
          : [...prev, saved]
      );
      toast.success("Application saved successfully");
      closeForm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await fetchJSON(`${API_URL}/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a._id.toString() !== id.toString()));
      toast.success("Application deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const prevApps = [...applications];

    setApplications((apps) =>
      apps.map((a) => (a._id.toString() === id.toString() ? { ...a, status: newStatus } : a))
    );

    try {
      const updated = await fetchJSON(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setApplications((apps) =>
        apps.map((a) => (a._id.toString() === updated._id.toString() ? updated : a))
      );

      toast.success(`Status updated to ${updated.status}`);
    } catch (err) {
      toast.error(err.message);
      setApplications(prevApps);
    }
  };

  // ------------------- Filtered Applications -------------------
  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ------------------- Render -------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6">Insurance Applications</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          + Add Application
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        {loading ? (
          <div className="p-10 text-center text-gray-500 animate-pulse">Loading...</div>
        ) : filteredApps.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No applications found.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Insurance</th>
                <th className="p-3 text-left">Nominee</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{app.name}</td>
                  <td className="p-3">{app.email}</td>
                  <td className="p-3">{app.phone}</td>
                  <td className="p-3">{app.insuranceType}</td>
                  <td className="p-3">{app.nomineeName} ({app.nomineeRelation})</td>
                  <td className="p-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`border p-1 rounded ${
                        app.status === "Pending"
                          ? "bg-yellow-100"
                          : app.status === "Accepted"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => setViewingApp(app)}
                      className="bg-green-500 text-white px-2 rounded hover:bg-green-600 transition"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      onClick={() => openForm(app)}
                      className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600 transition"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="bg-red-500 text-white px-2 rounded hover:bg-red-600 transition"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <ApplicationForm
          formData={formData}
          onChange={handleFormChange}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      {viewingApp && <ApplicationView app={viewingApp} onClose={() => setViewingApp(null)} />}
    </div>
  );
};

export default ApplicationManager;
