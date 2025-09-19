import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetch("https://insurances-lmy8.onrender.com/insuranceservices")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        const income = data
          .filter((t) => t.status === "success")
          .reduce((sum, t) => sum + t.amount, 0);
        setTotalIncome(income);
      });
  }, []);

  // Sample bar chart data based on date (grouping optional)
  const chartData = transactions.map((t) => ({
    date: new Date(t.date).toLocaleDateString(),
    amount: t.status === "success" ? t.amount : 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-black bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">💳 Manage Transactions</h2>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div className="text-xl font-semibold text-green-700">
          Total Income: ৳ {totalIncome.toFixed(2)}
        </div>
        {/* Optional Filter Buttons (UI only) */}
        <div className="flex gap-2">
          <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white">
            Filter by Date
          </button>
          <button className="border border-green-500 text-green-500 px-3 py-1 rounded hover:bg-green-500 hover:text-white">
            Filter by User
          </button>
          <button className="border border-purple-500 text-purple-500 px-3 py-1 rounded hover:bg-purple-500 hover:text-white">
            Filter by Policy
          </button>
        </div>
      </div>

      {/* 📊 Earnings Chart */}
      <div className="mb-10">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 Transaction Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">getCustomerCollection() Email</th>
              <th className="px-4 py-2 border">Policy Name</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 border">{t.transactionId}</td>
                <td className="px-4 py-2 border">{t.customerEmail}</td>
                <td className="px-4 py-2 border">{t.policyName}</td>
                <td className="px-4 py-2 border">৳ {t.amount}</td>
                <td className="px-4 py-2 border">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td
                  className={`px-4 py-2 border font-semibold ${
                    t.status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTransactions;
