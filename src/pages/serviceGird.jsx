import React, { useState } from "react";
import { Heart, Shield, Home, Car, Plane, Briefcase, ArrowRight, CheckCircle } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Health Insurance",
    description: "Comprehensive health coverage for individuals and families, ensuring quality care when needed.",
    icon: <Heart className="w-12 h-12 text-red-500 mb-4 mx-auto" />,
    features: ["24/7 Medical Support", "Prescription Coverage", "Preventive Care", "Emergency Services"],
    color: "red",
    gradient: "from-red-500 to-pink-600"
  },
  {
    id: 2,
    title: "Life Insurance",
    description: "Protect your loved ones with customized life insurance plans for financial security.",
    icon: <Shield className="w-12 h-12 text-green-500 mb-4 mx-auto" />,
    features: ["Term & Whole Life", "Flexible Premiums", "Cash Value Growth", "Tax Benefits"],
    color: "green",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: 3,
    title: "Property Insurance",
    description: "Coverage for your home or business against unforeseen damages, theft, and natural disasters.",
    icon: <Home className="w-12 h-12 text-blue-500 mb-4 mx-auto" />,
    features: ["Natural Disaster Coverage", "Theft Protection", "Liability Coverage", "Personal Property"],
    color: "blue",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    id: 4,
    title: "Auto Insurance",
    description: "Complete vehicle protection with comprehensive coverage options for all drivers.",
    icon: <Car className="w-12 h-12 text-purple-500 mb-4 mx-auto" />,
    features: ["Collision Coverage", "Roadside Assistance", "Rental Car Coverage", "Uninsured Motorist"],
    color: "purple",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    id: 5,
    title: "Travel Insurance",
    description: "Travel with confidence knowing you're protected against unexpected events worldwide.",
    icon: <Plane className="w-12 h-12 text-indigo-500 mb-4 mx-auto" />,
    features: ["Trip Cancellation", "Medical Emergency", "Lost Luggage", "Flight Delay"],
    color: "indigo",
    gradient: "from-indigo-500 to-blue-600"
  },
  {
    id: 6,
    title: "Business Insurance",
    description: "Comprehensive business protection covering liability, property, and professional risks.",
    icon: <Briefcase className="w-12 h-12 text-orange-500 mb-4 mx-auto" />,
    features: ["General Liability", "Professional Liability", "Property Coverage", "Workers' Comp"],
    color: "orange",
    gradient: "from-orange-500 to-red-600"
  }
];

const serviceSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section id="insurance" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.5),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Trusted by 50,000+ families
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Our Insurance Services
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            We provide reliable and comprehensive insurance solutions tailored to your needs. 
            From health and life insurance to property and travel coverage, our goal is to give 
            you peace of mind and financial protection.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-sm text-gray-500">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">99.8%</div>
              <div className="text-sm text-gray-500">Claim Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-500">Customer Support</div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden ${
                hoveredCard === service.id ? 'ring-2 ring-blue-400 ring-opacity-60' : ''
              }`}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon with animated background */}
              <div className="relative">
                <div className={`absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br ${service.gradient} rounded-full opacity-10 scale-0 group-hover:scale-100 transition-transform duration-500`}></div>
                <div className="relative z-10">
                  {service.icon}
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                {service.features.slice(0, hoveredCard === service.id ? 4 : 2).map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center text-sm text-gray-600"
                    style={{
                      animationDelay: `${idx * 100}ms`
                    }}
                  >
                    <CheckCircle className={`w-4 h-4 text-${service.color}-500 mr-2 flex-shrink-0`} />
                    <span>{feature}</span>
                  </div>
                ))}
                {hoveredCard !== service.id && service.features.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{service.features.length - 2} more features
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button className={`w-full px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center space-x-2 hover:shadow-lg`}>
                  <span>Get Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Corner decoration */}
              <div className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-full opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-100 transition-all duration-700`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help Choosing the Right Plan?</h3>
            <p className="mb-6 opacity-90">Our insurance experts are here to guide you through the process</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300">
                Speak with an Expert
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                Compare All Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default serviceSection;