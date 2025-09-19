import React, { useState } from "react";
import {  Shield } from "lucide-react";


const InsuranceSection = () => {
 

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

export default InsuranceSection;