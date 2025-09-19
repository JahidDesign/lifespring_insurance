import React, { useState, useEffect, useRef } from 'react';

const VisionMissionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      id: 'vision',
      icon: '🎯',
      title: 'Vision Statement',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      content: 'To maximize shareholder value through complete customer satisfaction and a culture of excellence driven by our committed team.',
      delay: 'delay-100'
    },
    {
      id: 'mission',
      icon: '🚀',
      title: 'Mission Statement',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      content: 'We provide innovative insurance solutions tailored to customer needs. Trust and long-term relationships are at the heart of our service.',
      delay: 'delay-200'
    },
    {
      id: 'foundation',
      icon: '🏛️',
      title: 'Our Foundation',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      content: 'Innovation and compassion drive us. We are committed to building inclusive insurance services that respond to people\'s real-life needs.',
      delay: 'delay-300'
    },
    {
      id: 'belief',
      icon: '💎',
      title: 'Belief',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      content: 'Customers are the center of all our efforts. We strive to serve them with integrity, efficiency, and care — backed by smart risk management.',
      delay: 'delay-400'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white via-gray-50 to-white py-24 px-6 md:px-20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-20 w-4 h-4 bg-blue-400 rotate-45 animate-spin opacity-30"></div>
        <div className="absolute bottom-40 left-16 w-6 h-6 border-2 border-purple-400 rounded-full animate-bounce opacity-25"></div>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
              Our Guiding Principles
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Gearing LifeSecure
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
              for Tomorrow
            </span>
          </h2>
          
          <div className="flex justify-center mb-8">
            <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-full"></div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Rooted in legacy, driven by innovation — our principles guide everything we do to protect what matters most.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`group relative transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} ${card.delay}`}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Card Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110`}></div>
              
              {/* Card */}
              <div className={`relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 h-full`}>
                
                {/* Icon and Title */}
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {card.content}
                </p>

                {/* Decorative Element */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <div className={`w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-full blur-2xl`}></div>
                </div>

                {/* Bottom Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust LifeSecure to protect their future.
            </p>
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Today
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;