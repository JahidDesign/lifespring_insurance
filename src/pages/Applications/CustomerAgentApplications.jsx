// File: CustomerAgentApplications.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // assuming you have auth context

export default function CustomerAgentApplications() {
  const { user } = useContext(AuthContext); // logged-in user
  const [applications, setApplications] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/management");
      // filter apps by email (customer/agent sees only theirs)
      const filtered = res.data.filter((app) => app.email === user?.email);
      setApplications(filtered);
    } catch (err) {
      console.error("Error fetching apps:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">📑 My Insurance Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">No applications found for your account.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Insurance Type</th>
              <th className="p-3">Coverage</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{app.insuranceType}</td>
                <td className="p-3">${app.coverage}</td>
                <td
                  className={`p-3 font-semibold ${
                    app.status === "Approved"
                      ? "text-green-600"
                      : app.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
