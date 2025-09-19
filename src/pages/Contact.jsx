import React, { useState } from "react";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, MessageSquare, Shield, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";
const API_URL = "https://insurances-lmy8.onrender.com/contact";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          inquiryType: "general"
        });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+880 1234-567890",
      color: "from-blue-500 to-blue-600",
      description: "Mon-Fri, 9AM-6PM"
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "support@insurance.com",
      color: "from-purple-500 to-purple-600",
      description: "24/7 Support Available"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Dhaka, Bangladesh",
      color: "from-cyan-500 to-cyan-600",
      description: "Multiple Locations"
    }
  ];

  const features = [
    { icon: Shield, text: "Secure Communication" },
    { icon: Clock, text: "Quick Response" },
    { icon: Users, text: "Expert Support Team" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
       <Helmet>
        <title>Contact Us | Smart Insurance</title>
        <meta
          name="description"
          content="Get in touch with Smart Insurance for inquiries, support, or quotes. Our team is ready to assist you with your insurance needs."
        />
        <meta
          name="keywords"
          content="insurance contact, support, claims, quote, smart insurance"
        />
        <link rel="icon" href="insurance.png" sizes="any" />
        <link rel="icon" type="image/png" href="insurance.png" />
        <link rel="apple-touch-icon" href="insurance.png" />
      </Helmet>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <div className="text-center py-20 px-6">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 mb-6 animate-pulse">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ready to secure your future? Our insurance experts are here to guide you through every step of your journey.
          </p>
          
          {/* Features */}
          <div className="flex justify-center gap-8 mt-12 flex-wrap">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                <feature.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 pb-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-start">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-cyan-400/20 to-purple-400/20"></div>
                    <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center shadow-lg`}>
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{info.title}</h3>
                          <p className="text-cyan-300 font-medium">{info.value}</p>
                          <p className="text-gray-400 text-sm">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                  Why Choose Us?
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    24/7 Customer Support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Quick Claims Processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Competitive Rates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Trusted by 100K+ Customers
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Send Us a Message
                  </h2>
                  
                  {/* Success/Error Messages */}
                  {submitStatus && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                      submitStatus === 'success' 
                        ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                        : 'bg-red-500/20 border border-red-500/30 text-red-300'
                    }`}>
                      {submitStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span>
                        {submitStatus === 'success' 
                          ? 'Message sent successfully! We\'ll get back to you soon.' 
                          : 'Failed to send message. Please try again.'}
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-gray-300 text-sm font-medium">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gray-300 text-sm font-medium">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-gray-300 text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+880 1234-567890"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-gray-300 text-sm font-medium">Inquiry Type</label>
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        >
                          <option value="general" className="bg-gray-800">General Inquiry</option>
                          <option value="claims" className="bg-gray-800">Claims Support</option>
                          <option value="support" className="bg-gray-800">Technical Support</option>
                          <option value="quote" className="bg-gray-800">Get a Quote</option>
                          <option value="partnership" className="bg-gray-800">Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm font-medium">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="What can we help you with?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm font-medium">Message *</label>
                      <textarea
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="group relative w-full py-4 px-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;