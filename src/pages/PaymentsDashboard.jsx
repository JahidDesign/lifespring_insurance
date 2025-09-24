import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userEmail: "",
    policyTitle: "",
    startDate: "",
    endDate: "",
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/payments");
      setPayments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesEmail =
      !filters.userEmail || p.userEmail.toLowerCase().includes(filters.userEmail.toLowerCase());
    const matchesPolicy =
      !filters.policyTitle || p.title.toLowerCase().includes(filters.policyTitle.toLowerCase());
    const matchesDate =
      (!filters.startDate || new Date(p.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(p.createdAt) <= new Date(filters.endDate));
    return matchesEmail && matchesPolicy && matchesDate;
  });

  const totalIncome = filteredPayments.reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);

  const chartData = filteredPayments.reduce((acc, p) => {
    const date = format(new Date(p.createdAt), "yyyy-MM-dd");
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.amount += Number(p.paidAmount || 0);
    } else {
      acc.push({ date, amount: Number(p.paidAmount || 0) });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Payments Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by user email"
          value={filters.userEmail}
          onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by policy"
          value={filters.policyTitle}
          onChange={(e) => setFilters({ ...filters, policyTitle: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      <div className="mb-6 text-xl font-semibold">
        Total Income: <span className="text-green-600">${totalIncome}</span>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Transaction ID</th>
              <th className="p-3 border">Customer Email</th>
              <th className="p-3 border">Policy Name</th>
              <th className="p-3 border">Paid Amount</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6">Loading...</td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6">No payments found</td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p._id} className="text-center border-t">
                  <td className="p-3">{p.transactionId || "N/A"}</td>
                  <td className="p-3">{p.userEmail}</td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">${p.paidAmount}</td>
                  <td className="p-3">{format(new Date(p.createdAt), "dd/MM/yyyy")}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-white ${
                      p.status === "succeeded" ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {p.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="h-64 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Earnings Over Time</h2>
        {chartData.length === 0 ? (
          <p className="text-center text-gray-500 mt-16">No data to display</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PaymentsDashboard;
