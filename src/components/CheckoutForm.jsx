import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cardData, setCardData] = useState({
    policyTitle: "",
    name: user?.displayName || "",
    email: user?.email || "",
  });

  // Fetch policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const { data } = await axios.get("https://insurances-lmy8.onrender.com/policies");
        setPolicies(data.data || []);
      } catch (err) {
        console.error("Failed to fetch policies", err);
      }
    };
    fetchPolicies();
  }, []);

  // Handle input changes
  const handleChange = (field) => (e) => {
    setCardData({ ...cardData, [field]: e.target.value });
  };

  // Handle policy selection
  const handlePolicySelect = (e) => {
    const policy = policies.find((p) => p._id === e.target.value);
    setSelectedPolicy(policy);
    setCardData((prev) => ({ ...prev, policyTitle: policy?.title || "" }));
    if (policy) setPaymentAmount(policy.premium);
  };

  // Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
      Swal.fire("Error", "Please enter a valid payment amount.", "error");
      return;
    }

    setProcessing(true);

    try {
      // 1. Create payment intent on backend
      const { data: clientSecretRes } = await axios.post(
        "https://insurances-lmy8.onrender.com/payments",
        {
          policyId: selectedPolicy?._id || null,
          title: selectedPolicy?.title || cardData.policyTitle || "Custom Payment",
          premium: Number(paymentAmount),
          type: selectedPolicy?.type || "manual",
          coverageAmount: selectedPolicy?.coverageAmount || null,
        }
      );

      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardData.name,
          email: cardData.email,
        },
      });

      if (error) {
        Swal.fire("Error", error.message, "error");
        setProcessing(false);
        return;
      }

      // 2. Confirm payment with Stripe
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecretRes.clientSecret,
        { payment_method: paymentMethod.id }
      );

      if (confirmError) {
        Swal.fire("Error", confirmError.message, "error");
        setProcessing(false);
        return;
      }

      // 3. Payment succeeded
      if (paymentIntent.status === "succeeded") {
        Swal.fire("Success", "Payment successful!", "success");
        navigate("/customer/payment-status");
      }
    } catch (err) {
      console.error("Payment failed", err);
      Swal.fire("Error", "Payment failed. Try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header with Visa-inspired branding */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white px-8 py-4 rounded-2xl shadow-lg mb-4">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
              SECURE PAY
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-yellow-400 mx-auto mt-2 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
            Complete your secure payment
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>
                Payment Details
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-white rounded opacity-90"></div>
                <div className="w-8 h-5 bg-yellow-400 rounded"></div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Policy Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Insurance Policy
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                  onChange={handlePolicySelect}
                  defaultValue=""
                >
                  <option value="" disabled className="text-gray-500">
                    Select a policy
                  </option>
                  {policies.map((policy) => (
                    <option key={policy._id} value={policy._id} className="text-gray-900">
                      {policy.title} — ${policy.premium}
                    </option>
                  ))}
                </select>
              </div>

              {/* Policy Title */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Policy Title
                </label>
                <input
                  type="text"
                  value={cardData.policyTitle}
                  onChange={handleChange("policyTitle")}
                  placeholder="Enter policy title"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                />
              </div>

              {/* Payment Amount - Card Style */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Payment Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-600 font-bold text-lg">$</span>
                  </div>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-bold text-lg"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                    min="1"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <span className="text-gray-500 font-medium text-sm">USD</span>
                  </div>
                </div>
              </div>

              {/* Billing Information Section */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Billing Information
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={handleChange("name")}
                      placeholder="Name as shown on card"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium uppercase tracking-wide"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={cardData.email}
                      onChange={handleChange("email")}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Details Section - Visa Style */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Card Details
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs font-bold bg-white text-gray-900 px-2 py-1 rounded">VISA</div>
                    <div className="text-xs font-bold bg-white text-gray-900 px-2 py-1 rounded">MC</div>
                    <div className="text-xs font-bold bg-white text-gray-900 px-2 py-1 rounded">AMEX</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <CardElement 
                    options={{ 
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#1f2937',
                          fontFamily: 'Arial, sans-serif',
                          fontWeight: '500',
                          letterSpacing: '0.025em',
                          '::placeholder': {
                            color: '#6b7280',
                            fontWeight: '400',
                          },
                        },
                        invalid: {
                          color: '#dc2626',
                        },
                        complete: {
                          color: '#059669',
                        },
                      },
                    }} 
                  />
                </div>
                
                <div className="flex items-center mt-4 text-xs text-gray-300">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your card information is encrypted and secure
                </div>
              </div>

              {/* Submit Button - Visa Style */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing || !stripe}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-bold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[0.99] active:scale-[0.98] shadow-lg"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    <span>
                      {paymentAmount ? `Pay $${paymentAmount}` : 'Complete Payment'} • Secure
                    </span>
                  )}
                </button>
              </div>

              {/* Security Footer */}
              <div className="flex items-center justify-center pt-4 space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">SSL Encrypted</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">256-bit Security</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">PCI Compliant</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
            Powered by Stripe • Trusted by millions worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;