// src/pages/MyPolicies.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

const MyPolicies = () => {
  const { user } = useContext(AuthContext);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const res = await fetch("https://insurances-lmy8.onrender.com/insuranceservicesBooking");
        if (!res.ok) throw new Error("Failed to fetch policies");
        const data = await res.json();

        // Filter policies by logged-in user
        const userPolicies = data.filter(p => p.userEmail === user.email);
        setPolicies(userPolicies);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your policies");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [user?.email]);

  if (loading) return <p className="text-center mt-10">Loading your policies...</p>;
  if (policies.length === 0) return <p className="text-center mt-10">No policies found for {user.email}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Toaster position="top-right" />
      {policies.map(policy => (
        <div key={policy._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative w-full h-48">
            <img src={policy.imageUrl} alt={policy.serviceName} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 flex flex-col gap-3">
            <h2 className="text-xl font-bold">{policy.serviceName}</h2>
            <p className="text-gray-600">Provider: {policy.providerName}</p>
            <p className="text-gray-600">Coverage: ${policy.coverageAmount.toLocaleString()}</p>
            <p className="text-gray-600 font-semibold">Premium: ${policy.premium.toFixed(2)}</p>
            <p className="text-gray-700 text-sm line-clamp-3">{policy.description}</p>
            <p className="text-gray-400 text-xs mt-2">Created: {format(new Date(policy.createdAt), "PPP")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPolicies;
