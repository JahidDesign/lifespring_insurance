import React, { useState } from "react";
import {
  CheckCircle,
  Loader2,
  Shield,
} from "lucide-react";

const AddPolicyForm = () => {
  const [policy, setPolicy] = useState({
    title: "",
    email: "",
    type: "",
    description: "",
    coverageAmount: "",
    premium: "",
    term: "",
    deductible: "",
    ageMin: "",
    ageMax: "",
    preExistingConditions: "",
    requirements: "",
    popularity: "",
    rating: "",
    benefits: "",
    addOns: "",
    image: "",
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
    else if (!/\S+@\S+\.\S+/.test(policy.email)) newErrors.email = "Email is invalid";
    if (!policy.type.trim()) newErrors.type = "Type is required";
    if (!policy.description.trim()) newErrors.description = "Description is required";
    if (!policy.coverageAmount || policy.coverageAmount <= 0)
      newErrors.coverageAmount = "Coverage amount must be greater than 0";
    if (!policy.premium || policy.premium <= 0)
      newErrors.premium = "Premium must be greater than 0";
    if (policy.rating && ![1,1.5,2,2.5,3,3.5,4,4.5,5].includes(Number(policy.rating)))
      newErrors.rating = "Rating must be 1, 1.5, 2 … 5";
    if (policy.ageMin && policy.ageMax && Number(policy.ageMin) > Number(policy.ageMax))
      newErrors.ageMax = "Maximum age must be greater than minimum age";
    if (policy.popularity && (policy.popularity < 0 || policy.popularity > 100))
      newErrors.popularity = "Popularity must be between 0 and 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const data = {
        ...policy,
        coverageAmount: Number(policy.coverageAmount),
        premium: Number(policy.premium),
        deductible: policy.deductible ? Number(policy.deductible) : 0,
        ageLimit: {
          min: policy.ageMin ? Number(policy.ageMin) : 0,
          max: policy.ageMax ? Number(policy.ageMax) : 100,
        },
        popularity: policy.popularity ? Number(policy.popularity) : 0,
        rating: policy.rating ? Number(policy.rating) : 0,
        benefits: policy.benefits
          ? policy.benefits.split(",").map((b) => b.trim())
          : [],
        addOns: policy.addOns
          ? policy.addOns.split(",").map((a) => a.trim())
          : [],
      };

      const response = await fetch("https://insurances-lmy8.onrender.com/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log("Policy created:", result);

      setSuccess(true);
      setPolicy({
        title: "",
        email: "",
        type: "",
        description: "",
        coverageAmount: "",
        premium: "",
        term: "",
        deductible: "",
        ageMin: "",
        ageMax: "",
        preExistingConditions: "",
        requirements: "",
        popularity: "",
        rating: "",
        benefits: "",
        addOns: "",
        image: "",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Failed to add policy. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ step, label, isActive, isCompleted }) => (
    <div
      className={`flex items-center gap-3 ${
        isActive
          ? "text-blue-600"
          : isCompleted
          ? "text-green-600"
          : "text-gray-400"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
          isActive
            ? "bg-blue-100 text-blue-600 ring-4 ring-blue-100"
            : isCompleted
            ? "bg-green-100 text-green-600"
            : "bg-gray-200 text-gray-400"
        }`}
      >
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <span className="font-semibold hidden md:block">{label}</span>
    </div>
  );

  const inputClass = (name) =>
    `w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none transition-all duration-200 ${
      errors[name]
        ? "border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-400"
        : "border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Create New Policy
          </h1>
          <p className="text-white text-lg mb-2 text-center">
            Design and configure your insurance policy with our intuitive form
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-8 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-white/50">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepIndicator
                  step={step.id}
                  label={step.label}
                  isActive={currentStep === step.id}
                  isCompleted={currentStep > step.id}
                />
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 ${
                      currentStep > step.id ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <form className="p-8 space-y-6">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={policy.title}
                  onChange={handleChange}
                  placeholder="Enter policy title (e.g. Life Secure Plus)"
                  className={inputClass("title")}
                />
                <input
                  type="email"
                  name="email"
                  value={policy.email}
                  onChange={handleChange}
                  placeholder="Enter contact email"
                  className={inputClass("email")}
                />
                {/* Insurance Type Dropdown */}
                <select
                  name="type"
                  value={policy.type}
                  onChange={handleChange}
                  className={inputClass("type")}
                >
                  <option value="">-- Select Insurance Type --</option>
                  <option value="Life">Life</option>
                  <option value="Health">Health</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Travel">Travel</option>
                  <option value="Home">Home</option>
                  <option value="Education">Education</option>
                  <option value="Pet">Pet</option>
                  <option value="Disability">Disability</option>
                  <option value="Business">Business</option>
                  <option value="Liability">Liability</option>
                </select>
                <textarea
                  name="description"
                  value={policy.description}
                  onChange={handleChange}
                  placeholder="Write a short description of the policy"
                  className={inputClass("description")}
                />
                <input
                  type="text"
                  name="image"
                  value={policy.image}
                  onChange={handleChange}
                  placeholder="Enter image URL (optional)"
                  className={inputClass("image")}
                />
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <input
                  type="number"
                  name="coverageAmount"
                  value={policy.coverageAmount}
                  onChange={handleChange}
                  placeholder="Enter coverage amount (e.g. 50000)"
                  className={inputClass("coverageAmount")}
                />
                <input
                  type="number"
                  name="premium"
                  value={policy.premium}
                  onChange={handleChange}
                  placeholder="Enter premium (e.g. 120)"
                  className={inputClass("premium")}
                />
                <input
                  type="number"
                  name="deductible"
                  value={policy.deductible}
                  onChange={handleChange}
                  placeholder="Enter deductible (e.g. 1000)"
                  className={inputClass("deductible")}
                />
                {/* Dropdown for term */}
                <select
                  name="term"
                  value={policy.term}
                  onChange={handleChange}
                  className={inputClass("term")}
                >
                  <option value="">-- Select Policy Term --</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                </select>
                <input
                  type="number"
                  name="ageMin"
                  value={policy.ageMin}
                  onChange={handleChange}
                  placeholder="Minimum eligible age (e.g. 18)"
                  className={inputClass("ageMin")}
                />
                <input
                  type="number"
                  name="ageMax"
                  value={policy.ageMax}
                  onChange={handleChange}
                  placeholder="Maximum eligible age (e.g. 65)"
                  className={inputClass("ageMax")}
                />
                <input
                  type="number"
                  name="popularity"
                  value={policy.popularity}
                  onChange={handleChange}
                  placeholder="Popularity (0–100)"
                  className={inputClass("popularity")}
                />
                {/* Rating Dropdown */}
                <select
                  name="rating"
                  value={policy.rating}
                  onChange={handleChange}
                  className={inputClass("rating")}
                >
                  <option value="">-- Select Rating --</option>
                  {[...Array(9)].map((_, i) => {
                    const val = (1 + i * 0.5).toFixed(1);
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="preExistingConditions"
                  value={policy.preExistingConditions}
                  onChange={handleChange}
                  placeholder="Pre-existing conditions covered (Yes/No)"
                  className={inputClass("preExistingConditions")}
                />
                <input
                  type="text"
                  name="requirements"
                  value={policy.requirements}
                  onChange={handleChange}
                  placeholder="Requirements (e.g. Medical checkup required)"
                  className={inputClass("requirements")}
                />
                <input
                  type="text"
                  name="benefits"
                  value={policy.benefits}
                  onChange={handleChange}
                  placeholder="List benefits (comma separated)"
                  className={inputClass("benefits")}
                />
                <input
                  type="text"
                  name="addOns"
                  value={policy.addOns}
                  onChange={handleChange}
                  placeholder="List add-ons (comma separated)"
                  className={inputClass("addOns")}
                />
              </div>
            )}

            {/* NAVIGATION */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 text-gray-800"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </button>
              )}
              {currentStep < steps.length ? (
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 text-white ml-auto"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 text-white ml-auto flex items-center gap-2"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Submit
                </button>
              )}
            </div>

            {/* GLOBAL ERRORS */}
            {errors.submit && (
              <p className="text-red-600 text-sm mt-4">{errors.submit}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm mt-4">
                ✅ Policy added successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPolicyForm;
