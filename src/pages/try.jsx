// src/pages/BlogDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, Eye, Heart, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

// Skeleton component
const Skeleton = ({ height = "6rem", width = "100%", className = "" }) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-2xl ${className}`}
    style={{ height, width }}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [showModal, setShowModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    age: "",
    gender: "",
    coverage: "",
    duration: "",
    smoker: "No",
  });
  const [estimatedPremium, setEstimatedPremium] = useState(null);

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://insurances-lmy8.onrender.com/blogpost");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        const foundBlog = data.find((b) => b._id === blogId);
        if (!foundBlog) {
          setBlog(null);
          toast.error("Blog not found");
          return;
        }
        setBlog(foundBlog);

        // Increment views
        await fetch(
          `https://insurances-lmy8.onrender.com/blogpost/${blogId}/views`,
          {
            method: "PATCH",
          }
        );
        setBlog((prev) => ({ ...prev, views: (prev?.views || 0) + 1 }));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  // Helpers
  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recent";

  const formatViews = (views) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views || 0;
  };

  const estimateReadTime = (content) =>
    content ? `${Math.ceil(content.split(" ").length / 200)} min read` : "5 min read";

  // Modal form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuoteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEstimate = (e) => {
    e.preventDefault();
    const { age, coverage, duration, smoker } = quoteData;
    if (!age || !coverage || !duration) {
      toast.error("Please fill all fields");
      return;
    }
    let premium =
      (parseInt(coverage) / 1000) *
      (parseInt(duration) / 10) *
      (parseInt(age) / 30);
    if (smoker === "Yes") premium *= 1.5;
    setEstimatedPremium(premium.toFixed(2));
  };

  const handleSubmitPolicy = async (e) => {
    e.preventDefault();

    if (!estimatedPremium) {
      toast.error("Please calculate premium first");
      return;
    }
    if (!user || !user.email) {
      toast.error("You must be logged in to submit a policy");
      return;
    }

    const payload = {
      blogId: blog._id,
      blogTitle: blog.title,
      serviceName: blog.serviceName || blog.title, // ✅ added
      providerName: blog.providerName || "Unknown", // ✅ added
      userEmail: user.email,
      userName: user.displayName || "Anonymous",
      age: quoteData.age,
      gender: quoteData.gender,
      coverage: quoteData.coverage,
      duration: quoteData.duration,
      smoker: quoteData.smoker,
      estimatedPremium,
    };

    try {
      const res = await fetch(
        "https://insurances-lmy8.onrender.com/insuranceservicesBooking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to submit policy");
      }
      toast.success("Policy applied successfully!");
      setShowModal(false);
      navigate("/policiesuser");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(`Failed to submit policy: ${err.message}`);
    }
  };

  // Loading skeleton
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <Skeleton height="28rem" className="rounded-3xl" />
          <Skeleton height="3rem" width="70%" className="rounded-xl" />
          <Skeleton height="1.5rem" width="50%" className="rounded-lg" />
          <Skeleton height="16rem" className="rounded-2xl" />
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center p-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-2xl font-bold text-gray-900 mb-4">Blog not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="relative z-10 py-20 px-4">
        <motion.article
          className="max-w-5xl mx-auto bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Hero image */}
          <div className="relative w-full h-[28rem] overflow-hidden group">
            {!imageLoaded && <Skeleton height="28rem" />}
            <motion.img
              src={blog.image}
              alt={blog.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <motion.button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl text-gray-800 rounded-full border border-gray-200/50 hover:bg-white/90 transition-all duration-300 group/btn"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back</span>
            </motion.button>
          </div>

          {/* Blog content */}
          <div className="p-12 lg:p-16 space-y-10">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {blog.title}
            </motion.h1>

            <motion.div
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center gap-6 flex-wrap text-gray-600">
                {[
                  { icon: Calendar, text: formatDate(blog.date) },
                  { icon: Clock, text: estimateReadTime(blog.details) },
                  { icon: Eye, text: `${formatViews(blog.views)} views` },
                  { icon: Heart, text: `${blog.likes || 0} likes` },
                ].map(({ icon: Icon, text }, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/50 rounded-full backdrop-blur-sm border border-gray-200/50"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(156, 163, 175, 0.1)",
                    }}
                  >
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="whitespace-pre-line text-lg leading-8 font-light">
                {blog.details}
              </div>
            </motion.div>

            <motion.div
              className="pt-8 border-t border-gray-200 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Get Quote
              </button>
            </motion.div>
          </div>
        </motion.article>
      </div>

      {/* Quote Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-gray-200/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6">Apply for Policy</h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmitPolicy}>
                <input
                  type="number"
                  placeholder="Age"
                  name="age"
                  value={quoteData.age}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />
                <select
                  name="gender"
                  value={quoteData.gender}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input
                  type="number"
                  placeholder="Coverage Amount"
                  name="coverage"
                  value={quoteData.coverage}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />
                <input
                  type="number"
                  placeholder="Duration (Years)"
                  name="duration"
                  value={quoteData.duration}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />
                <select
                  name="smoker"
                  value={quoteData.smoker}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                >
                  <option value="No">Non-Smoker</option>
                  <option value="Yes">Smoker</option>
                </select>

                <div className="flex justify-between items-center gap-2">
                  <button
                    onClick={handleEstimate}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Estimate Premium
                  </button>
                  {estimatedPremium && (
                    <span className="text-gray-800 font-bold text-lg">
                      ${estimatedPremium}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all"
                >
                  Submit Policy
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;
