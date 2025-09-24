// File: src/components/CustomerPaymentsTable.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerPaymentsTable = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://insurances-lmy8.onrender.com/payments?email=${user.email}`
        );
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchPayments();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-500 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-gray-700">Loading your policies...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          <h1 className="text-3xl font-bold text-gray-800">My Insurance Payments</h1>
          <p className="text-gray-600">Manage and review your insurance payments</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Policy</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Coverage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Premium</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.length > 0 ? (
                  payments.map((p, i) => (
                    <tr
                      key={p._id}
                      className={`hover:bg-blue-50 transition-all duration-200 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">{p.title}</td>
                      <td className="px-6 py-4 text-gray-600">{p.type}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">
                        ${p.coverageAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800 font-semibold">${p.premium}</span>
                        <span className="text-xs text-gray-500 ml-1">/mo</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.status === "completed"
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {p.status === "completed" && (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                            Give Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        {payments.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-800">{payments.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {payments.filter((p) => p.status === "completed").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPaymentsTable;
