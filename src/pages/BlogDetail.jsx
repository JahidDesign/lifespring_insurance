// src/pages/BlogDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Eye, Heart, ArrowLeft, BookOpen, Star, Zap, TrendingUp } from "lucide-react";

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for background animation
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch blog and increment visitor count
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        // Fetch blog data
        const res = await fetch(`https://insurances-lmy8.onrender.com/blogpost/${blogId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setBlog(data);
        setError(null);

        // Increment visitor count
        await fetch(`https://insurances-lmy8.onrender.com/blogpost/${blogId}/views`, {
          method: "PATCH",
        });

        // Optional: increment locally too for instant UI update
        setBlog((prev) => ({ ...prev, views: (prev.views || 0) + 1 }));
      } catch (err) {
        console.error(err);
        setError("Failed to load blog. Please try again later.");

        // Fallback demo data
        setBlog({
          _id: blogId,
          title: "Sample Blog Title",
          details:
            "This is a sample blog content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
          category: "Technology",
          author: "Demo Author",
          date: "2024-03-15",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop&auto=format",
          authorImage:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
          views: 12345,
          likes: 678,
          trending: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "from-blue-500 via-cyan-500 to-teal-500",
      Finance: "from-cyan-500 via-blue-500 to-purple-500",
      Insurance: "from-indigo-500 via-purple-500 to-pink-500",
      default: "from-gray-500 via-slate-500 to-gray-600",
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Technology: Zap,
      Finance: TrendingUp,
      Insurance: Star,
      default: BookOpen,
    };
    const Icon = icons[category] || icons.default;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };

  const estimateReadTime = (content) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  };

  const getDefaultImage = () =>
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop&auto=format";
  const getDefaultAuthorImage = () =>
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format";

  if (loading)
    return <p className="text-center mt-20 text-gray-600 text-lg font-semibold">Loading blog...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-600 text-lg font-semibold">
        {error} <button onClick={() => window.location.reload()}>Try Again</button>
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 py-16 px-4 relative overflow-hidden">
      {/* Background floating glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse transition-all duration-1000"
          style={{ left: mousePosition.x * 0.02, top: mousePosition.y * 0.02 }}
        />
        <div
          className="absolute w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000 transition-all duration-1000"
          style={{ right: mousePosition.x * -0.01, bottom: mousePosition.y * -0.01 }}
        />
      </div>

      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Blog Image */}
        <div className="relative w-full h-96 overflow-hidden">
          <img
            src={blog.image || getDefaultImage()}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            onError={(e) => (e.target.src = getDefaultImage())}
          />
          {/* Category badge */}
          {blog.category && (
            <div
              className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${getCategoryColor(
                blog.category
              )} text-white text-sm font-bold rounded-full backdrop-blur-lg shadow-lg`}
            >
              {getCategoryIcon(blog.category)}
              <span>{blog.category}</span>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="p-10 space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:underline font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </button>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800">{blog.title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {formatDate(blog.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {estimateReadTime(blog.details)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {formatViews(blog.views)} views
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {blog.likes || 0} likes
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={blog.authorImage || getDefaultAuthorImage()}
                alt={blog.author || "Author"}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <span className="font-semibold text-gray-800">{blog.author || "Anonymous"}</span>
            </div>
          </div>

          {/* Blog Text */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.details}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
