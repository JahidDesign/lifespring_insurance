import React, { useState, useEffect } from "react";
import { Users, Mail, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

const Subscribers = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [existingEmails, setExistingEmails] = useState(new Set());

  // Fetch existing subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/subscribers");
        if (!res.ok) throw new Error("Failed to fetch subscribers");
        const data = await res.json();
        setSubscriberCount(data.length);
        setExistingEmails(new Set(data.map(sub => sub.email.toLowerCase())));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubscribers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailLower = form.email.toLowerCase();

    if (!form.name || !form.email) {
      toast.warning("⚠️ Name and email are required");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("❌ Please enter a valid email address");
      return;
    }

    if (existingEmails.has(emailLower)) {
      toast.error("❌ This email is already subscribed");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("https://insurances-lmy8.onrender.com/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: emailLower }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      toast.success("🎉 Subscribed successfully!");

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
      });

      setForm({ name: "", email: "" });
      setSubscriberCount(prev => prev + 1);
      setExistingEmails(prev => new Set(prev).add(emailLower));
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const animationStyle1 = { animationDelay: "0s", animationDuration: "3s" };
  const animationStyle2 = { animationDelay: "1s", animationDuration: "3s" };
  const animationStyle3 = { animationDelay: "2s", animationDuration: "3s" };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto py-20 px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-50 opacity-60"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-50 opacity-60"></div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-0 left-1/4 animate-bounce" style={animationStyle1}>
            <Mail className="w-6 h-6 text-blue-400 opacity-60" />
          </div>
          <div className="absolute top-10 right-1/4 animate-bounce" style={animationStyle2}>
            <Sparkles className="w-5 h-5 text-purple-400 opacity-60" />
          </div>
          <div className="absolute top-5 left-1/3 animate-bounce" style={animationStyle3}>
            <Users className="w-4 h-4 text-pink-400 opacity-60" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Stay in the 
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Loop</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Join thousands of readers who get exclusive insights, early access content, and expert tips delivered straight to their inbox.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{subscriberCount}+ subscribers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Weekly updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>No spam ever</span>
            </div>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Subscribe Now</h3>
              <p className="text-gray-600">Get the latest updates delivered to your inbox</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto mx-auto flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Subscribe Now
                      <Sparkles className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                By subscribing, you agree to our privacy policy. Unsubscribe at any time.
              </p>
            </form>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Weekly Newsletter</h4>
              <p className="text-sm text-gray-600">Get curated content delivered every week</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Exclusive Community</h4>
              <p className="text-sm text-gray-600">Join our community of engaged readers</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Early Access</h4>
              <p className="text-sm text-gray-600">Be the first to know about new content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribers;
