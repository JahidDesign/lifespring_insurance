import React, { useState } from "react";
import { CheckCircle, Loader2, Shield } from "lucide-react";

// Dynamically load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const AddPolicyForm = () => {
  const [policy, setPolicy] = useState({
    title: "", email: "", type: "", description: "", coverageAmount: "",
    premium: "", term: "", deductible: "", ageMin: "", ageMax: "",
    preExistingConditions: "", requirements: "", popularity: "", rating: "",
    benefits: "", addOns: "", image: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: "Basic Info" },
    { id: 2, label: "Coverage" },
    { id: 3, label: "Details" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicy({ ...policy, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    setSuccess(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!policy.title.trim()) newErrors.title = "Title is required";
    if (!policy.email.trim()) newErrors.email = "Email is required";
    if (!policy.type.trim()) newErrors.type = "Type is required";
    if (!policy.description.trim()) newErrors.description = "Description is required";
    if (!policy.coverageAmount || policy.coverageAmount <= 0) newErrors.coverageAmount = "Coverage amount must be greater than 0";
    if (!policy.premium || policy.premium <= 0) newErrors.premium = "Premium must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (amount) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const order = await fetch("https://insurances-lmy8.onrender.com/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }), // Convert to paise
    }).then((res) => res.json());

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: order.amount,
      currency: order.currency,
      name: "Insurance Policy Payment",
      description: "Policy Purchase",
      order_id: order.id,
      prefill: { email: policy.email },
      handler: function (response) {
        alert("Payment Successful!");
        console.log(response);
      },
      modal: {
        ondismiss: function () {
          alert("Payment Cancelled");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = { ...policy };
      const res = await fetch("https://insurances-lmy8.onrender.com/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      setSuccess(true);
      await handlePayment(Number(policy.premium)); // Pay the premium amount

      setPolicy({
        title: "", email: "", type: "", description: "", coverageAmount: "",
        premium: "", term: "", deductible: "", ageMin: "", ageMax: "",
        preExistingConditions: "", requirements: "", popularity: "", rating: "",
        benefits: "", addOns: "", image: "",
      });
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to add policy or payment." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-blue-50">
      <h1 className="text-3xl font-bold mb-6">Add Insurance Policy</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Step 1 - Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-2">
            <input type="text" name="title" value={policy.title} onChange={handleChange} placeholder="Title" />
            <input type="email" name="email" value={policy.email} onChange={handleChange} placeholder="Email" />
            <select name="type" value={policy.type} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="Life">Life</option>
              <option value="Health">Health</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Travel">Travel</option>
              <option value="Home">Home</option>
            </select>
            <textarea name="description" value={policy.description} onChange={handleChange} placeholder="Description" />
          </div>
        )}

        {/* Step 2 - Coverage */}
        {currentStep === 2 && (
          <div className="space-y-2">
            <input type="number" name="coverageAmount" value={policy.coverageAmount} onChange={handleChange} placeholder="Coverage Amount" />
            <input type="number" name="premium" value={policy.premium} onChange={handleChange} placeholder="Premium Amount" />
            <input type="number" name="deductible" value={policy.deductible} onChange={handleChange} placeholder="Deductible" />
          </div>
        )}

        {/* Step 3 - Details */}
        {currentStep === 3 && (
          <div className="space-y-2">
            <input type="text" name="benefits" value={policy.benefits} onChange={handleChange} placeholder="Benefits" />
            <input type="text" name="addOns" value={policy.addOns} onChange={handleChange} placeholder="Add-ons" />
          </div>
        )}

        <div className="flex justify-between">
          {currentStep > 1 && <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
          {currentStep < 3 && <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}
          {currentStep === 3 && (
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit & Pay"}
            </button>
          )}
        </div>

        {errors.submit && <p className="text-red-600">{errors.submit}</p>}
        {success && <p className="text-green-600">Policy added successfully!</p>}
      </form>
    </div>
  );
};

export default AddPolicyForm;

