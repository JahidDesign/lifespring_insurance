import React, { useState, useEffect } from "react";
import { 
  Loader2, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Image, 
  Sparkles, Camera, Upload, Shield, Star, Users, Briefcase, Zap,
  Eye, Palette, Settings, Trophy, Heart, Target, Rocket, Globe,
  Lock, Gift, TrendingUp, Award, Crown, Diamond, Lightbulb,
  Building, Handshake, ThumbsUp, Coffee, Smartphone, Laptop
} from "lucide-react";

const defaultForm = {
  title: "",
  tagline: "",
  description: "",
  image: "",
  eventName: "",
  insuranceName: "",
  accent: "from-blue-600 to-cyan-600",
  icon: "Shield",
  stats: { clients: "", coverage: "", years: "" },
};

const slidesData = [
  { id: 1, title: "Content Creation", description: "Define your slide content and messaging", icon: "✍️" },
  { id: 2, title: "Design & Stats", description: "Customize appearance and add statistics", icon: "🎨" },
  { id: 3, title: "Preview & Submit", description: "Review and finalize your carousel slide", icon: "🚀" },
];

const accentOptions = [
  { value: "from-blue-600 to-cyan-600", name: "Ocean Breeze", color: "bg-gradient-to-r from-blue-600 to-cyan-600" },
  { value: "from-purple-600 to-pink-600", name: "Cosmic Purple", color: "bg-gradient-to-r from-purple-600 to-pink-600" },
  { value: "from-green-600 to-emerald-600", name: "Forest Green", color: "bg-gradient-to-r from-green-600 to-emerald-600" },
  { value: "from-orange-500 to-yellow-500", name: "Sunset Glow", color: "bg-gradient-to-r from-orange-500 to-yellow-500" },
  { value: "from-red-500 to-pink-500", name: "Cherry Blossom", color: "bg-gradient-to-r from-red-500 to-pink-500" },
  { value: "from-indigo-600 to-blue-600", name: "Deep Space", color: "bg-gradient-to-r from-indigo-600 to-blue-600" },
];

const iconOptions = [
  // Business & Professional
  { value: "Briefcase", name: "Briefcase", component: Briefcase, category: "business" },
  { value: "Building", name: "Building", component: Building, category: "business" },
  { value: "Handshake", name: "Handshake", component: Handshake, category: "business" },
  { value: "TrendingUp", name: "Growth", component: TrendingUp, category: "business" },
  
  // Achievement & Success
  { value: "Trophy", name: "Trophy", component: Trophy, category: "success" },
  { value: "Award", name: "Award", component: Award, category: "success" },
  { value: "Crown", name: "Crown", component: Crown, category: "success" },
  { value: "Diamond", name: "Diamond", component: Diamond, category: "success" },
  
  // Security & Trust
  { value: "Shield", name: "Shield", component: Shield, category: "security" },
  { value: "Lock", name: "Security", component: Lock, category: "security" },
  { value: "ThumbsUp", name: "Approved", component: ThumbsUp, category: "security" },
  
  // Innovation & Technology
  { value: "Lightbulb", name: "Innovation", component: Lightbulb, category: "tech" },
  { value: "Rocket", name: "Launch", component: Rocket, category: "tech" },
  { value: "Zap", name: "Power", component: Zap, category: "tech" },
  { value: "Smartphone", name: "Mobile", component: Smartphone, category: "tech" },
  { value: "Laptop", name: "Digital", component: Laptop, category: "tech" },
  
  // Community & Service
  { value: "Users", name: "Team", component: Users, category: "community" },
  { value: "Heart", name: "Care", component: Heart, category: "community" },
  { value: "Globe", name: "Global", component: Globe, category: "community" },
  { value: "Coffee", name: "Lifestyle", component: Coffee, category: "community" },
  
  // Quality & Excellence
  { value: "Star", name: "Quality", component: Star, category: "quality" },
  { value: "Sparkles", name: "Premium", component: Sparkles, category: "quality" },
  { value: "Target", name: "Precision", component: Target, category: "quality" },
  { value: "Gift", name: "Value", component: Gift, category: "quality" },
];

const iconCategories = {
  business: "Business & Professional",
  success: "Achievement & Success", 
  security: "Security & Trust",
  tech: "Innovation & Technology",
  community: "Community & Service",
  quality: "Quality & Excellence"
};

const HeroCarouselForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (form.image && form.image.startsWith('http')) {
      setImagePreview(form.image);
    }
  }, [form.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["clients", "coverage", "years"].includes(name)) {
      setForm({ ...form, stats: { ...form.stats, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 0) {
      if (!form.title.trim()) newErrors.title = "Title is required";
      if (!form.description.trim()) newErrors.description = "Description is required";
      if (!form.image.trim()) newErrors.image = "Image URL is required";
      else if (!form.image.match(/^https?:\/\/.+/)) newErrors.image = "Please enter a valid URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((s) => Math.min(slidesData.length - 1, s + 1));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const payload = {
        ...form,
        id: Date.now(),
        step: slidesData[currentStep].title,
        timestamp: new Date().toISOString(),
      };
      
      const res = await fetch("https://insurances-lmy8.onrender.com/HeroCarousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setSuccess(true);
      setForm(defaultForm);
      setErrors({});
      setCurrentStep(0);
      setImagePreview("");
      
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Submission error:", err);
      setErrors({ submit: "Failed to submit slide. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  const IconPreview = ({ className = "w-6 h-6 text-white" }) => {
    const IconComponent = iconOptions.find(opt => opt.value === form.icon)?.component || Shield;
    return <IconComponent className={className} />;
  };

  const ProgressBar = () => (
    <div className="w-full bg-white/10 rounded-full h-2 mb-8">
      <div 
        className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${((currentStep + 1) / slidesData.length) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-xl shadow-2xl border-b border-white/10">
        <div className="px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
            Carousel <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Builder</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Create stunning, professional carousel slides with advanced customization and real-time preview
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              {slidesData.map((slide, index) => (
                <div key={slide.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-white/10 text-white/40'
                  }`}>
                    <span className="text-xl">{slide.icon}</span>
                  </div>
                  {index < slidesData.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                      index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-12">
            
            {/* Step Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">{currentStep + 1}</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">{slidesData[currentStep].title}</h2>
              <p className="text-xl text-white/60 mb-6">{slidesData[currentStep].description}</p>
              <ProgressBar />
            </div>

            {/* Step 1 - Content */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-3">Slide Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter a compelling title..."
                        className={`w-full bg-white/10 border-2 ${errors.title ? 'border-red-500' : 'border-white/20'} px-6 py-4 rounded-2xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      />
                      {errors.title && <p className="text-red-400 text-sm mt-2">{errors.title}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-3">Tagline</label>
                      <input
                        type="text"
                        name="tagline"
                        value={form.tagline}
                        onChange={handleChange}
                        placeholder="Add a catchy tagline..."
                        className="w-full bg-white/10 border-2 border-white/20 px-6 py-4 rounded-2xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-3">Description *</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your slide content in detail..."
                        rows="4"
                        className={`w-full bg-white/10 border-2 ${errors.description ? 'border-red-500' : 'border-white/20'} px-6 py-4 rounded-2xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none`}
                      />
                      {errors.description && <p className="text-red-400 text-sm mt-2">{errors.description}</p>}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-3">Image URL *</label>
                      <div className="relative">
                        <input
                          type="url"
                          name="image"
                          value={form.image}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                          className={`w-full bg-white/10 border-2 ${errors.image ? 'border-red-500' : 'border-white/20'} px-6 py-4 pl-12 rounded-2xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                        />
                        <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      </div>
                      {errors.image && <p className="text-red-400 text-sm mt-2">{errors.image}</p>}
                    </div>
                    
                    {imagePreview && (
                      <div className="border-2 border-white/20 rounded-2xl overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                          onError={() => setImagePreview("")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Design & Stats */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-4">Accent Gradient</label>
                      <div className="grid grid-cols-2 gap-3">
                        {accentOptions.map((accent) => (
                          <button
                            key={accent.value}
                            onClick={() => setForm({ ...form, accent: accent.value })}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                              form.accent === accent.value 
                                ? 'border-white shadow-lg scale-105' 
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            <div className={`h-8 rounded-xl mb-2 ${accent.color}`}></div>
                            <p className="text-white text-sm font-medium">{accent.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-4">Icon Selection</label>
                      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {Object.entries(iconCategories).map(([categoryKey, categoryName]) => (
                          <div key={categoryKey}>
                            <h4 className="text-white/70 text-sm font-medium mb-3 uppercase tracking-wide">
                              {categoryName}
                            </h4>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                              {iconOptions.filter(icon => icon.category === categoryKey).map((icon) => {
                                const IconComponent = icon.component;
                                return (
                                  <button
                                    key={icon.value}
                                    onClick={() => setForm({ ...form, icon: icon.value })}
                                    className={`group p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                                      form.icon === icon.value 
                                        ? 'border-white shadow-lg bg-white/10 scale-105' 
                                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                    }`}
                                    title={icon.name}
                                  >
                                    <IconComponent className={`w-6 h-6 mx-auto mb-1 transition-colors duration-300 ${
                                      form.icon === icon.value ? 'text-white' : 'text-white/70 group-hover:text-white'
                                    }`} />
                                    <p className={`text-xs transition-colors duration-300 ${
                                      form.icon === icon.value ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                                    }`}>
                                      {icon.name}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-4">Statistics</label>
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="clients"
                          value={form.stats.clients}
                          onChange={handleChange}
                          placeholder="Number of clients (e.g., 500+)"
                          className="w-full bg-white/10 border-2 border-white/20 px-6 py-4 rounded-2xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="coverage"
                          value={form.stats.coverage}
                          onChange={handleChange}
                          placeholder="Coverage amount (e.g., $1M+)"
                          className="w-full bg-white/10 border-2 border-white/20 px-6 py-4 rounded-2xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-all duration-300"
                        />
                        <input
                          type="text"
                          name="years"
                          value={form.stats.years}
                          onChange={handleChange}
                          placeholder="Years of experience (e.g., 10+)"
                          className="w-full bg-white/10 border-2 border-white/20 px-6 py-4 rounded-2xl text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
                      <h4 className="text-white font-medium mb-4 flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Live Preview
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${form.accent} shadow-lg`}>
                          <IconPreview className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{form.tagline || "Your Tagline"}</h3>
                          <p className="text-white/70">
                            {form.stats.clients || "0"} Clients • 
                            {form.stats.coverage || "0"} Coverage • 
                            {form.stats.years || "0"} Years
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Review */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Content Details</h3>
                      <div className="space-y-3 text-white/80">
                        <p><span className="font-semibold text-white">Title:</span> {form.title || "No title provided"}</p>
                        <p><span className="font-semibold text-white">Tagline:</span> {form.tagline || "No tagline provided"}</p>
                        <p><span className="font-semibold text-white">Description:</span> {form.description || "No description provided"}</p>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Design & Statistics</h3>
                      <div className="space-y-3 text-white/80">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white">Accent:</span>
                          <div className={`w-20 h-6 rounded-lg bg-gradient-to-r ${form.accent}`}></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white">Icon:</span>
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${form.accent}`}>
                            <IconPreview className="w-5 h-5 text-white" />
                          </div>
                          <span>{form.icon}</span>
                        </div>
                        <p><span className="font-semibold text-white">Stats:</span> {form.stats.clients || "0"} Clients • {form.stats.coverage || "0"} Coverage • {form.stats.years || "0"} Years</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {form.image && (
                      <div className="bg-white/5 border border-white/20 rounded-2xl overflow-hidden">
                        <img 
                          src={form.image} 
                          alt="Final preview" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">JSON Preview</h3>
                      <pre className="text-xs text-white/70 bg-black/20 p-4 rounded-xl overflow-auto max-h-40">
                        {JSON.stringify({ ...form, id: "preview", timestamp: new Date().toISOString() }, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0 || loading}
                className="px-8 py-4 rounded-2xl bg-white/10 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Previous
              </button>
              
              {currentStep < slidesData.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center"
                >
                  Next <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Slide
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Messages */}
            {success && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 text-green-300 rounded-2xl backdrop-blur-xl animate-pulse">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                  <div>
                    <h4 className="font-semibold">Success!</h4>
                    <p>Your carousel slide has been submitted successfully!</p>
                  </div>
                </div>
              </div>
            )}
            
            {errors.submit && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500/50 text-red-300 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                  <div>
                    <h4 className="font-semibold">Submission Error</h4>
                    <p>{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarouselForm;