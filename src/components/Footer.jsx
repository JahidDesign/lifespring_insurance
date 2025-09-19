import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Gem, 
  Plane, 
  Shield, 
  Heart, 
  Flame,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Headphones,
  ExternalLink,
  Loader2
} from 'lucide-react';

const Footer = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Loading Component
  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Main loading spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-300"></div>
        </div>
        
        {/* Logo area with pulse animation */}
        <div className="bg-gray-100 rounded-2xl p-6 animate-pulse">
          <div className="w-32 h-12 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Loading text with typing effect */}
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-800 mb-2">
            Loading LifeSecure
            <span className="animate-pulse">...</span>
          </div>
          <div className="text-sm text-gray-600">Preparing your insurance experience</div>
        </div>
        
        {/* Progress dots */}
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        
        {/* Loading bars */}
        <div className="w-64 bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <footer className="relative overflow-hidden bg-white">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <div className="bg-gray-100 backdrop-blur-sm rounded-2xl p-4 inline-block mb-6 shadow-lg">
                <img
                  src="insurancen.svg"
                  alt="LifeSecure"
                  className="w-28 h-auto"
                />
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              LifeSecure is committed to providing trusted insurance solutions that ensure the safety and well-being of individuals and families across Bangladesh.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Trusted by 100,000+ customers</span>
            </div>
          </div>

          {/* Our Products */}
          <div>
            <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
              Our Products
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Motor Insurance', icon: Car, color: 'text-blue-400' },
                { name: 'Nibedita', icon: Gem, color: 'text-purple-400' },
                { name: 'Travel Insurance', icon: Plane, color: 'text-green-400' },
                { name: 'Personal Accident Insurance', icon: Shield, color: 'text-yellow-400' },
                { name: 'Health Insurance', icon: Heart, color: 'text-red-400' },
                { name: 'Fire Insurance', icon: Flame, color: 'text-orange-400' }
              ].map((product, index) => (
                <li key={index} className="group">
                  <div className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-all duration-300 cursor-pointer">
                    <div className={`${product.color} group-hover:scale-110 transition-all duration-300 w-5 h-5 flex items-center justify-center`}>
                      <product.icon className="w-full h-full" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {product.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
              Useful Links
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                'IDRA',
                'Bangladesh Securities And Exchange Commission',
                'Dhaka Stock Exchange Ltd.',
                'Chittagong Stock Exchange PLC.',
                'Branches',
                'News & Events',
                'Annual Reports',
                'Unsettled Claim Information'
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center group">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 group-hover:bg-blue-500 transition-colors duration-300"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm flex items-center">
                      {link}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
              Get in Touch
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                  <Phone className="text-blue-600 w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">16457</p>
                  <p className="text-xs text-gray-500">Hotline</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageCircle className="text-green-600 w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-800">01730031888</p>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3">
              {[
                { platform: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/greendeltainsurance', color: 'from-blue-600 to-blue-500' },
                { platform: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/greendeltainsurance', color: 'from-pink-600 to-purple-500' },
                { platform: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/green-delta-insurance', color: 'from-blue-700 to-blue-600' },
                { platform: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/user/greendeltains', color: 'from-red-600 to-red-500' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl`}
                  aria-label={social.platform}
                >
                  <social.icon className="text-white w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-500 text-sm">
                © 2025 LifeSecure. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4 text-xs text-gray-400">
                <span>Developed by</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Jahid Hasan
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300 hover:underline">
                Terms of Use
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300 hover:underline">
                Privacy Policy
              </a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg">
                <Headphones className="w-4 h-4" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;