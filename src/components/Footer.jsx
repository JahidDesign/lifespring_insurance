import React, { useState, useEffect } from 'react';
import { 
  Car, Gem, Plane, Shield, Heart, Flame,
  Phone, MessageCircle, Facebook, Instagram, Linkedin, Youtube, Headphones, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_SUBSCRIBE = "https://insurances-lmy8.onrender.com/policiesuser";

const Footer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscribeData, setSubscribeData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribeChange = (e) => {
    setSubscribeData({ ...subscribeData, [e.target.name]: e.target.value });
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch(API_SUBSCRIBE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscribeData)
      });
      if (res.ok) {
        setStatus('success');
        setSubscribeData({ name: '', email: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading LifeSecure<span className="animate-pulse">...</span></div>
          <div className="text-sm text-gray-600">Preparing your insurance experience</div>
        </div>
      </div>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-white text-black">
      {/* Background Blur Circles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Logo & About */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <div className="bg-gray-100 rounded-2xl p-4 inline-block mb-6 shadow-lg">
                <img src="insurancen.svg" alt="LifeSecure" className="w-28 h-auto" />
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              LifeSecure provides trusted insurance solutions ensuring safety and well-being across Bangladesh.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Trusted by 100,000+ customers</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
              Our Products
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[{ name: 'Motor Insurance', icon: Car, color: 'text-blue-400' },
                { name: 'Nibedita', icon: Gem, color: 'text-purple-400' },
                { name: 'Travel Insurance', icon: Plane, color: 'text-green-400' },
                { name: 'Personal Accident Insurance', icon: Shield, color: 'text-yellow-400' },
                { name: 'Health Insurance', icon: Heart, color: 'text-red-400' },
                { name: 'Fire Insurance', icon: Flame, color: 'text-orange-400' }].map((product, index) => (
                <li key={index} className="group">
                  <div className={`flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-all duration-300 cursor-pointer`}>
                    <div className={`${product.color} group-hover:scale-110 transition-all duration-300 w-5 h-5 flex items-center justify-center`}>
                      <product.icon className="w-full h-full" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{product.name}</span>
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
              {['IDRA','Bangladesh Securities And Exchange Commission','Dhaka Stock Exchange Ltd.',
                'Chittagong Stock Exchange PLC.','Branches','News & Events','Annual Reports','Unsettled Claim Information'
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

          {/* Contact & Subscribe */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
              Subscribe & Contact
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </h3>

            {/* Subscribe Form */}
            <form onSubmit={handleSubscribeSubmit} className="space-y-4 max-w-md relative">
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 right-0 p-4 mb-2 rounded-lg text-sm bg-green-100 text-green-800 shadow-md text-center"
                  >
                    🎉 Thanks for subscribing, {subscribeData.name || 'there'}!
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  value={subscribeData.name}
                  onChange={handleSubscribeChange}
                  placeholder="Full Name"
                  required
                  className="flex-1 p-4 bg-white/10 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 transition-all"
                />
                <input
                  type="email"
                  name="email"
                  value={subscribeData.email}
                  onChange={handleSubscribeChange}
                  placeholder="Email Address"
                  required
                  className="flex-1 p-4 bg-white/10 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-4 px-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Subscribe'}
              </button>
            </form>

            {/* Contact Info & Social */}
            <div className="space-y-4 mt-6">
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

              <div className="flex space-x-3 mt-4">
                {[{ platform: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/greendeltainsurance', color: 'from-blue-600 to-blue-500' },
                  { platform: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/greendeltainsurance', color: 'from-pink-600 to-purple-500' },
                  { platform: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/green-delta-insurance', color: 'from-blue-700 to-blue-600' },
                  { platform: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/user/greendeltains', color: 'from-red-600 to-red-500' }].map((social, index) => (
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
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-500 text-sm">© 2025 LifeSecure. All rights reserved.</p>
              <div className="hidden md:flex items-center space-x-4 text-xs text-gray-400">
                <span>Developed by</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">Jahid Hasan</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300 hover:underline">Terms of Use</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300 hover:underline">Privacy Policy</a>
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
