import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react";

const InsuranceCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const API_BASE = "https://insurances-lmy8.onrender.com/InsuranceCarousel";
  const MAX_RETRIES = 3;

  // Mock fallback data for demonstration and testing
  const mockFallbackSlides = [
    {
      _id: "demo_health_001",
      title: "Comprehensive Health Coverage",
      description: "Complete medical protection for you and your family with nationwide network coverage",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      eventName: "Health Fair 2025",
      insuranceName: "HealthShield Plus",
      id: 1001,
      insuranceType: "Get Quote"
    },
    {
      _id: "demo_auto_002", 
      title: "Premium Auto Insurance",
      description: "Drive with confidence - comprehensive auto coverage with 24/7 roadside assistance",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop",
      eventName: "Auto Expo 2025",
      insuranceName: "AutoGuard Pro",
      id: 1002,
      insuranceType: "Start Policy"
    },
    {
      _id: "demo_home_003",
      title: "Complete Home Protection", 
      description: "Safeguard your home and belongings with our comprehensive property insurance solutions",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=400&fit=crop",
      eventName: "Home & Property Fair",
      insuranceName: "HomeSecure",
      id: 1003,
      insuranceType: "Protect Now"
    },
    {
      _id: "demo_life_004",
      title: "Life Insurance Solutions",
      description: "Secure your family's financial future with flexible life insurance plans tailored to your needs",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop", 
      eventName: "Life Planning Summit",
      insuranceName: "LifeGuard",
      id: 1004,
      insuranceType: "Plan Future"
    }
  ];

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const res = await fetch(API_BASE, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("API endpoint not found. Please check if the server is running on localhost:3000");
        } else if (res.status >= 500) {
          throw new Error(`Server error (${res.status}). Please try again later`);
        } else if (res.status === 403) {
          throw new Error("Access denied. Please check API permissions");
        } else if (res.status === 401) {
          throw new Error("Authentication required. Please check API credentials");
        } else {
          throw new Error(`Request failed with status ${res.status}: ${res.statusText}`);
        }
      }
      
      const response = await res.json();
      
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response format received from server");
      }
      
      if (response.success === false) {
        throw new Error(response.message || response.error || "API returned an error");
      }
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("No valid data array found in response");
      }
      
      if (response.data.length === 0) {
        // Use fallback data when API returns empty
        console.log("API returned empty data, using fallback slides");
        setSlides(mockFallbackSlides);
        setError(null);
        setCurrent(0);
        setRetryCount(0);
        return;
      }
      
      // Validate slide data
      const validSlides = response.data.filter(slide => 
        slide && 
        typeof slide.title === 'string' && 
        typeof slide.description === 'string' &&
        slide.title.trim() && 
        slide.description.trim()
      );
      
      if (validSlides.length === 0) {
        // Use fallback data when no valid slides
        console.log("No valid slides from API, using fallback slides");
        setSlides(mockFallbackSlides);
        setError(null);
        setCurrent(0);
        setRetryCount(0);
        return;
      }
      
      setSlides(validSlides);
      setCurrent(0);
      setRetryCount(0);
      
    } catch (err) {
      console.error("Error loading carousel:", err);
      
      let errorMessage = "";
      let useFallback = false;
      
      if (err.name === 'AbortError') {
        errorMessage = "Request timed out. Please check your connection and try again";
        useFallback = true;
      } else if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch')) {
        errorMessage = "Unable to connect to server. Using offline demo data";
        useFallback = true;
      } else if (err.message.includes('localhost:3000')) {
        errorMessage = "API server not found. Showing demo insurance plans instead";
        useFallback = true;
      } else {
        errorMessage = err.message;
        useFallback = retryCount >= MAX_RETRIES - 1; // Use fallback after max retries
      }
      
      if (useFallback) {
        console.log("Using fallback data due to error:", err.message);
        setSlides(mockFallbackSlides);
        setError(`⚠️ ${errorMessage}`);
        setCurrent(0);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleRetry = async () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      await fetchSlides();
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || slides.length <= 1 || error) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length, current, error]);

  const handleTransition = (callback) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setTimeout(() => setIsTransitioning(false), 100);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning || slides.length <= 1) return;
    handleTransition(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    });
  };

  const nextSlide = () => {
    if (isTransitioning || slides.length <= 1) return;
    handleTransition(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    });
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === current || slides.length <= 1) return;
    handleTransition(() => {
      setCurrent(index);
    });
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleImageError = (slideIndex) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [slideIndex]: true
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (slides.length <= 1 || error) return;
      
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        toggleAutoplay();
      }
      if (e.key === 'r' || e.key === 'R') {
        if (error) handleRetry();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length, error, retryCount]);

  // Loading State
  if (loading) {
    return (
      <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100  overflow-hidden">
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-300 opacity-20"></div>
            </div>
            <p className="mt-6 text-blue-800 text-lg font-medium">Loading Insurance Plans</p>
            <p className="mt-2 text-blue-600 text-sm">Fetching data from server...</p>
            {retryCount > 0 && (
              <p className="mt-1 text-blue-500 text-xs">Attempt {retryCount + 1} of {MAX_RETRIES + 1}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error State (with fallback slides)
  if (error && slides.length === 0) {
    const isConnectionError = error.includes('connect') || error.includes('localhost') || error.includes('timed out');
    const canRetry = retryCount < MAX_RETRIES;
    
    return (
      <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl shadow-2xl overflow-hidden border-2 border-red-200">
        <div className="text-center py-16 px-8">
          <div className="mb-6">
            {isConnectionError ? (
              <WifiOff className="w-20 h-20 text-red-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-red-800 mb-4">
            {isConnectionError ? 'Connection Failed' : 'Error Loading Content'}
          </h3>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-6 border border-red-200">
            <p className="text-red-700 font-medium mb-2">Error Details:</p>
            <p className="text-red-600 text-sm leading-relaxed">{error}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {canRetry && (
              <button 
                onClick={handleRetry} 
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RefreshCw className="w-5 h-5" />
                Retry ({MAX_RETRIES - retryCount} attempts left)
              </button>
            )}
            
            <button 
              onClick={() => {
                setSlides(mockFallbackSlides);
                setError(null);
                setCurrent(0);
              }} 
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Wifi className="w-5 h-5" />
              View Demo Data
            </button>
            
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Page
            </button>
          </div>
          
          {isConnectionError && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-800 text-sm font-medium mb-2">💡 Troubleshooting Tips:</p>
              <ul className="text-blue-700 text-sm text-left space-y-1 max-w-md mx-auto">
                <li>• Ensure your server is running on localhost:3000</li>
                <li>• Check if the API endpoint '/InsuranceCarousel' exists</li>
                <li>• Verify CORS settings if running from different port</li>
                <li>• Try pressing 'R' key to retry quickly</li>
                <li>• Click "View Demo Data" to see sample insurance plans</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Empty State
  if (!slides.length) {
    return (
      <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="text-center py-20 px-8">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center mb-4">
              <Wifi className="w-12 h-12 text-gray-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">No Insurance Plans Available</h3>
          <p className="text-gray-600 mb-6">There are currently no insurance plans to display.</p>
          <button 
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[current];

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white  overflow-hidden border border-gray-100">
      {/* Main slide container */}
      <div className="relative h-[500px] overflow-hidden">
        <div 
          className={`absolute inset-0 transition-all duration-500 ${
            isTransitioning ? 'opacity-80 scale-105' : 'opacity-100 scale-100'
          }`}
        >
          {imageLoadErrors[current] ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <p className="text-xl font-semibold">Image Not Available</p>
                <p className="text-white/80 text-sm mt-1">Using default background</p>
              </div>
            </div>
          ) : (
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
              onError={() => handleImageError(current)}
            />
          )}
          
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <div className="max-w-2xl">
              {/* Insurance badges */}
              <div className="mb-6 flex flex-wrap gap-3">
                {currentSlide.insuranceName && (
                  <span className="inline-flex items-center px-4 py-2 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg">
                    🛡️ {currentSlide.insuranceName}
                  </span>
                )}
                {currentSlide.eventName && (
                  <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                    📅 {currentSlide.eventName}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                {currentSlide.title}
              </h1>
              
              <p className="text-xl text-white/95 mb-8 leading-relaxed font-medium">
                {currentSlide.description}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1">
                  <span className="relative z-10">
                    {currentSlide.insuranceType || 'Get Started'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button className="group bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 transform hover:-translate-y-1">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-blue-400/10 rounded-full blur-lg"></div>
        </div>
      </div>

      {/* Enhanced Navigation controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50 group backdrop-blur-sm hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50 group backdrop-blur-sm hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Auto-play control */}
          <button
            onClick={toggleAutoplay}
            className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm group hover:scale-105"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </>
      )}

      {/* Enhanced Bottom section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-100">
        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="flex justify-center gap-3 mb-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 hover:scale-125 ${
                  current === idx 
                    ? "w-10 bg-blue-600 shadow-lg" 
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Enhanced slide info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {slides.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">
                  {current + 1}
                </span>
                <span className="text-gray-500">/</span>
                <span className="text-gray-600">
                  {slides.length}
                </span>
              </div>
            )}
            
            {/* <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                ID: {currentSlide.id || currentSlide._id}
              </span>
              {currentSlide.insuranceType && (
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {currentSlide.insuranceType}
                </span>
              )}
            </div> */}
          </div>
          
          {slides.length > 1 && (
            <div className="flex items-center gap-4">
              {isPlaying && (
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
                      style={{
                        animation: 'progress 6s linear infinite',
                        animationPlayState: isTransitioning ? 'paused' : 'running'
                      }}
                    />
                  </div>
                </div>
              )}
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                {isPlaying ? (
                  <>
                    <Play className="w-4 h-4 text-green-500" />
                    Auto-playing
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-orange-500" />
                    Paused
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default InsuranceCarousel;