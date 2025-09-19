// src/components/UserInsuranceCards.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  CreditCard,
  User,
  Heart,
  Calendar,
  FileText,
} from "lucide-react";

const API_MANAGEMENT = "https://insurances-lmy8.onrender.com/management";
const API_BOOKINSURANCE = "https://insurances-lmy8.onrender.com/bookInsurance";

const UserInsuranceCards = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [managementRes, bookInsuranceRes] = await Promise.all([
          fetch(API_MANAGEMENT),
          fetch(API_BOOKINSURANCE),
        ]);

        const managementData = await managementRes.json();
        const bookInsuranceData = await bookInsuranceRes.json();

        const allData = [...managementData, ...bookInsuranceData];
        const filtered = allData.filter((item) => item.email === user?.email);
        setData(filtered);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch insurance data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchData();
  }, [user?.email]);

  if (!user)
    return <p className="text-center mt-10 text-red-500">Please login to see your insurance records.</p>;
  if (loading) return <p className="text-center mt-10 text-gray-600">Loading insurance records...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (data.length === 0) return <p className="text-center mt-10 text-gray-500">No insurance records found.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
        >
          {/* Image Banner */}
          <div className="relative h-44 w-full">
            <img
              src={item.image || "https://via.placeholder.com/400x200"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
              <h2 className="text-white text-lg font-semibold truncate">{item.name}</h2>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 truncate">{item.email}</p>
              <p className="text-gray-700 text-sm font-medium">{item.insuranceType?.toUpperCase()} Insurance</p>

              {/* Info Rows with Icons */}
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>Coverage: ${item.coverage}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Calendar className="w-4 h-4 text-green-500" />
                <span>Payment Term: {item.paymentTerm}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <User className="w-4 h-4 text-purple-500" />
                <span>Nominee: {item.nomineeName} ({item.nomineeRelation})</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Health Condition: {item.healthCondition}</span>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                item.status === "Accepted"
                  ? "bg-green-100 text-green-800"
                  : item.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.status}
            </span>

            {/* Document Links */}
            <div className="mt-3 flex flex-wrap gap-2">
              {item.nidDocumentUrl && (
                <a
                  href={item.nidDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> NID Document
                </a>
              )}
              {item.additionalDocsUrl && (
                <a
                  href={item.additionalDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" /> Additional Docs
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserInsuranceCards;
