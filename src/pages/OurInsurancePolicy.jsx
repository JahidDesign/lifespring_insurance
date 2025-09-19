// src/components/AdminDashboard.jsx
import React, { useState } from "react";

const steps = ["Basic Info", "Coverage & Premium", "Contact & Description", "Quote Estimator"];

const ourInsurancePolice = ({ role = "admin" }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    serviceName: "",
    providerName: "",
    coverageAmount: "",
    premium: "",
    contactEmail: "",
    contactNumber: "",
    imageUrl: "",
    description: "",
    age: "",
    gender: "male",
    duration: "",
    smoker: "no",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [estimatedPremium, setEstimatedPremium] = useState({ monthly: 0, annual: 0 });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 0, 0));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuote = () => {
    const { age, coverageAmount, duration, smoker, gender } = formData;
    if (!age || !coverageAmount || !duration || !smoker || !gender) {
      setError("Fill all quote fields");
      return;
    }
    setError("");
    let baseRate = 0.02;
    if (parseInt(age) > 40) baseRate += 0.01;
    if (smoker === "yes") baseRate += 0.01;
    if (gender === "male") baseRate += 0.005;

    const annual = parseFloat(coverageAmount) * baseRate;
    const monthly = annual / 12;

    setEstimatedPremium({ monthly: monthly.toFixed(2), annual: annual.toFixed(2) });
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    // Validate all fields
    for (let key in formData) {
      if (!formData[key]) {
        setError(`Please fill ${key}`);
        return;
      }
    }

    try {
      const response = await fetch("https://insurances-lmy8.onrender.com/ourInsurancePolice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, estimatedPremium }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Service created successfully!");
        setFormData({
          serviceName: "",
          providerName: "",
          coverageAmount: "",
          premium: "",
          contactEmail: "",
          contactNumber: "",
          imageUrl: "",
          description: "",
          age: "",
          gender: "male",
          duration: "",
          smoker: "no",
        });
        setEstimatedPremium({ monthly: 0, annual: 0 });
        setStep(0);
      } else {
        setError(data.message || "Failed to create service");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <input type="text" name="serviceName" placeholder="Service Name" value={formData.serviceName} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="providerName" placeholder="Provider Name" value={formData.providerName} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <input type="number" name="coverageAmount" placeholder="Coverage Amount" value={formData.coverageAmount} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="number" name="premium" placeholder="Premium" value={formData.premium} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <input type="email" name="contactEmail" placeholder="Contact Email" value={formData.contactEmail} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input type="number" name="duration" placeholder="Duration (years)" value={formData.duration} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <select name="smoker" value={formData.smoker} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="no">Non-Smoker</option>
              <option value="yes">Smoker</option>
            </select>
            <button onClick={handleQuote} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Calculate Quote</button>
            {estimatedPremium.monthly > 0 && (
              <p className="mt-2 text-green-600">Monthly: ${estimatedPremium.monthly}, Annual: ${estimatedPremium.annual}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="bg-blue-600 text-white rounded-lg p-6 mb-6 shadow">
          <h1 className="text-2xl font-bold">Add Insurance Service</h1>
          <p className="mt-2">Fill the details step by step and calculate premium before submitting.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between mb-6">
            {steps.map((label, index) => (
              <div key={index} className="flex-1 text-center relative">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= index ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}>{index + 1}</div>
                <p className="mt-2 text-sm">{label}</p>
              </div>
            ))}
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-6">
            {step > 0 && <button onClick={prevStep} className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Previous</button>}
            {step < steps.length - 1 ? (
              <button onClick={nextStep} className="ml-auto px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</button>
            ) : (
              <button onClick={handleSubmit} className="ml-auto px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Submit</button>
            )}
          </div>

          {message && <p className="mt-4 text-green-600">{message}</p>}
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ourInsurancePolice;
