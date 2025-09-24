import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const MyPolicies = () => {
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchPayments();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading your policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">My Policies</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Policy</th>
            <th className="border p-2">Coverage</th>
            <th className="border p-2">Premium</th>
            <th className="border p-2">Payment Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="odd:bg-gray-100">
              <td className="border p-2">{p.title}</td>
              <td className="border p-2">{p.coverageAmount.toLocaleString()}</td>
              <td className="border p-2">${p.premium}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded-full text-white font-semibold ${
                    p.status === "completed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </td>
              <td className="border p-2">
                {p.status === "completed" && (
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    Give Review
                  </button>
                )}
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No policies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyPolicies;
