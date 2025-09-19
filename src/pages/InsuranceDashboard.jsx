// src/components/InsuranceDashboardManager.jsx
import React, { useEffect, useState, useContext } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { Shield, DollarSign, User, X } from "lucide-react";

// Mock AuthContext
const AuthContext = React.createContext({
  role: "admin",
  isAdmin: true,
});

// Mock Swal for demo
const Swal = {
  fire: (options) => {
    if (typeof options === "object" && options.showCancelButton) {
      return Promise.resolve({ isConfirmed: window.confirm(options.title) });
    }
    alert(options.title || options);
    return Promise.resolve();
  },
};

// ================= Edit Modal Component =================
const EditModal = ({ visible, onClose, serviceData, onSave }) => {
  const [formData, setFormData] = useState({ ...serviceData });

  useEffect(() => setFormData(serviceData), [serviceData]);

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      coverageAmount: Number(formData.coverageAmount),
      premium: Number(formData.premium),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh] transform transition-all scale-95 animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiEdit className="text-blue-600" />
            Edit Insurance Service
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Service Name", name: "serviceName", type: "text", placeholder: "Enter service name" },
            { label: "Provider Name", name: "providerName", type: "text", placeholder: "Enter provider name" },
            { label: "Coverage Amount ($)", name: "coverageAmount", type: "number", placeholder: "0" },
            { label: "Premium ($)", name: "premium", type: "number", placeholder: "0" },
            { label: "Contact Email", name: "contactEmail", type: "email", placeholder: "contact@example.com" },
            { label: "Contact Number", name: "contactNumber", type: "text", placeholder: "+1 (555) 123-4567" },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>

        {/* Image & Description */}
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Enter service description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-8 space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= Main Dashboard Component =================
const InsuranceDashboardManager = () => {
  const { role, isAdmin } = useContext(AuthContext);

  const [services, setServices] = useState([
    {
      _id: "1",
      serviceName: "Health Insurance Premium",
      providerName: "HealthCare Plus",
      coverageAmount: 100000,
      premium: 450,
      contactEmail: "contact@healthcareplus.com",
      contactNumber: "+1-555-0123",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      description: "Comprehensive health insurance coverage",
    },
    {
      _id: "2",
      serviceName: "Auto Insurance",
      providerName: "SafeDrive Insurance",
      coverageAmount: 50000,
      premium: 280,
      contactEmail: "support@safedrive.com",
      contactNumber: "+1-555-0456",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      description: "Complete auto insurance protection",
    },
    {
      _id: "3",
      serviceName: "Home Insurance",
      providerName: "SecureHome Ltd",
      coverageAmount: 250000,
      premium: 380,
      contactEmail: "info@securehome.com",
      contactNumber: "+1-555-0789",
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      description: "Protect your home and belongings",
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editService, setEditService] = useState(null);
  const limit = 6;

  // Filter services
  const filteredServices = services.filter(
    (service) =>
      service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      service.providerName.toLowerCase().includes(search.toLowerCase())
  );

  // Delete service
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this service?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        Swal.fire("Deleted!", "Service deleted successfully", "success");
      }
    });
  };

  // Save updated service
  const handleSave = (updatedService) => {
    setServices((prev) =>
      prev.map((s) => (s._id === updatedService._id ? updatedService : s))
    );
    Swal.fire("Updated!", "Service updated successfully", "success");
    setEditService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Insurance Services Dashboard</h1>
              <p className="text-blue-100 mt-2">
                Manage and monitor your insurance services with ease
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-200" />
                <span className="text-sm text-blue-200">Total Services</span>
              </div>
              <p className="text-2xl font-bold mt-1">{services.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-200" />
                <span className="text-sm text-blue-200">Active Providers</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {new Set(services.map((s) => s.providerName)).size}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-200" />
                <span className="text-sm text-blue-200">Avg Premium</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                $
                {Math.round(
                  services.reduce((acc, s) => acc + s.premium, 0) / services.length
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services or providers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Provider
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Coverage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Premium
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  {(isAdmin || role === "admin") && (
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredServices.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.imageUrl || "https://via.placeholder.com/50"}
                          alt={s.serviceName}
                          className="w-12 h-12 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{s.serviceName}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{s.providerName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ${s.coverageAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        ${s.premium}/month
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{s.contactEmail}</p>
                        <p className="text-gray-500">{s.contactNumber}</p>
                      </div>
                    </td>
                    {(isAdmin || role === "admin") && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditService(s)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                          >
                            <FiEdit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={s.imageUrl || "https://via.placeholder.com/400x200"}
                  alt={s.serviceName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800">
                    ${s.premium}/mo
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{s.serviceName}</h3>
                <p className="text-sm text-gray-600 mb-2">{s.providerName}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{s.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Coverage:</span>
                    <span className="font-semibold text-green-600">
                      ${s.coverageAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Contact:</span>
                    <span className="text-sm text-gray-900">{s.contactEmail}</span>
                  </div>
                </div>

                {(isAdmin || role === "admin") && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditService(s)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    >
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">{page}</span>
            <span className="text-gray-500">of {totalPages}</span>
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        {/* Edit Modal */}
        {editService && (
          <EditModal
            visible={!!editService}
            onClose={() => setEditService(null)}
            serviceData={editService}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default InsuranceDashboardManager;
