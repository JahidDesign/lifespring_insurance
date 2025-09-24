import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentStatus = () => {
  const { user } = useContext(AuthContext);
  const [policies, setPolicies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/customer/policies?email=${user.email}`)
      .then(res => setPolicies(res.data.filter(p => p.status === "Approved")))
      .catch(err => console.error(err));
  }, [user.email]);

  const handlePay = (policyId) => {
    navigate(`/customer/payments/pay/${policyId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Policy</th>
            <th className="border p-2">Premium</th>
            <th className="border p-2">Frequency</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(p => (
            <tr key={p._id} className="odd:bg-gray-100">
              <td className="border p-2">{p.title}</td>
              <td className="border p-2">${p.premium}</td>
              <td className="border p-2">{p.frequency || "Monthly"}</td>
              <td className="border p-2">{p.paymentStatus || "Due"}</td>
              <td className="border p-2">
                {p.paymentStatus !== "Paid" && (
                  <button
                    onClick={() => handlePay(p._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentStatus;
