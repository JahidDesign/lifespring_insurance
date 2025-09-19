import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { authHeader, user } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authHeader) {
      setMessage("Please login first.");
      return;
    }

    fetch("https://insurances-lmy8.onrender.com/customer/protected", {
      method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authHeader}`,  
   },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error");
        return res.json();
      })
      .then((data) => setMessage(`Hello ${user.name}, protected message: ${data.message}`))
      .catch(() => setMessage("Failed to load protected data."));
  }, [authHeader, user]);

  return (
    <div className="p-6">
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
