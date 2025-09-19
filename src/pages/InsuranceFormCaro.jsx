import React, { useState } from "react";
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Image, Sparkles, Camera, Upload } from "lucide-react";

const defaultForm = {
  title: "",
  description: "",
  image: "",
  eventName: "",
  insuranceName: "",
};

// Step definitions
const slidesData = [
  { id: 1, title: "Slide Info", description: "Enter slide details" },
  { id: 2, title: "Review & Submit", description: "Check details before submitting" },
];

const CarouselSliderForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Basic validation
    const required = ["title", "description", "image"];
    const newErrors = {};
    required.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/InsuranceCarousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: Date.now(), insuranceType: slidesData[currentStep].title }),
      });
      if (!res.ok) throw new Error("Failed to submit");

      setSuccess(true);
      setForm(defaultForm);
      setErrors({});
      setCurrentStep(0);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to submit. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Banner */}
      <div className="relative z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-6 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/20 backdrop-blur-xl p-4 rounded-full">
                <Sparkles className="w-12 h-12 text-white animate-spin" style={{animationDuration: '3s'}} />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Create Amazing
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Carousel Slides
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Design stunning carousel slides with our intuitive multi-step form. Perfect for showcasing your content with style.
          </p>
          
          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-16 right-12 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-12 left-16 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
            {/* Step Header with Glass Effect */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">{currentStep + 1}</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">{slidesData[currentStep].title}</h2>
              <p className="text-white/70 text-lg">{slidesData[currentStep].description}</p>
            </div>

            {/* Step Form */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="group">
                  <label className="block font-semibold mb-3 text-white flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                    Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className={`w-full bg-white/10 backdrop-blur-xl border border-white/30 px-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15 ${errors.title ? "border-red-400 ring-2 ring-red-400" : ""}`}
                      placeholder="Enter an engaging slide title..."
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.title && (
                    <div className="text-red-400 text-sm mt-2 flex items-center bg-red-500/10 p-2 rounded-lg">
                      <AlertTriangle size={14} className="mr-2" /> {errors.title}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block font-semibold mb-3 text-white flex items-center">
                    <Camera className="w-4 h-4 mr-2 text-green-400" />
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full bg-white/10 backdrop-blur-xl border border-white/30 px-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15 resize-none ${errors.description ? "border-red-400 ring-2 ring-red-400" : ""}`}
                      placeholder="Describe your slide content in detail..."
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.description && (
                    <div className="text-red-400 text-sm mt-2 flex items-center bg-red-500/10 p-2 rounded-lg">
                      <AlertTriangle size={14} className="mr-2" /> {errors.description}
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block font-semibold mb-3 text-white flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-pink-400" />
                    Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      className={`w-full bg-white/10 backdrop-blur-xl border border-white/30 px-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15 ${errors.image ? "border-red-400 ring-2 ring-red-400" : ""}`}
                      placeholder="https://example.com/your-amazing-image.jpg"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.image && (
                    <div className="text-red-400 text-sm mt-2 flex items-center bg-red-500/10 p-2 rounded-lg">
                      <AlertTriangle size={14} className="mr-2" /> {errors.image}
                    </div>
                  )}
                  
                  {/* Enhanced Image Preview */}
                  {form.image && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <Image size={16} className="mr-2 text-blue-400" />
                        <span className="text-white/80 font-medium">Live Preview</span>
                      </div>
                      <div className="relative group/image">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover/image:opacity-100 transition-opacity"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20">
                          <img 
                            src={form.image} 
                            alt="Slide preview" 
                            className="w-full h-72 object-cover rounded-xl shadow-2xl transform group-hover/image:scale-[1.02] transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-dashed border-white/30 items-center justify-center">
                            <div className="text-center text-white/60">
                              <Image size={48} className="mx-auto mb-3 opacity-50" />
                              <p className="text-lg">Unable to load image</p>
                              <p className="text-sm">Please check the URL</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block font-semibold mb-3 text-white">
                      Event Name <span className="text-white/50 font-normal text-sm">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="eventName"
                        value={form.eventName}
                        onChange={handleChange}
                        className="w-full bg-white/10 backdrop-blur-xl border border-white/30 px-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                        placeholder="Associated event name"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block font-semibold mb-3 text-white">
                      Insurance Name <span className="text-white/50 font-normal text-sm">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="insuranceName"
                        value={form.insuranceName}
                        onChange={handleChange}
                        className="w-full bg-white/10 backdrop-blur-xl border border-white/30 px-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                        placeholder="Associated insurance name"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <h3 className="font-bold text-2xl mb-6 text-white flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                  Review Your Masterpiece
                </h3>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-sm text-white/60 font-medium mb-1">Title:</p>
                      <p className="text-white text-lg font-semibold">{form.title || "Not provided"}</p>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-sm text-white/60 font-medium mb-1">Event Name:</p>
                      <p className="text-white">{form.eventName || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-sm text-white/60 font-medium mb-2">Description:</p>
                    <p className="text-white leading-relaxed">{form.description || "Not provided"}</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-sm text-white/60 font-medium mb-1">Insurance Name:</p>
                    <p className="text-white">{form.insuranceName || "Not provided"}</p>
                  </div>
                </div>
                
                {form.image && (
                  <div className="mt-8">
                    <p className="text-sm text-white/60 font-medium mb-4 flex items-center">
                      <Image className="w-4 h-4 mr-2" />
                      Final Image Preview:
                    </p>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
                      <div className="relative">
                        <img 
                          src={form.image} 
                          alt="Final slide preview" 
                          className="w-full h-80 object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.01] transition-transform duration-500" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Navigation */}
            <div className="flex justify-between mt-10">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0 || loading}
                className="group px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 transition-all duration-300 border border-white/30 backdrop-blur-xl"
              >
                <ArrowLeft size={18} className="text-white group-hover:text-blue-300 transition-colors" />
                <span className="text-white font-medium group-hover:text-blue-300 transition-colors">Previous</span>
              </button>

              {currentStep < slidesData.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="font-medium">Next Step</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-500 text-white flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle size={18} className="group-hover:rotate-12 transition-transform" />
                  )}
                  <span className="font-medium">{loading ? "Creating Magic..." : "Launch Slide"}</span>
                </button>
              )}
            </div>

            {/* Enhanced Messages */}
            {success && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl text-green-300 flex items-center shadow-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-green-500/30 rounded-full mr-4">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold">Success!</h4>
                  <p>Your amazing slide has been created successfully!</p>
                </div>
              </div>
            )}
            
            {errors.submit && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl text-red-300 flex items-center shadow-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-red-500/30 rounded-full mr-4">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold">Oops!</h4>
                  <p>{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Enhanced Progress Indicator */}
            <div className="mt-8 flex justify-center items-center space-x-4">
              {slidesData.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
                    index === currentStep 
                      ? "bg-gradient-to-r from-blue-400 to-purple-500 scale-125 shadow-lg" 
                      : index < currentStep 
                        ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                        : "bg-white/30"
                  }`}>
                    {index === currentStep && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping opacity-75"></div>
                    )}
                  </div>
                  {index < slidesData.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 transition-colors duration-500 ${
                      index < currentStep ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-white/30"
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CarouselSliderForm;