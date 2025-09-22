// src/components/VisitorCountHome.jsx
import { useEffect, useState } from "react";

const VisitorCountHome = ({ blogIds, initialCount = 0 }) => {
  const [views, setViews] = useState(initialCount);

  // Format numbers like 1.2K, 3.4M
  const formatViews = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num;
  };

  useEffect(() => {
    if (!blogIds) return;

    const fetchViews = async () => {
      try {
        const res = await fetch(
          `https://insurances-lmy8.onrender.com/blogpostHome/${blogIds}`
        );
        if (!res.ok) throw new Error("Failed to fetch views");
        const data = await res.json();
        setViews(data.views || initialCount);
      } catch (err) {
        console.error(err);
      }
    };

    // Initial fetch
    fetchViews();

    // Poll every 5 seconds
    const interval = setInterval(fetchViews, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [blogIds, initialCount]);

  return (
    <span className="font-bold text-blue-600">
      {formatViews(views)} {views === 1 ? "view" : "views"}
    </span>
  );
};

export default VisitorCountHome;
