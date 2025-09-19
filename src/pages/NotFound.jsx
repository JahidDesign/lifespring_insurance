import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search, MapPin, RefreshCw, Zap } from 'lucide-react';

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // In a real app, you'd implement search functionality
      console.log('Searching for:', searchTerm);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const goHome = () => {
    // In a real app with React Router, this would be navigation
    window.location.href = '/';
  };

  const navigateToPage = (path) => {
    // In a real app with React Router, this would be navigation
    window.location.href = path;
  };

  const popularPages = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
    { name: 'Help Center', path: '/help' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.5}%`,
            top: `${mousePosition.y * 0.5}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/15 to-cyan-500/15 blur-2xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.3}%`,
            bottom: `${mousePosition.y * 0.3}%`,
            transform: 'translate(50%, 50%)',
            transition: 'all 0.5s ease-out',
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white">
        {/* Main 404 content */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className={`text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent transform transition-all duration-500 ${isAnimating ? 'scale-110 rotate-2' : 'scale-100 rotate-0'}`}>
              404
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8">
              <Zap className="w-full h-full text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-200">
            Oops! You've ventured into the void
          </h2>
          <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into the digital cosmos. But don't worry, we'll help you find your way back!
          </p>
        </div>

        {/* Search box */}
        <div className="w-full max-w-md mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for what you're looking for..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                <Search className="h-4 w-4 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={goHome}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold"
          >
            <Home className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            Go Home
          </button>
          
          <button
            onClick={goBack}
            className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>

        {/* Popular pages */}
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <MapPin className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-300">Popular destinations</h3>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {popularPages.map((page, index) => (
              <button
                key={page.path}
                onClick={() => navigateToPage(page.path)}
                className="px-6 py-2 bg-white/5 backdrop-blur-lg border border-white/10 text-gray-300 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105 transform"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer message */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-gray-500 text-sm text-center">
            Lost? That's okay, even the best explorers take wrong turns sometimes.
          </p>
        </div>
      </div>

      {/* CSS for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;