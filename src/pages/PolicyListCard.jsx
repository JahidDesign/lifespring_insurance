import React, { useEffect, useState, useContext } from "react";
import { Star, DollarSign, Shield, CreditCard, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

// Mock payment processing
const processPayment = async (cardData, policyTitle) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
    throw new Error("Please fill in all card details");
  }
  if (cardData.number.length < 16) {
    throw new Error("Invalid card number");
  }
  return { status: "succeeded" };
};

// Utility for safe JSON
const safeJsonStringify = (data, fallback = "{}") => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("JSON stringify error:", error);
    return fallback;
  }
};
const safeJsonParse = (data, fallback = {}) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};

// Success Alert
const SuccessAlert = ({ show, onClose, policyTitle }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border-l-4 border-green-500 p-6 max-w-md flex items-start gap-4">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Successful! 🎉</h3>
          <p className="text-gray-600 text-sm mb-2">Your policy has been activated</p>
          <p className="text-green-700 font-medium text-sm">{policyTitle}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Error Alert
const ErrorAlert = ({ show, onClose, message }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border-l-4 border-red-500 p-6 max-w-md flex items-start gap-4">
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Failed</h3>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ----------------- Checkout Form -----------------
const CheckoutForm = ({ policyTitle, onSuccess, onCancel, showAlert }) => {
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [showCardNumber, setShowCardNumber] = useState(true);
  const [showCVC, setShowCVC] = useState(false);

  const handleSubmit = async () => {
    if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
      showAlert("error", "Please fill in all card details");
      return;
    }
    setProcessing(true);
    try {
      const result = await processPayment(cardData, policyTitle);
      if (result.status === "succeeded") {
        showAlert("success", policyTitle);
        onSuccess();
      }
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Payment</h2>

      {/* Credit Card Preview */}
      <div className="relative w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white p-6 mb-6 shadow-xl">
        <div className="w-12 h-8 bg-yellow-300 rounded-lg mb-4"></div>
        <p className="text-xl font-mono tracking-widest">
          {showCardNumber
            ? cardData.number.padEnd(16, "*").replace(/(.{4})/g, "$1 ").trim()
            : "**** **** **** ****"}
        </p>
        <div className="flex justify-between mt-6">
          <div>
            <p className="text-xs">Card Holder</p>
            <p className="font-semibold">{cardData.name || "FULL NAME"}</p>
          </div>
          <div>
            <p className="text-xs">Expires</p>
            <p className="font-semibold">{cardData.expiry || "MM/YY"}</p>
          </div>
          <div>
            <p className="text-xs">CVC</p>
            <p className="font-semibold">{showCVC ? cardData.cvc : "***"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Card Number */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          <input
            type={showCardNumber ? "text" : "password"}
            placeholder="1234 5678 9012 3456"
            value={cardData.number}
            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none"
            maxLength="16"
          />
          <button
            type="button"
            onClick={() => setShowCardNumber(!showCardNumber)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showCardNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={cardData.expiry}
              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none"
              maxLength="5"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
            <input
              type={showCVC ? "text" : "password"}
              placeholder="123"
              value={cardData.cvc}
              onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none"
              maxLength="3"
            />
            <button
              type="button"
              onClick={() => setShowCVC(!showCVC)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCVC ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardData.name}
            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={processing}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {processing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Pay Now"
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={processing}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------- Pagination -----------------
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) rangeWithDots.push("...", totalPages);
    else if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md transition-all">
        <ChevronLeft className="w-5 h-5" />
      </button>
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            page === currentPage
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : typeof page === "number"
              ? "bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg"
              : "bg-transparent text-gray-400 cursor-default"
          }`}
        >
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md transition-all">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// ----------------- Main Component -----------------
const PolicyCardsWithPayment = () => {
  const [policies, setPolicies] = useState([]);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [checkoutData, setCheckoutData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState({ show: false, policyTitle: "" });
  const [errorAlert, setErrorAlert] = useState({ show: false, message: "" });
  const ITEMS_PER_PAGE = 6;

  const showAlert = (type, message) => {
    if (type === "success") {
      setSuccessAlert({ show: true, policyTitle: message });
      setErrorAlert({ show: false, message: "" });
    } else {
      setErrorAlert({ show: true, message });
      setSuccessAlert({ show: false, policyTitle: "" });
    }
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        try {
          const response = await fetch("https://insurances-lmy8.onrender.com/policies");
          const data = await response.json();
          const policiesData = safeJsonParse(data.data || data, []);
          setPolicies(Array.isArray(policiesData) ? policiesData : []);
        } catch (apiError) {
          // fallback mock policies
          const mockPolicies = [
            { _id: "1", title: "Comprehensive Health Insurance", type: "Health", description: "Complete healthcare coverage.", image: "https://picsum.photos/400/240?random=1", coverageAmount: "$100,000", premium: "299", rating: "4.8", term: "Annual", ageMin: "18", ageMax: "65" },
            { _id: "2", title: "Term Life Insurance", type: "Life", description: "Affordable life insurance protection.", image: "https://picsum.photos/400/240?random=2", coverageAmount: "$500,000", premium: "45", rating: "4.9", term: "20 years", ageMin: "21", ageMax: "70" },
            { _id: "3", title: "Auto Insurance Plus", type: "Vehicle", description: "Comprehensive vehicle protection.", image: "https://picsum.photos/400/240?random=3", coverageAmount: "$25,000", premium: "89", rating: "4.6", term: "6 months", ageMin: "18", ageMax: "75" }
            // add more mock policies as needed
          ];
          setPolicies(mockPolicies);
        }
      } catch (error) {
        console.error("Failed to fetch policies:", error);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterType]);

  const filteredPolicies = policies.filter((p) => {
    const matchesType = filterType === "All" || p.type === filterType;
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPolicies = filteredPolicies.slice(startIndex, endIndex);

  const handlePayment = (policy) => {
    if (!user) {
      showAlert("error", "Login required to pay premium");
      return;
    }
    setCheckoutData(policy);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {successAlert.show && <SuccessAlert show={successAlert.show} onClose={() => setSuccessAlert({ show: false, policyTitle: "" })} policyTitle={successAlert.policyTitle} />}
      {errorAlert.show && <ErrorAlert show={errorAlert.show} onClose={() => setErrorAlert({ show: false, message: "" })} message={errorAlert.message} />}

      <div className="text-center mb-12">
       <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
      Insurance Policies
      </h1>
     <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-6">
     Explore our wide range of insurance plans designed to protect your life, health, and assets. Compare policies, check premiums, and secure your future today.
    </p>
    <div className="flex justify-center">
      <span className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></span>
    </div>
   </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 w-full md:w-1/2"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Health">Health</option>
          <option value="Life">Life</option>
          <option value="Vehicle">Vehicle</option>
           <option value="Travel">Travel</option>
                  <option value="Home">Home</option>
                  <option value="Education">Education</option>
                  <option value="Pet">Pet</option>
                  <option value="Disability">Disability</option>
                  <option value="Business">Business</option>
                  <option value="Liability">Liability</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading policies...</div>
      ) : currentPolicies.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No policies found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPolicies.map((policy) => (
              <div key={policy._id} className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
                <img src={policy.image} alt={policy.title} className="h-48 w-full object-cover" />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{policy.title}</h2>
                    <p className="text-gray-600 text-sm mb-4">{policy.description}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700 text-sm">Coverage: {policy.coverageAmount}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 text-sm">Premium: ${policy.premium}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-700 text-sm">{policy.rating} Rating</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePayment(policy)}
                    className={`mt-4 w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      user
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                        : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    {user ? "Pay Premium" : "Login Required"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {checkoutData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <CheckoutForm
            policyTitle={checkoutData.title}
            onSuccess={() => setCheckoutData(null)}
            onCancel={() => setCheckoutData(null)}
            showAlert={showAlert}
          />
        </div>
      )}
    </div>
  );
};

export default PolicyCardsWithPayment;
