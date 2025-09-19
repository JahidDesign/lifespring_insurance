import React, { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Star,
  DollarSign,
  Users,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2
} from "lucide-react";

// Reusable Add/Edit Form
const PolicyForm = ({ onSubmit, initialData, onClose }) => {
  const [policy, setPolicy] = useState(
    initialData || {
      title: "",
      type: "",
      description: "",
      coverageAmount: "",
      premium: "",
      term: "",
      ageMin: "",
      ageMax: "",
      popularity: "",
      rating: "",
      preExistingConditions: "",
      benefits: "",
      addOns: "",
      image: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicy({ ...policy, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!policy.title.trim()) newErrors.title = "Title required";
    if (!policy.type.trim()) newErrors.type = "Type required";
    if (!policy.description.trim()) newErrors.description = "Description required";
    if (!policy.coverageAmount || policy.coverageAmount <= 0)
      newErrors.coverageAmount = "Coverage must be > 0";
    if (!policy.premium || policy.premium <= 0)
      newErrors.premium = "Premium must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const data = {
        ...policy,
        coverageAmount: Number(policy.coverageAmount),
        premium: Number(policy.premium),
        ageMin: Number(policy.ageMin),
        ageMax: Number(policy.ageMax),
        popularity: Number(policy.popularity || 0),
        rating: Number(policy.rating || 0),
        benefits: policy.benefits
          ? policy.benefits.split(",").map((b) => b.trim())
          : [],
        addOns: policy.addOns
          ? policy.addOns.split(",").map((a) => a.trim())
          : [],
      };
      await onSubmit(data);
      setPolicy({
        title: "",
        type: "",
        description: "",
        coverageAmount: "",
        premium: "",
        term: "",
        ageMin: "",
        ageMax: "",
        popularity: "",
        rating: "",
        preExistingConditions: "",
        benefits: "",
        addOns: "",
        image: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-200 hover:bg-red-300"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? "Edit Policy" : "Add New Policy"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="title" value={policy.title} onChange={handleChange} placeholder="Policy Title" className="w-full px-4 py-2 border rounded-lg"/>
          <select name="type" value={policy.type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
            <option value="">-- Select Type --</option>
            <option value="Life">Life</option>
            <option value="Health">Health</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Travel">Travel</option>
            <option value="Home">Home</option>
          </select>
          <textarea name="description" value={policy.description} onChange={handleChange} placeholder="Description" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="number" name="coverageAmount" value={policy.coverageAmount} onChange={handleChange} placeholder="Coverage Amount" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="number" name="premium" value={policy.premium} onChange={handleChange} placeholder="Premium" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="text" name="term" value={policy.term} onChange={handleChange} placeholder="Term (e.g. 1 Year)" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="number" name="ageMin" value={policy.ageMin} onChange={handleChange} placeholder="Minimum Age" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="number" name="ageMax" value={policy.ageMax} onChange={handleChange} placeholder="Maximum Age" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="number" name="popularity" value={policy.popularity} onChange={handleChange} placeholder="Popularity (0-100)" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="number" name="rating" value={policy.rating} onChange={handleChange} placeholder="Rating (1-5)" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="text" name="preExistingConditions" value={policy.preExistingConditions} onChange={handleChange} placeholder="Pre-existing Conditions (comma separated)" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="text" name="benefits" value={policy.benefits} onChange={handleChange} placeholder="Benefits (comma separated)" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="text" name="addOns" value={policy.addOns} onChange={handleChange} placeholder="Add-Ons (comma separated)" className="w-full px-4 py-2 border rounded-lg"/>
          <input type="text" name="image" value={policy.image} onChange={handleChange} placeholder="Image URL" className="w-full px-4 py-2 border rounded-lg"/>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg flex justify-center items-center gap-2">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {initialData ? "Update Policy" : "Add Policy"}
          </button>
        </form>
      </div>
    </div>
  );
};

const PolicyManagementTable = () => {
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editPolicy, setEditPolicy] = useState(null);

  // Fetch policies from API
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/policies");
        const data = await res.json();
        setPolicies(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter((p) => {
    const matchesType = filterType === "All" || p.type === filterType;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await fetch(`https://insurances-lmy8.onrender.com/policies/${id}`, { method: "DELETE" });
        setPolicies(policies.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (data) => {
    if (editPolicy) {
      try {
        await fetch(`https://insurances-lmy8.onrender.com/policies/${editPolicy._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        setPolicies(
          policies.map((p) => (p._id === editPolicy._id ? { ...p, ...data } : p))
        );
        setEditPolicy(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/policies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const newPolicy = await res.json();
        setPolicies([...policies, newPolicy]);
      } catch (err) {
        console.error(err);
      }
    }
    setFormOpen(false);
  };

  const handleEdit = (policy) => {
    setEditPolicy(policy);
    setFormOpen(true);
  };

  const handleView = (policy) => setSelectedPolicy(policy);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" /> Policy Management
        </h1>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Add Policy
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="All">All Types</option>
            <option value="Health">Health</option>
            <option value="Life">Life</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Travel">Travel</option>
            <option value="Home">Home</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Coverage</th>
              <th className="p-3 border">Premium</th>
              <th className="p-3 border">Rating</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((policy) => (
              <tr key={policy._id} className="hover:bg-gray-50">
                <td className="p-3 border">{policy.title}</td>
                <td className="p-3 border">{policy.type}</td>
                <td className="p-3 border">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  {policy.coverageAmount}
                </td>
                <td className="p-3 border">{policy.premium}</td>
                <td className="p-3 border">
                  <Star className="inline w-4 h-4 text-yellow-500 mr-1" />
                  {policy.rating}
                </td>
                <td className="p-3 border flex gap-2">
                  <button onClick={() => handleView(policy)} className="p-2 bg-blue-200 rounded hover:bg-blue-300">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(policy)} className="p-2 bg-yellow-200 rounded hover:bg-yellow-300">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(policy._id)} className="p-2 bg-red-200 rounded hover:bg-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPolicies.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No policies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Big View Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-auto p-6 relative">
            <button
              onClick={() => setSelectedPolicy(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-red-200 hover:bg-red-300"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedPolicy.image} alt={selectedPolicy.title} className="w-full h-64 object-cover rounded-lg mb-4"/>
            <h2 className="text-2xl font-bold mb-2">{selectedPolicy.title}</h2>
            <p className="text-gray-700 mb-2">{selectedPolicy.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <p><Users className="inline w-4 h-4 mr-1" /> Age: {selectedPolicy.ageMin}-{selectedPolicy.ageMax}</p>
              <p><DollarSign className="inline w-4 h-4 mr-1" /> Coverage: ${selectedPolicy.coverageAmount}</p>
              <p><Calendar className="inline w-4 h-4 mr-1" /> Term: {selectedPolicy.term}</p>
              <p><Star className="inline w-4 h-4 mr-1 text-yellow-500" /> Rating: {selectedPolicy.rating}</p>
              <p><CheckCircle className="inline w-4 h-4 mr-1 text-green-500" /> Popularity: {selectedPolicy.popularity}%</p>
              <p><AlertTriangle className="inline w-4 h-4 mr-1 text-red-500" /> Pre-existing: {selectedPolicy.preExistingConditions || "None"}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Benefits:</h3>
              <ul className="list-disc list-inside">{selectedPolicy.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Add-Ons:</h3>
              <ul className="list-disc list-inside">{selectedPolicy.addOns.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {formOpen && (
        <PolicyForm
          onSubmit={handleFormSubmit}
          initialData={editPolicy}
          onClose={() => { setFormOpen(false); setEditPolicy(null); }}
        />
      )}
    </div>
  );
};

export default PolicyManagementTable;
