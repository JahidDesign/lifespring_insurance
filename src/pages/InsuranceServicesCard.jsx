// src/components/InsuranceServicesCard.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

/** --------------------------
 * CONFIG
 * ------------------------- */
const API_URL = "https://insurances-lmy8.onrender.com";
const STRIPE_PUBLISHABLE_KEY = "pk_test_51RlaogHFEqisEz1rnVNjVu1b1saeegABrIlnTksfo9u7pE5GZioTcAkwhojpLETNRxVRYZj21tJjSP77XC4h2RiU009PBYfGYR";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

/** --------------------------
 * CARD HELPERS
 * ------------------------- */
const cardLogos = {
  Visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
  MasterCard: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
  Amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
  Unknown: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Credit_card_font_awesome.svg",
};

const detectCardType = (numStr) => {
  const cleaned = (numStr || "").replace(/\s+/g, "");
  if (/^4/.test(cleaned)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(cleaned)) return "MasterCard";
  if (/^3[47]/.test(cleaned)) return "Amex";
  return "Unknown";
};

const formatCardNumberPreview = (val) => (val || "").replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiryPreview = (val) => {
  const digits = (val || "").replace(/\D/g, "").slice(0, 4);
  return digits.length < 3 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

/** --------------------------
 * FILTER BAR
 * ------------------------- */
const FiltersBar = ({ search, setSearch, sortBy, setSortBy, minPremium, setMinPremium, maxPremium, setMaxPremium }) => (
  <div className="flex flex-col md:flex-row gap-3 md:items-end mb-6">
    <div className="flex-1">
      <label className="block mb-1 text-sm text-gray-600">Search</label>
      <input
        type="text"
        placeholder="Search services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>

    <div className="w-full md:w-48">
      <label className="block mb-1 text-sm text-gray-600">Sort by</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <option value="relevance">Relevance</option>
        <option value="priceAsc">Price: Low → High</option>
        <option value="priceDesc">Price: High → Low</option>
        <option value="alpha">Name: A → Z</option>
      </select>
    </div>

    <div className="w-full md:w-40">
      <label className="block mb-1 text-sm text-gray-600">Min premium</label>
      <input
        type="number"
        min={0}
        placeholder="e.g. 100"
        value={minPremium}
        onChange={(e) => setMinPremium(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>

    <div className="w-full md:w-40">
      <label className="block mb-1 text-sm text-gray-600">Max premium</label>
      <input
        type="number"
        min={0}
        placeholder="e.g. 500"
        value={maxPremium}
        onChange={(e) => setMaxPremium(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  </div>
);

/** --------------------------
 * PAGINATION
 * ------------------------- */
const Pagination = ({ page, setPage, totalPages }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">‹</button>
      {pages.map((p) => (
        <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border ${page === p ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"}`}>{p}</button>
      ))}
      <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">›</button>
    </div>
  );
};

/** --------------------------
 * SERVICE CARD
 * ------------------------- */
const ServiceCard = ({ service, canPay, onPay }) => (
  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all">
    <img src={service.imageUrl} alt={service.serviceName} className="w-full h-56 object-cover" />
    <div className="p-6 space-y-3">
      <h4 className="text-2xl font-bold text-gray-800">{service.serviceName}</h4>
      <p className="text-sm text-gray-500">Provider: {service.providerName}</p>
      <p className="text-sm font-semibold">Coverage: {service.coverageAmount}</p>
      <p className="text-sm font-semibold">Premium: ${service.premium}</p>
      {service.description && <p className="text-gray-600">{service.description}</p>}
      <div className="text-sm text-gray-400 space-y-1">
        {service.contactEmail && <p>Email: {service.contactEmail}</p>}
        {service.contactNumber && <p>Phone: {service.contactNumber}</p>}
      </div>

      <button
        onClick={onPay}
        disabled={!canPay}
        className={`w-full mt-4 py-3 rounded-xl text-white font-bold transition ${canPay ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-700 hover:to-purple-700" : "bg-gray-400 cursor-not-allowed"}`}
        title={canPay ? "Proceed to payment" : "Login required"}
      >
        {canPay ? "Pay Now" : "Login Required"}
      </button>
    </div>
  </div>
);

/** --------------------------
 * STRIPE PAYMENT FORM
 * ------------------------- */
const StripePaymentForm = ({ selectedService, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);

  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [preview, setPreview] = useState({ cardNumber: "", expiry: "", cvv: "", name: "" });
  const cardType = useMemo(() => detectCardType(preview.cardNumber), [preview.cardNumber]);

  useEffect(() => {
    let mounted = true;
    const createIntent = async () => {
      try {
        const res = await fetch(`${API_URL}/paymentsInsurance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyId: selectedService._id,
            title: selectedService.serviceName,
            premium: Number(selectedService.premium),
            coverageAmount: selectedService.coverageAmount,
            type: selectedService.type || "Standard",
          }),
        });
        if (!res.ok) throw new Error("Failed to create payment");
        const data = await res.json();
        if (!mounted) return;
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
      } catch (e) {
        console.error(e);
        Swal.fire({ icon: "error", title: "Payment Error", text: e.message || "Could not initialize payment." });
        onClose();
      }
    };
    createIntent();
    return () => { mounted = false; };
  }, [selectedService, onClose]);

  const onChangePreview = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") setPreview((p) => ({ ...p, cardNumber: formatCardNumberPreview(value) }));
    else if (name === "expiry") setPreview((p) => ({ ...p, expiry: formatExpiryPreview(value) }));
    else setPreview((p) => ({ ...p, [name]: value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    const card = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: preview.name || user?.displayName || "Customer", email: user?.email },
        },
      });
      if (error) throw new Error(error.message);

      await fetch(`${API_URL}/paymentsInsurance/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      Swal.fire({
        icon: "success",
        title: "Payment Successful",
        html: `Payment ID: <strong>${paymentIntent.id}</strong><br/>Your <strong>${selectedService.serviceName}</strong> policy is now active!`,
      });
      onClose();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Payment Failed", text: err.message || "Something went wrong" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      {/* Card Preview */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white shadow-lg">
        <img src={cardLogos[cardType]} alt={cardType} className="absolute top-4 right-4 h-10" />
        <div className="mt-8 space-y-1">
          <p className="tracking-widest text-xl font-bold">{formatCardNumberPreview(preview.cardNumber) || "**** **** **** ****"}</p>
          <div className="flex justify-between items-center text-sm">
            <span>{preview.name || "FULL NAME"}</span>
            <span>{formatExpiryPreview(preview.expiry) || "MM/YY"}</span>
          </div>
        </div>
      </div>

      {/* Preview Inputs */}
      <div className="space-y-2">
        <input type="text" name="cardNumber" value={preview.cardNumber} onChange={onChangePreview} placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200" />
        <div className="flex gap-4">
          <input type="text" name="expiry" value={preview.expiry} onChange={onChangePreview} placeholder="MM/YY" className="flex-1 px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200" />
          <input type="password" name="cvv" value={preview.cvv} onChange={onChangePreview} maxLength={4} placeholder="CVV" className="flex-1 px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200" />
        </div>
        <input type="text" name="name" value={preview.name} onChange={onChangePreview} placeholder="Cardholder Name" className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-200" />
      </div>

      {/* Stripe Card Element */}
      <div className="border rounded-xl p-3">
        <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: "16px", "::placeholder": { color: "#a0aec0" } } } }} />
      </div>

      <button type="submit" disabled={isProcessing} className={`w-full py-3 rounded-xl text-white font-bold transition ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-700 hover:to-purple-700"}`}>
        {isProcessing ? "Processing..." : `Pay $${selectedService.premium}`}
      </button>

      <p className="text-xs text-gray-400">* The preview fields are for visual feedback only. Your card details are securely handled by Stripe.</p>
    </form>
  );
};

/** --------------------------
 * PAYMENT MODAL
 * ------------------------- */
const PaymentModal = ({ service, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Secure Payment</h3>
          <p className="text-sm opacity-90">You’re paying for: {service.serviceName}</p>
        </div>
        <button onClick={onClose} className="text-white text-3xl font-bold hover:text-gray-200" aria-label="Close">×</button>
      </div>
      <div className="p-6 space-y-2">
        <div className="text-sm text-gray-600">
          <p><span className="font-semibold">Provider:</span> {service.providerName}</p>
          <p><span className="font-semibold">Premium:</span> ${service.premium}</p>
        </div>
        <Elements stripe={stripePromise}>
          <StripePaymentForm selectedService={service} onClose={onClose} />
        </Elements>
      </div>
    </div>
  </div>
);

/** --------------------------
 * MAIN COMPONENT
 * ------------------------- */
const InsuranceServicesCard = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [minPremium, setMinPremium] = useState("");
  const [maxPremium, setMaxPremium] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 3;

  const [selectedService, setSelectedService] = useState(null);

  // fetch services
  useEffect(() => {
    let active = true;
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/insuranceservices`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        if (!active) return;
        setServices(Array.isArray(data?.services) ? data.services : []);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: "error", title: "Oops", text: "Could not load insurance services." });
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchServices();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...services];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.serviceName?.toLowerCase().includes(q) ||
          s.providerName?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }
    const min = minPremium !== "" ? Number(minPremium) : null;
    const max = maxPremium !== "" ? Number(maxPremium) : null;
    if (min !== null) list = list.filter((s) => Number(s.premium) >= min);
    if (max !== null) list = list.filter((s) => Number(s.premium) <= max);
    if (sortBy === "priceAsc") list.sort((a, b) => Number(a.premium) - Number(b.premium));
    if (sortBy === "priceDesc") list.sort((a, b) => Number(b.premium) - Number(a.premium));
    if (sortBy === "alpha") list.sort((a, b) => (a.serviceName || "").localeCompare(b.serviceName || ""));
    return list;
  }, [services, search, sortBy, minPremium, maxPremium]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => setPage(1), [search, sortBy, minPremium, maxPremium]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-gray-500">Loading insurance services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <FiltersBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minPremium={minPremium}
        setMinPremium={setMinPremium}
        maxPremium={maxPremium}
        setMaxPremium={setMaxPremium}
      />

      {pageData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageData.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              canPay={!!user}
              onPay={() => setSelectedService(service)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-12">
          No insurance services found matching your criteria.
        </div>
      )}

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {selectedService && (
        <PaymentModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default InsuranceServicesCard;
