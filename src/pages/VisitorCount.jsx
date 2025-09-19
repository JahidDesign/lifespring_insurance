// src/components/VisitorCount.jsx
import { useEffect, useState } from "react";

const VisitorCount = ({ blogId, initialCount = 0 }) => {
  const [views, setViews] = useState(initialCount);

  // Format numbers like 1.2K, 3.4M
  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  useEffect(() => {
    if (!blogId) return;

    const fetchViews = async () => {
      try {
        const res = await fetch(`https://insurances-lmy8.onrender.com/blogpost/${blogId}`);
        if (!res.ok) throw new Error("Failed to fetch views");
        const data = await res.json();
        setViews(data.views || initialCount);
      } catch (err) {
        console.error(err);
      }
    };

    // Initial fetch
    fetchViews();

    // Poll every 2 seconds
    const interval = setInterval(fetchViews, 2000);

    return () => clearInterval(interval);
  }, [blogId, initialCount]);

  return (
    <span className="font-bold text-blue-600">
      {formatViews(views)} {views === 1 ? "view" : "views"}
    </span>
  );
};

export default VisitorCount;
