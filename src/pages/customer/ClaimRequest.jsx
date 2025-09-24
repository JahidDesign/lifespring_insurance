// File: ClaimRequest.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ClaimRequest = () => {
  const { user } = useContext(AuthContext);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ policyId: "", reason: "", documentUrl: "" });
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    axios
      .get(`https://insurances-lmy8.onrender.com/policies`)
      .then((res) => {
        // Filter only approved or existing policies
        setPolicies(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [user.email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.policyId) return alert("Select a policy!");

    const data = {
      policyId: form.policyId,
      reason: form.reason,
      documentUrl: form.documentUrl,
    };

    axios
      .post("/api/customer/claims", data)
      .then(() => alert("Claim submitted successfully!"))
      .catch((err) => console.error(err));
  };

  // Convert image URL to Base64 for PDF
  const convertImgToBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = (err) => reject(err);
    });

  const downloadPDF = async () => {
    if (!selectedPolicy) return alert("Select a policy first!");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Insurance Policy Details", 14, 20);
    doc.setFontSize(12);

    const tableData = [
      ["Title", selectedPolicy.title || "—"],
      ["Type", selectedPolicy.type || "—"],
      ["Description", selectedPolicy.description || "—"],
      ["Coverage Amount", selectedPolicy.coverageAmount || "—"],
      ["Premium", selectedPolicy.premium || "—"],
      ["Term", selectedPolicy.term || "—"],
      ["Deductible", selectedPolicy.deductible || "—"],
      ["Min Age", selectedPolicy.ageLimit?.min || "—"],
      ["Max Age", selectedPolicy.ageLimit?.max || "—"],
      ["Benefits", selectedPolicy.benefits?.join(", ") || "—"],
      ["Add-ons", selectedPolicy.addOns?.join(", ") || "—"],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Field", "Value"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    });

    // Add image from URL
    if (selectedPolicy.image) {
      try {
        const imgData = await convertImgToBase64(selectedPolicy.image);
        doc.addImage(imgData, "JPEG", 150, 10, 50, 50);
      } catch (err) {
        console.error("Error loading image:", err);
      }
    }

    doc.save(`${selectedPolicy.title.replace(/\s+/g, "_")}_Policy.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Claim Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={form.policyId}
          onChange={(e) => {
            setForm({ ...form, policyId: e.target.value });
            const policy = policies.find((p) => p._id === e.target.value);
            setSelectedPolicy(policy);
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Policy</option>
          {policies.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Reason for claim"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="url"
          placeholder="Document Image URL (PDF or image)"
          value={form.documentUrl}
          onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <div className="flex gap-4">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Submit Claim
          </button>
          <button
            type="button"
            onClick={downloadPDF}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Download Policy PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimRequest;
