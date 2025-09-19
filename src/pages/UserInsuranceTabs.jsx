// src/components/UserInsuranceTabs.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const API_MANAGEMENT = "https://insurances-lmy8.onrender.com/management";
const API_BOOKINSURANCE = "https://insurances-lmy8.onrender.com/bookInsurance";

const UserInsuranceTabs = () => {
  const { user } = useContext(AuthContext);
  const [managementData, setManagementData] = useState([]);
  const [bookInsuranceData, setBookInsuranceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("management");
  const [selectedCard, setSelectedCard] = useState(null); // Modal state

  // Fetch both APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [managementRes, bookInsuranceRes] = await Promise.all([
          fetch(API_MANAGEMENT),
          fetch(API_BOOKINSURANCE),
        ]);

        const management = await managementRes.json();
        const bookInsurance = await bookInsuranceRes.json();

        const userManagement = management.filter((item) => item.email === user?.email);
        const userBookInsurance = bookInsurance.filter((item) => item.email === user?.email);

        setManagementData(userManagement);
        setBookInsuranceData(userBookInsurance);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch insurance data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchData();
  }, [user?.email]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (managementData.length === 0 && bookInsuranceData.length === 0)
    return <p className="text-center mt-10 text-gray-500">No insurance records found.</p>;

  const activeData = activeTab === "management" ? managementData : bookInsuranceData;

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("management")}
          className={`px-6 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "management"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Management
        </button>
        <button
          onClick={() => setActiveTab("bookInsurance")}
          className={`px-6 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "bookInsurance"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Book Insurance
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeData.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedCard(item)}
            className="cursor-pointer bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={item.image || "https://via.placeholder.com/400x200"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <h2 className="text-white text-lg font-bold">{item.name}</h2>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <p className="text-sm text-gray-500">{item.email}</p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Insurance Type:</span> {item.insuranceType}
              </p>
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
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh] p-6 relative">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            <img
              src={selectedCard.image || "https://via.placeholder.com/600x300"}
              alt={selectedCard.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            <h2 className="text-2xl font-bold mb-2">{selectedCard.name}</h2>
            <p className="text-gray-600 mb-2">{selectedCard.email}</p>
            <p className="text-gray-500 mb-4">{selectedCard.healthDetails || selectedCard.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">DOB:</span> {selectedCard.dob}
              </div>
              <div>
                <span className="font-medium">NID:</span> {selectedCard.nid}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {selectedCard.phone}
              </div>
              <div>
                <span className="font-medium">Insurance Type:</span> {selectedCard.insuranceType}
              </div>
              <div>
                <span className="font-medium">Coverage:</span> {selectedCard.coverage}
              </div>
              <div>
                <span className="font-medium">Payment Term:</span> {selectedCard.paymentTerm}
              </div>
              <div>
                <span className="font-medium">Nominee:</span> {selectedCard.nomineeName} ({selectedCard.nomineeRelation})
              </div>
              <div>
                <span className="font-medium">Health Condition:</span> {selectedCard.healthCondition}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCard.nidDocumentUrl && (
                <a
                  href={selectedCard.nidDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  NID Document
                </a>
              )}
              {selectedCard.additionalDocsUrl && (
                <a
                  href={selectedCard.additionalDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Additional Docs
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInsuranceTabs;
