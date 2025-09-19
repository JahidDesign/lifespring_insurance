import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

// ✅ Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          {title}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </h2>
        {children}
      </div>
    </div>
  );
};

const InsuranceServicesList = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: "",
    providerName: "",
    coverageAmount: "",
    premium: "",
    contactEmail: "",
    contactNumber: "",
    imageUrl: "",
    description: "",
  });

  const itemsPerPage = 5;

  // ✅ Fetch services
  const fetchServices = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/insuranceservices");
      if (res.data && res.data.services) {
        setServices(res.data.services);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      Swal.fire("Error!", "Failed to fetch services from server.", "error");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ✅ Filtered Data with optional chaining
  const filteredServices = useMemo(() => {
    return services.filter(
      (s) =>
        (s.serviceName || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.providerName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://insurances-lmy8.onrender.com/insuranceservices/${id}`);
        Swal.fire("Deleted!", "Service has been deleted.", "success");
        fetchServices();
      } catch (error) {
        console.error("Error deleting:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  // ✅ Handle Form Submit (Create/Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `https://insurances-lmy8.onrender.com/insuranceservices/${formData._id}`,
          formData
        );
        Swal.fire("Updated!", "Service updated successfully.", "success");
      } else {
        await axios.post("https://insurances-lmy8.onrender.com/insuranceservices", formData);
        Swal.fire("Created!", "New service added successfully.", "success");
      }
      fetchServices();
      setIsFormModalOpen(false);
      setFormData({
        serviceName: "",
        providerName: "",
        coverageAmount: "",
        premium: "",
        contactEmail: "",
        contactNumber: "",
        imageUrl: "",
        description: "",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving service:", error);
      Swal.fire("Error!", "Failed to save service.", "error");
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (service) => {
    setFormData(service);
    setEditMode(true);
    setIsFormModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Insurance Services</h1>
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" size={18} /> Add Service
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search by name or provider..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Service Name</th>
              <th className="p-3 text-left">Provider</th>
              <th className="p-3 text-left">Premium</th>
              <th className="p-3 text-left">Coverage</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.map((service) => (
              <tr key={service._id} className="border-t">
                <td className="p-3">
                  <img
                    src={service.imageUrl || ""}
                    alt={service.serviceName || ""}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>
                <td className="p-3 font-semibold">{service.serviceName || "-"}</td>
                <td className="p-3">{service.providerName || "-"}</td>
                <td className="p-3">${service.premium || 0}</td>
                <td className="p-3">${service.coverageAmount || 0}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setIsDetailsModalOpen(true);
                    }}
                    className="p-2 bg-green-100 rounded hover:bg-green-200"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 bg-yellow-100 rounded hover:bg-yellow-200"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 bg-red-100 rounded hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Service Details"
      >
        {selectedService && (
          <div>
            <img
              src={selectedService.imageUrl || ""}
              alt={selectedService.serviceName || ""}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-bold mb-2">
              {selectedService.serviceName || "-"}
            </h3>
            <p className="mb-2">{selectedService.description || "-"}</p>
            <p className="text-sm text-gray-600">Provider: {selectedService.providerName || "-"}</p>
            <p className="text-sm text-gray-600">Coverage: ${selectedService.coverageAmount || 0}</p>
            <p className="text-sm text-gray-600">Premium: ${selectedService.premium || 0}</p>
            <p className="text-sm text-gray-600">Email: {selectedService.contactEmail || "-"}</p>
            <p className="text-sm text-gray-600">Phone: {selectedService.contactNumber || "-"}</p>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editMode ? "Edit Service" : "Add Service"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Service Name"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Provider Name"
            value={formData.providerName}
            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Coverage Amount"
            value={formData.coverageAmount}
            onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Premium"
            value={formData.premium}
            onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            placeholder="Contact Email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border p-2 rounded w-full"
            rows="3"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            {editMode ? "Update" : "Create"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default InsuranceServicesList;
