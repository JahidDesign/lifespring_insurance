// File: PaymentsTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("https://insurances-lmy8.onrender.com/payments");
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return <p className="text-gray-600 text-center py-6">Loading payments...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-lg">
        <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Type</th>
            <th className="py-3 px-4 text-right">Premium ($)</th>
            <th className="py-3 px-4 text-right">Coverage ($)</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-center">Actions</th>
            <th className="py-3 px-4 text-left">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">{payment.title}</td>
              <td className="py-3 px-4">{payment.type}</td>
              <td className="py-3 px-4 text-right">{payment.premium}</td>
              <td className="py-3 px-4 text-right">{payment.coverageAmount}</td>
              <td className="py-3 px-4 text-center">
                {payment.status === "completed" ? (
                  <div className="flex items-center justify-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </div>
                ) : payment.status === "rejected" ? (
                  <div className="flex items-center justify-center gap-1 text-red-600 font-medium">
                    <XCircle className="w-4 h-4" /> Rejected
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-yellow-600 font-medium">
                    <AlertCircle className="w-4 h-4" /> Pending
                  </div>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <h3 className="text-gray-700 font-semibold text-center text-sm bg-yellow-100 px-2 py-1 rounded-md">
                  This is controlled only by admin
                </h3>
              </td>
              <td className="py-3 px-4">
                {format(new Date(payment.createdAt), "dd MMM yyyy, hh:mm a")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
