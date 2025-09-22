import React, { useEffect, useState, useContext } from "react";
import { CreditCard, Shield, DollarSign, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

// Mock AuthContext for demonstration
const AuthContext = React.createContext({ user: { name: "John Doe" } });

// Mock toast for demonstration
const toast = {
  error: (message) => console.log("Error:", message),
  success: (message) => console.log("Success:", message)
};

const PoliciesTable = () => {
  const { user } = useContext(AuthContext);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockPolicies = [
      {
        _id: "1",
        title: "Comprehensive Health Insurance",
        type: "Health",
        premium: 299,
        coverageAmount: 50000,
        status: "Pending"
      },
      {
        _id: "2",
        title: "Auto Insurance Premium",
        type: "Vehicle",
        premium: 189,
        coverageAmount: 25000,
        status: "Accepted"
      },
      {
        _id: "3",
        title: "Life Insurance Policy",
        type: "Life",
        premium: 450,
        coverageAmount: 100000,
        status: "Pending"
      },
      {
        _id: "4",
        title: "Home Insurance Coverage",
        type: "Property",
        premium: 320,
        coverageAmount: 75000,
        status: "Rejected"
      }
    ];
    
    setTimeout(() => {
      setPolicies(mockPolicies);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setPolicies((prev) =>
      prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handlePayment = (policy) => {
    if (!user) {
      toast.error("Please login to pay premium");
      return;
    }
    toast.success(`Proceed to pay $${policy.premium} for ${policy.title}`);
    handleStatusChange(policy._id, "Accepted");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "health":
        return <Shield className="w-5 h-5 text-green-600" />;
      case "vehicle":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "life":
        return <Shield className="w-5 h-5 text-purple-600" />;
      case "property":
        return <Shield className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 font-medium">Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Insurance Policies</h1>
          <p className="text-gray-600">Manage and track your insurance policies</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Policies</p>
                <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {policies.filter(p => p.status === "Accepted").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {policies.filter(p => p.status === "Pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Premium</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${policies.reduce((sum, p) => sum + p.premium, 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Policy Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Coverage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {policies.map((policy, index) => (
                  <tr key={policy._id} className={`hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                  }`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getTypeIcon(policy.type)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{policy.title}</div>
                          <div className="text-xs text-gray-500">Policy ID: {policy._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {policy.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">{policy.premium}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-lg font-bold text-blue-600">${policy.coverageAmount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-semibold ${
                        policy.status === "Accepted"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : policy.status === "Rejected"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}>
                        {getStatusIcon(policy.status)}
                        <span>{policy.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handlePayment(policy)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                            user
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          }`}
                          disabled={!user}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>{user ? "Pay Premium" : "Login Required"}</span>
                        </button>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(policy._id, "Rejected")}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 transform hover:scale-110"
                            title="Reject Policy"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(policy._id, "Pending")}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all duration-200 transform hover:scale-110"
                            title="Mark as Pending"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {policies.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-600">There are no insurance policies to display at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliciesTable;