import React, { useEffect, useState, useContext } from "react";
import { Star, DollarSign, Shield, CreditCard, ChevronLeft, ChevronRight, Eye, EyeOff, Lock, Wifi  } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
// Mock AuthContext since we don't have access to the real one


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

// Checkout Form Component
const CheckoutForm = (props) => {
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [showCardNumber, setShowCardNumber] = useState(true);
  const [showCVC, setShowCVC] = useState(false);

  const title = props.policyTitle || "Premium Insurance Policy";
  const handleSuccess = props.onSuccess || (() => {});
  const handleCancel = props.onCancel || (() => {});
  const handleAlert =
    props.showAlert ||
    ((type, message) => {
      alert(`${type.toUpperCase()}: ${message}`);
    });

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    return cleaned;
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    return cleaned;
  };

  const getCardType = (number) => {
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5") || number.startsWith("2")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    return "generic";
  };

  const getCardGradient = (type) => {
    switch (type) {
      case "visa":
        return "from-blue-600 via-blue-700 to-blue-800";
      case "mastercard":
        return "from-red-500 via-orange-500 to-yellow-500";
      case "amex":
        return "from-green-600 via-teal-600 to-blue-600";
      default:
        return "from-slate-700 via-slate-800 to-black";
    }
  };

  const handleCardNumberChange = (e) =>
    setCardData((prev) => ({ ...prev, number: formatCardNumber(e.target.value) }));

  const handleExpiryChange = (e) =>
    setCardData((prev) => ({ ...prev, expiry: formatExpiry(e.target.value) }));

  const handleCVCChange = (e) =>
    setCardData((prev) => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) }));

  const handleNameChange = (e) =>
    setCardData((prev) => ({ ...prev, name: e.target.value.toUpperCase() }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
      handleAlert("error", "Please fill in all card details");
      return;
    }
    if (cardData.number.length !== 16) {
      handleAlert("error", "Card number must be 16 digits");
      return;
    }
    if (cardData.cvc.length !== 3) {
      handleAlert("error", "CVC must be 3 digits");
      return;
    }
    setProcessing(true);
    try {
      const result = await processPayment(cardData, title);
      if (result.status === "succeeded") {
        handleAlert("success", "Payment successful");
        handleSuccess();
      }
    } catch (err) {
      handleAlert("error", err.message);
    } finally {
      setProcessing(false);
    }
  };

  const displayCardNumber = cardData.number
    ? cardData.number.replace(/(.{4})/g, "$1 ").trim()
    : "";

  const cardType = getCardType(cardData.number);
  const cardGradient = getCardGradient(cardType);

  const toggleCardNumber = () => setShowCardNumber(!showCardNumber);
  const toggleCVC = () => setShowCVC(!showCVC);

  const fillDemoCard = () =>
    setCardData({
      number: "4242424242424242",
      expiry: "12/34",
      cvc: "123",
      name: "John Doe",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 overflow-y-auto max-h-[90vh]">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Sticky Credit Card */}
        <div className="w-full lg:w-1/2 sticky top-4 self-start">
          <div
            className={`relative w-full h-52 bg-gradient-to-br ${cardGradient} rounded-2xl text-white p-6 shadow-2xl transform transition-transform hover:scale-105 duration-300`}
          >
            <div className="absolute top-4 right-4 opacity-30">
              <Wifi className="w-6 h-6" />
            </div>
            <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg mb-6 shadow-inner relative">
              <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md" />
            </div>
            <p className="text-2xl font-mono tracking-widest font-semibold mb-6">
              {showCardNumber ? displayCardNumber.padEnd(19, "•") || "•••• •••• •••• ••••" : "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <p className="text-xs opacity-75 mb-1">Card Holder</p>
                <p className="font-semibold text-lg uppercase tracking-wide">{cardData.name || "FULL NAME"}</p>
              </div>
              <div className="text-right mr-4">
                <p className="text-xs opacity-75 mb-1">Expires</p>
                <p className="font-semibold text-lg">{cardData.expiry || "MM/YY"}</p>
              </div>
              <div className="w-16 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 translate-x-full animate-pulse" />
          </div>
        </div>

        {/* Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={fillDemoCard}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-xl font-bold"
            >
              Fill Demo Card
            </button>

            {/* Card Number */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Card Number</label>
              <input
                type={showCardNumber ? "text" : "password"}
                placeholder="1234 5678 9012 3456"
                value={displayCardNumber}
                onChange={handleCardNumberChange}
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200 text-lg font-mono bg-gray-50 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={toggleCardNumber}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
              >
                {showCardNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={handleExpiryChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200 text-lg font-mono bg-gray-50 focus:bg-white"
                  maxLength="5"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">CVC</label>
                <input
                  type={showCVC ? "text" : "password"}
                  placeholder="123"
                  value={cardData.cvc}
                  onChange={handleCVCChange}
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200 text-lg font-mono bg-gray-50 focus:bg-white"
                  maxLength="3"
                  required
                />
                <button
                  type="button"
                  onClick={toggleCVC}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showCVC ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardData.name}
                onChange={handleNameChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200 text-lg bg-gray-50 focus:bg-white uppercase"
                required
              />
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700">
                <Lock className="w-4 h-4" />
                <p className="text-sm font-medium">Your payment is secured with 256-bit SSL encryption</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Pay Securely
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={processing}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((page, index, arr) => arr.indexOf(page) === index);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
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
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
        className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main Component
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
          if (response.ok) {
            const data = await response.json();
            const policiesData = safeJsonParse(data.data || data, []);
            if (Array.isArray(policiesData) && policiesData.length > 0) {
              setPolicies(policiesData);
              return;
            }
          }
        } catch (apiError) {
          console.warn("API fetch failed, using mock data:", apiError);
        }
        
        const mockPolicies = [
          { 
            _id: "1", 
            title: "Comprehensive Health Insurance", 
            type: "Health", 
            description: "Complete healthcare coverage with worldwide benefits.", 
            image: "https://picsum.photos/400/240?random=1", 
            coverageAmount: "$100,000", 
            premium: "299", 
            rating: "4.8", 
            term: "Annual", 
            ageMin: "18", 
            ageMax: "65" 
          },
          { 
            _id: "2", 
            title: "Term Life Insurance", 
            type: "Life", 
            description: "Affordable life insurance protection for your family.", 
            image: "https://picsum.photos/400/240?random=2", 
            coverageAmount: "$500,000", 
            premium: "45", 
            rating: "4.9", 
            term: "20 years", 
            ageMin: "21", 
            ageMax: "70" 
          },
          { 
            _id: "3", 
            title: "Auto Insurance Plus", 
            type: "Vehicle", 
            description: "Comprehensive vehicle protection and roadside assistance.", 
            image: "https://picsum.photos/400/240?random=3", 
            coverageAmount: "$25,000", 
            premium: "89", 
            rating: "4.6", 
            term: "6 months", 
            ageMin: "18", 
            ageMax: "75" 
          },
          { 
            _id: "4", 
            title: "Travel Insurance", 
            type: "Travel", 
            description: "Complete travel protection for international trips.", 
            image: "https://picsum.photos/400/240?random=4", 
            coverageAmount: "$50,000", 
            premium: "65", 
            rating: "4.7", 
            term: "Per trip", 
            ageMin: "18", 
            ageMax: "80" 
          },
          { 
            _id: "5", 
            title: "Home Insurance", 
            type: "Home", 
            description: "Protect your home and belongings from unexpected events.", 
            image: "https://picsum.photos/400/240?random=5", 
            coverageAmount: "$300,000", 
            premium: "120", 
            rating: "4.5", 
            term: "Annual", 
            ageMin: "21", 
            ageMax: "75" 
          },
          { 
            _id: "6", 
            title: "Pet Insurance", 
            type: "Pet", 
            description: "Keep your furry friends healthy with comprehensive coverage.", 
            image: "https://picsum.photos/400/240?random=6", 
            coverageAmount: "$15,000", 
            premium: "35", 
            rating: "4.4", 
            term: "Annual", 
            ageMin: "18", 
            ageMax: "70" 
          }
        ];
        setPolicies(mockPolicies);
        
      } catch (error) {
        console.error("Failed to fetch policies:", error);
        setPolicies([]);
        showAlert("error", "Failed to load policies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolicies();
  }, []);

  useEffect(() => { 
    setCurrentPage(1); 
  }, [searchTerm, filterType]);

  const filteredPolicies = policies.filter((policy) => {
    const matchesType = filterType === "All" || policy.type === filterType;
    const matchesSearch = policy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPolicies = filteredPolicies.slice(startIndex, endIndex);

  const handlePayment = (policy) => {
    if (!user) {
      showAlert("error", "Please login to purchase a policy");
      return;
    }
    setCheckoutData(policy);
  };

  const handleCheckoutSuccess = () => {
    setCheckoutData(null);
  };

  const handleCheckoutCancel = () => {
    setCheckoutData(null);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {successAlert.show && (
        <SuccessAlert 
          show={successAlert.show} 
          onClose={() => setSuccessAlert({ show: false, policyTitle: "" })} 
          policyTitle={successAlert.policyTitle} 
        />
      )}
      {errorAlert.show && (
        <ErrorAlert 
          show={errorAlert.show} 
          onClose={() => setErrorAlert({ show: false, message: "" })} 
          message={errorAlert.message} 
        />
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Insurance Policies
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-6">
          Explore our wide range of insurance plans designed to protect your life, health, and assets. Compare policies, check premiums, and secure your future today.
        </p>
        <div className="flex justify-center">
          <span className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 w-full md:w-1/2 shadow-sm transition-all"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 shadow-sm transition-all"
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
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600 text-lg">Loading policies...</span>
        </div>
      ) : currentPolicies.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No policies found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPolicies.map((policy) => (
              <div key={policy._id} className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                <div className="relative overflow-hidden">
                  <img 
                    src={policy.image} 
                    alt={policy.title} 
                    className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105" 
                  />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {policy.type}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">{policy.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{policy.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700 text-sm">Coverage: {policy.coverageAmount}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 text-sm">Premium: ${policy.premium}/month</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-gray-700 text-sm">{policy.rating} Rating</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handlePayment(policy)}
                    className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      user
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                    disabled={!user}
                  >
                    <CreditCard className="w-5 h-5" />
                    {user ? "Pay Premium" : "Login Required"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}

      {checkoutData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <CheckoutForm
            policyTitle={checkoutData.title}
            onSuccess={handleCheckoutSuccess}
            onCancel={handleCheckoutCancel}
            showAlert={showAlert}
          />
        </div>
      )}
    </div>
  );
};

export default () => (
  
    <PolicyCardsWithPayment />
  
);