import React, { useState, useEffect } from 'react';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { number: "39", label: "Years of Excellence", suffix: "+" },
    { number: "50", label: "Thousand Lives Protected", suffix: "K+" },
    { number: "99", label: "Customer Satisfaction", suffix: "%" },
    { number: "24", label: "Hour Support", suffix: "/7" }
  ];

  return (
    <div className="relative overflow-hidden bg-white text-gray-900 min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50"></div>
        <div 
          className="absolute w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            left: mousePosition.x * 0.05,
            top: mousePosition.y * 0.05,
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            right: mousePosition.x * -0.03,
            bottom: mousePosition.y * -0.03,
          }}
        ></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rotate-45 animate-bounce opacity-40"></div>
        <div className="absolute top-40 right-20 w-6 h-6 border-2 border-blue-400 rounded-full animate-spin opacity-30"></div>
        <div className="absolute bottom-32 left-20 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rotate-45 animate-pulse opacity-25"></div>
        <div className="absolute bottom-20 right-32 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
      </div>

      <div className="relative z-10 px-6 md:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block">
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-6 leading-tight tracking-tight">
                About
                <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                  LifeSecure
                </span>
              </h1>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-purple-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-16">
              Redefining insurance through innovation, trust, and unwavering commitment to your future.
            </p>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-lg rounded-3xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}<span className="text-2xl">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-600 text-sm md:text-base font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Section */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-lg">
                  <img
                    src="https://i.ibb.co/KnV6nXt/1747845703.jpg"
                    alt="LifeSecure Insurance"
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className={`space-y-8 transition-all duration-1000 delay-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-purple-100 rounded-full border border-yellow-300">
                  <span className="text-yellow-700 font-semibold">Since 1985</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Legacy Meets
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Innovation
                  </span>
                </h2>

                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-purple-500 rounded-full"></div>
                  <blockquote className="pl-8 text-gray-700 text-lg md:text-xl leading-relaxed">
                    LifeSecure represents the modern evolution of Green Delta Insurance, a pioneering institution that began its transformative journey in 1985 under the visionary leadership of Mr. Nasir A. Chowdhury.
                  </blockquote>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="px-4 py-2 bg-gray-100 backdrop-blur-lg rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                    🛡️ Trusted Protection
                  </div>
                  <div className="px-4 py-2 bg-gray-100 backdrop-blur-lg rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                    🚀 Future-Ready
                  </div>
                  <div className="px-4 py-2 bg-gray-100 backdrop-blur-lg rounded-full border border-gray-200 text-sm font-medium text-gray-700">
                    💎 Premium Service
                  </div>
                </div>

                <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <span className="relative z-10">Explore Our Story</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`mt-32 text-center transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px"></div>
              <div className="relative bg-white px-8">
                <p className="text-gray-600 italic text-lg">
                  "Inspired by Legacy • Designed for Tomorrow • Built for You"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;