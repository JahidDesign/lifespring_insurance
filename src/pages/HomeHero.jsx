import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause, Quote, ArrowRight, Shield, Heart, Users } from "lucide-react";
import "./custom.css";

// Map API icon names to Lucide components
const iconMap = { Shield, Heart, Users };

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/HeroCarousel");
        const data = await res.json();
        setSlides(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch slides:", error);
      }
    };
    fetchSlides();
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isAutoplay || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoplay, slides]);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0)
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

  const currentSlideData = slides[currentSlide];
  const IconComponent = iconMap[currentSlideData.icon] || Shield;

  // Floating cards dynamically based on stats
  const floatingCards = [
    { icon: IconComponent, title: "Clients", desc: `${currentSlideData.stats.clients} Happy Clients` },
    { icon: IconComponent, title: "Coverage", desc: `${currentSlideData.stats.coverage} Coverage` },
    { icon: IconComponent, title: "Experience", desc: `${currentSlideData.stats.years} Years Experience` },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black -mt5">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide._id || index}
          className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : index === (currentSlide - 1 + slides.length) % slides.length
              ? "opacity-0 scale-110 -translate-x-full"
              : "opacity-0 scale-110 translate-x-full"
          }`}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-20`} />
        </div>
      ))}

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`text-white space-y-8 transform transition-all duration-1000 delay-300 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              {/* Icon + Trusted Badge */}
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentSlideData.accent} shadow-2xl`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-sm font-semibold">
                    Trusted by {currentSlideData.stats.clients} families
                  </span>
                </div>
              </div>

              {/* Title + Tagline */}
              <div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                  <span className={`bg-gradient-to-r ${currentSlideData.accent} bg-clip-text text-transparent`}>
                    {currentSlideData.title.split(" ").slice(0, -2).join(" ")}
                  </span>
                  <br />
                  <span className="text-white">{currentSlideData.title.split(" ").slice(-2).join(" ")}</span>
                </h1>
                <div className="flex items-start gap-3 mb-8">
                  <Quote
                    className={`w-6 h-6 mt-1 text-gradient bg-gradient-to-r ${currentSlideData.accent} text-blue-400`}
                  />
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                    {currentSlideData.tagline}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Internal Link Button */}
                <Link
                  to={currentSlideData.quoteLink || "/quote"}
                  className={`group px-8 py-4 bg-gradient-to-r ${currentSlideData.accent} text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-500 flex items-center gap-3 relative overflow-hidden`}
                >
                  <span className="relative z-10">Get Free Quote</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Link>

                {/* External Link Button */}
                <a
                  href={currentSlideData.demoLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
                >
                  <Play className="w-5 h-5" /> Watch Demo
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {Object.entries(currentSlideData.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className={`text-3xl font-black bg-gradient-to-r ${currentSlideData.accent} bg-clip-text text-transparent`}
                    >
                      {value}
                    </div>
                    <div className="text-sm text-gray-300 font-semibold capitalize">
                      {key === "clients" ? "Happy Clients" : key === "coverage" ? "Coverage" : "Years Experience"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div
              className={`lg:flex hidden justify-end transform transition-all duration-1000 delay-500 ${
                isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              <div className="space-y-6">
                {floatingCards.map((card, i) => (
                  <div
                    key={i}
                    className={`p-6 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl transform ${
                      i % 2 === 0 ? `rotate-${i + 1}` : `-rotate-${i + 1} ml-12`
                    } hover:rotate-0 transition-transform duration-500`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${currentSlideData.accent}`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{card.title}</h3>
                        <p className="text-gray-300 text-sm">{card.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors duration-300"
          >
            {isAutoplay ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={prevSlide}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-12 h-1.5 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? `bg-gradient-to-r ${currentSlideData.accent} shadow-lg`
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
        <div
          className={`h-full bg-gradient-to-r ${currentSlideData.accent} transition-all duration-300`}
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            animation: isAutoplay ? "progress 6s linear infinite" : "none",
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
