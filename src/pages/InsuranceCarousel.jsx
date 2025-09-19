import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";

const InsuranceCarousel = () => {
  const [insuranceData, setInsuranceData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch data from your API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://insurances-lmy8.onrender.com/InsuranceCarousel");
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          // Enhance the data with demo items
          const enhancedData = [
            ...data.data,
            {
              _id: "68a2e6b74b670d10ebbbc8e4",
              title: "Life Insurance Premium",
              description:
                "Secure your family's future with comprehensive life coverage",
              image:
                "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop",
              eventName: "Insurance Expo 2025",
              insuranceName: "LifeSecure",
              id: 1755506355941,
              insuranceType: "Premium Coverage",
            },
            {
              _id: "68a2e6b74b670d10ebbbc8e5",
              title: "Auto Insurance Elite",
              description:
                "Complete protection for your vehicle with 24/7 support",
              image:
                "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
              eventName: "Insurance Expo 2025",
              insuranceName: "AutoGuard Pro",
              id: 1755506355942,
              insuranceType: "Comprehensive",
            },
          ];
          setInsuranceData(enhancedData);
        } else {
          console.error("API response format error:", data);
          setInsuranceData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching insurance data:", error);

        // Fallback data
        const fallbackData = [
          {
            _id: "68a2e6b74b670d10ebbbc8e3",
            title: "Health Insurance Plan",
            description: "Protect yourself and your family",
            image:
              "https://i.ibb.co.com/dsMzzTLJ/top-header-protection.png",
            eventName: "Insurance Expo 2025",
            insuranceName: "HealthGuard",
            id: 1755506355940,
            insuranceType: "Review & Submit",
          },
        ];
        setInsuranceData(fallbackData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextSlide = () => {
    if (isAnimating || insuranceData.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % insuranceData.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || insuranceData.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prev) => (prev - 1 + insuranceData.length) % insuranceData.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-96 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!insuranceData.length) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 rounded-3xl p-8 text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Insurance Plans Available</h3>
          <p className="opacity-75">
            Please check back later for available insurance options.
          </p>
        </div>
      </div>
    );
  }

  const currentItem = insuranceData[currentIndex];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Insurance Solutions
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover comprehensive protection plans tailored to your needs
        </p>
      </div>

      {/* Main Carousel */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>

        {/* Content */}
        <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase">
                {currentItem.eventName || "Upcoming Event"}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {currentItem.title}
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              {currentItem.description}
            </p>

            <div className="flex items-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span className="text-sm">
                  {currentItem.insuranceName || "Insurance"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">
                  {currentItem.insuranceType || "Standard"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                <span>Get Quote</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-gray-400 text-sm">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-gray-400 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Premium Plan
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-pink-500 to-red-600 rounded-full blur-2xl opacity-20"></div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-20"
          disabled={isAnimating}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-3 mt-8">
        {insuranceData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gradient-to-r from-blue-600 to-purple-600 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Get Protected?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us with their
          insurance needs. Get a personalized quote in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Get Free Quote
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300">
            Compare Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCarousel;
