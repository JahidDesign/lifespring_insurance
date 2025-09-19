import React, { useState } from "react";
import { Shield, Building, DollarSign, Mail, Phone, Image, FileText, Check, AlertCircle } from "lucide-react";

const InsuranceServiceForm = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/insuranceservices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showNotification("success", "Insurance service added successfully! 🎉");
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
      } else {
        showNotification("error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      showNotification("error", "Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { name: "serviceName", placeholder: "Service Name", icon: Shield, type: "text", required: true },
    { name: "providerName", placeholder: "Provider Name", icon: Building, type: "text", required: true },
    { name: "coverageAmount", placeholder: "Coverage Amount ($)", icon: DollarSign, type: "number" },
    { name: "premium", placeholder: "Monthly Premium ($)", icon: DollarSign, type: "number" },
    { name: "contactEmail", placeholder: "Contact Email", icon: Mail, type: "email" },
    { name: "contactNumber", placeholder: "Contact Number", icon: Phone, type: "tel" },
    { name: "imageUrl", placeholder: "Image URL", icon: Image, type: "url" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg backdrop-blur-md border transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500/90 border-green-400 text-white' 
            : 'bg-red-500/90 border-red-400 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="relative max-w-4xl mx-auto">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          {/* Banner Background */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-16 md:py-24">
            {/* Animated Background Patterns */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute animate-pulse top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute animate-pulse delay-1000 top-32 right-20 w-16 h-16 bg-blue-300/30 rounded-full blur-lg"></div>
                <div className="absolute animate-pulse delay-500 bottom-20 left-32 w-24 h-24 bg-purple-300/25 rounded-full blur-xl"></div>
                <div className="absolute animate-pulse delay-700 bottom-32 right-16 w-12 h-12 bg-indigo-300/40 rounded-full blur-md"></div>
              </div>
              {/* Grid Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            {/* Banner Content */}
            <div className="relative z-10 text-center">
              {/* Icon with Animation */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-8 animate-bounce">
                <Shield className="text-white" size={40} />
              </div>
              
              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Insurance Service
                <span className="block text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-2">
                  Management Hub
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-blue-100 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
                Create comprehensive insurance service listings with modern tools designed for 
                <span className="text-yellow-300 font-semibold"> efficiency</span> and 
                <span className="text-yellow-300 font-semibold"> excellence</span>
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['Secure', 'Fast Setup', 'Real-time Preview', 'Professional'].map((feature, index) => (
                  <div 
                    key={feature}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    ✨ {feature}
                  </div>
                ))}
              </div>
              
              {/* CTA Arrow */}
              <div className="animate-bounce mt-8">
                <div className="w-8 h-8 mx-auto border-2 border-white/60 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 border-r-2 border-b-2 border-white/80 transform rotate-45 -translate-y-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full"></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="space-y-8">
            {/* Grid Layout for Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {field.name.replace(/([A-Z])/g, ' $1').trim()}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Image Preview</label>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={formData.imageUrl}
                    alt="Service preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='.3em' fill='%236b7280'%3EImage not found%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <FileText className="inline mr-2" size={16} />
                Description
              </label>
              <textarea
                name="description"
                placeholder="Provide a detailed description of the insurance service, including key benefits, coverage details, and any special features..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Shield size={20} />
                    <span>Add Insurance Service</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Secure • Fast • Reliable Insurance Service Management</p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceServiceForm;

