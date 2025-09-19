// src/components/VisitorDetailsPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const VisitorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);

  // Function to fetch visitor details
  const fetchVisitor = async () => {
    try {
      const res = await fetch(`https://insurances-lmy8.onrender.com/visitors/${id}`);
      if (!res.ok) throw new Error("Failed to fetch visitor details");
      const data = await res.json();
      setVisitor(data);
      setViews(data.views || 0);
    } catch (error) {
      console.error("Error loading visitor details:", error);
    } finally {
      setLoading(false);
    }
  };

  // =================== Initial fetch + increment views ===================
  useEffect(() => {
    if (!id) return;

    const incrementViews = async () => {
      try {
        // Increment views on the server
        await fetch(`https://insurances-lmy8.onrender.com/visitors/${id}/increment-view`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Error incrementing views:", err);
      }
    };

    incrementViews(); // increment once on page load
    fetchVisitor(); // fetch latest data

  }, [id]);

  // =================== Poll views every 2 seconds ===================
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://insurances-lmy8.onrender.com/visitors/${id}`);
        if (!res.ok) throw new Error("Failed to fetch visitor views");
        const data = await res.json();
        setViews(data.views || 0);
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  // =================== Format views ===================
  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading visitor details...</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">Visitor details not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-6 mt-10 shadow-xl rounded-lg">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      {/* Visitor Image */}
      <img
        src={visitor.image || "https://via.placeholder.com/800x400"}
        alt={visitor.title}
        className="w-full h-96 object-cover rounded-lg"
      />

      {/* Title */}
      <h2 className="text-3xl font-bold mt-6 mb-2">{visitor.title}</h2>

      {/* Views */}
      <p className="text-sm text-gray-500 mb-4">
        👁️ {formatViews(views)} {views === 1 ? "view" : "views"}
      </p>

      {/* Description */}
      <p className="text-gray-700 text-base mb-4">{visitor.description}</p>

      {/* External Link */}
      {visitor.link && (
        <a
          href={visitor.link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Visit Source ↗
        </a>
      )}

      {/* Date */}
      {visitor.createdAt && (
        <p className="mt-4 text-sm text-gray-500">
          Date: {new Date(visitor.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default VisitorDetailsPage;
