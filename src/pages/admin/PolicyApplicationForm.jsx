import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PolicyApplicationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    minAge: "",
    maxAge: "",
    coverage: "",
    duration: "",
    baseRate: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://insurances-lmy8.onrender.com/policiesuser", formData);
      Swal.fire({
        icon: "success",
        title: "Policy Submitted",
        text: "The insurance policy has been added successfully!",
        confirmButtonColor: "#2563EB",
      });

      // Reset form after success
      setFormData({
        title: "",
        category: "",
        description: "",
        minAge: "",
        maxAge: "",
        coverage: "",
        duration: "",
        baseRate: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong while submitting the policy.",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold text-black mb-6">Add New Insurance Policy</h2>
      <form onSubmit={handleSubmit} className="space-y-5 text-black">

        <input
          type="text"
          name="title"
          placeholder="Policy Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
          required
        >
          <option value="">Select Category</option>
          <option value="Term Life">Term Life</option>
          <option value="Senior">Senior</option>
          <option value="Whole Life">Whole Life</option>
          <option value="Child Plan">Child Plan</option>
        </select>

        <textarea
          name="description"
          placeholder="Policy Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
          required
        />

        <div className="flex gap-4">
          <input
            type="number"
            name="minAge"
            placeholder="Minimum Age"
            value={formData.minAge}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
            required
          />
          <input
            type="number"
            name="maxAge"
            placeholder="Maximum Age"
            value={formData.maxAge}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
            required
          />
        </div>

        <input
          type="text"
          name="coverage"
          placeholder="Coverage Range (e.g., $10,000 - $100,000)"
          value={formData.coverage}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
          required
        />

        <input
          type="text"
          name="duration"
          placeholder="Duration Options (e.g., 10/20/30 years)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
          required
        />

        <input
          type="number"
          name="baseRate"
          placeholder="Base Premium Rate"
          value={formData.baseRate}
          onChange={handleChange}
          className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-xl"
          required
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL (e.g., https://example.com/photo.jpg)"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-xl"
        />

        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="h-40 object-cover rounded-xl shadow-md"
            onError={(e) => {
              e.target.src = "";
              e.target.alt = "Invalid Image URL";
            }}
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
        >
          Submit Policy
        </button>
      </form>
    </div>
  );
};

export default PolicyApplicationForm;
