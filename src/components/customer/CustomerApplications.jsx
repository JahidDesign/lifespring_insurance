// File: CustomerApplications.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function CustomerApplications() {
  const { user } = useContext(AuthContext); // logged in user
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user?.email) return;
    axios
      .get("https://insurances-lmy8.onrender.com/management")
      .then((res) => {
        const myApps = res.data.filter((app) => app.email === user.email);
        setApplications(myApps);
      })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">📋 My Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Policy Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Coverage</th>
              <th className="p-3">Payment Term</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{app.insuranceType}</td>
                <td className="p-3 capitalize">{app.insuranceType}</td>
                <td className="p-3">${app.coverage}</td>
                <td className="p-3">{app.paymentTerm}</td>
                <td
                  className={`p-3 font-semibold ${
                    app.status === "Pending"
                      ? "text-yellow-600"
                      : "text-green-600"
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
