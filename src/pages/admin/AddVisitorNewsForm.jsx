// File: AddVisitorForm.jsx
import { useState } from "react";
import Swal from "sweetalert2";

const AddVisitorForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    createdAt: "",
  });

  const [step, setStep] = useState(1); // Step 1 = Form, Step 2 = Preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://insurances-lmy8.onrender.com/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("✅ Success!", "Visitor added successfully!", "success");
        setFormData({
          title: "",
          description: "",
          image: "",
          link: "",
          createdAt: "",
        });
        setStep(1);
      } else {
        Swal.fire("❌ Error!", data.error || "Something went wrong", "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("⚠️ Error!", "Network error or server issue", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl mt-10 text-black">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {step === 1 ? (
          <>
            Add New <span className="text-blue-600">Visitor</span>
          </>
        ) : (
          <>
            Preview <span className="text-green-600">Visitor</span>
          </>
        )}
      </h2>

      {/* STEP 1 - Fill Form */}
      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            name="link"
            placeholder="Link"
            value={formData.link}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Next: Preview
          </button>
        </form>
      )}

      {/* STEP 2 - Preview */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold">{formData.title}</h3>
            <p className="text-gray-600">{formData.description}</p>
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg mt-3"
              />
            )}
            <p className="mt-2">
              <strong>Link:</strong>{" "}
              <a
                href={formData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {formData.link}
              </a>
            </p>
            <p>
              <strong>Date:</strong> {formData.createdAt}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVisitorForm;
