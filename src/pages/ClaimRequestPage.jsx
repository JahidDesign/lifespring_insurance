// File: ClaimRequestPage.jsx
import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext"; // adjust the path

const ClaimRequestPage = () => {
  const { user } = useContext(AuthContext); // current logged-in user
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/paymentsInsurance");
        const data = await res.json();
        // Only approved policies
        const approvedPolicies = data.filter((p) => p.status === "approved");
        setPolicies(approvedPolicies);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch policies");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  // Submit a new claim
  const handleClaimSubmit = async (policyId, reason, file) => {
    if (!reason || !file) return toast.error("All fields are required");

    const formData = new FormData();
    formData.append("policyId", policyId);
    formData.append("reason", reason);
    formData.append("file", file);
    formData.append("status", "Pending");
    formData.append("userEmail", user.email); // current user email
    formData.append("userName", user.displayName || user.name); // current user name

    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/claims", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Claim submitted successfully!");
        // Update claim status locally
        setPolicies((prev) =>
          prev.map((p) =>
            p._id === policyId ? { ...p, claimStatus: "Pending" } : p
          )
        );
      } else {
        toast.error("Failed to submit claim");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit claim");
    }
  };

  // SweetAlert for approved claims
  const handleApprovedClick = (policyName) => {
    Swal.fire({
      icon: "success",
      title: "Claim Approved",
      text: `Your claim for ${policyName} is approved!`,
    });
  };

  if (loading) return <p>Loading policies...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster />
      <h1 className="text-3xl font-bold mb-2">Claim Request Page</h1>
      <h2 className="mb-6 text-lg">
        Welcome, {user.displayName || user.email}!
      </h2>

      {policies.length === 0 ? (
        <p>No approved policies available for claims.</p>
      ) : (
        <div className="grid gap-6">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="bg-white p-4 rounded-xl shadow flex flex-col gap-4"
            >
              <h2 className="text-xl font-semibold">{policy.name}</h2>

              {policy.claimStatus ? (
                policy.claimStatus === "Approved" ? (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded w-32"
                    onClick={() => handleApprovedClick(policy.name)}
                  >
                    Approved
                  </button>
                ) : (
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded w-32 text-center">
                    {policy.claimStatus}
                  </span>
                )
              ) : (
                <ClaimForm policy={policy} onSubmit={handleClaimSubmit} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ClaimForm component
const ClaimForm = ({ policy, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(policy._id, reason, file);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={policy.name}
        readOnly
        className="border p-2 rounded bg-gray-100"
      />
      <textarea
        placeholder="Reason for claim"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="file"
        accept="application/pdf,image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Claim
      </button>
    </form>
  );
};

export default ClaimRequestPage;
