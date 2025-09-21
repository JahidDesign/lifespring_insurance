// src/pages/BlogDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

// Skeleton loader
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

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: form, 2: review, 3: success
  const [quoteData, setQuoteData] = useState({
    age: "",
    gender: "",
    coverage: "",
    duration: "",
    smoker: "No",
  });
  const [estimatedPremium, setEstimatedPremium] = useState(null);

  // Fetch blog post
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://insurances-lmy8.onrender.com/blogpost");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        const foundBlog = data.find((b) => b._id === blogId);
        if (!foundBlog) {
          toast.error("Blog not found");
          setBlog(null);
          return;
        }
        setBlog(foundBlog);

        // Increment views
        await fetch(`https://insurances-lmy8.onrender.com/blogpost/${blogId}/views`, { method: "PATCH" });
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
      ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "Recent";

  const formatViews = (views) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views || 0;
  };

  const estimateReadTime = (content) =>
    content ? `${Math.ceil(content.split(" ").length / 200)} min read` : "5 min read";

  // Form handlers
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
    let premium = (parseInt(coverage) / 1000) * (parseInt(duration) / 10) * (parseInt(age) / 30);
    if (smoker === "Yes") premium *= 1.5;
    setEstimatedPremium(premium.toFixed(2));
  };

  const handleSubmitPolicy = async () => {
    if (!estimatedPremium) return toast.error("Please calculate premium first");
    if (!user || !user.email) return toast.error("You must be logged in to submit a policy");

    const payload = {
      blogId: blog._id,
      blogTitle: blog.title,
      serviceName: blog.title,
      providerName: blog.author || "Unknown",
      userEmail: user.email,
      userName: user.displayName || "Anonymous",
      age: parseInt(quoteData.age),
      gender: quoteData.gender,
      coverageAmount: parseFloat(quoteData.coverage),
      duration: parseInt(quoteData.duration),
      smoker: quoteData.smoker,
      premium: parseFloat(estimatedPremium),
      contactEmail: user.email || "",
      contactNumber: user.phone || "",
      imageUrl: blog.image || "",
      description: blog.details || "",
      category: blog.category || "",
      tags: blog.tags || [],
      date: blog.date || "",
      views: blog.views || 0,
    };

    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/insuranceservicesBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit policy");

      toast.success("Policy applied successfully!");
      setModalStep(3);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(`Failed to submit policy: ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Skeleton height="28rem" className="rounded-3xl" />
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">Blog not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto py-20 px-4">
        <div className="relative w-full h-[28rem]">
          {!imageLoaded && <Skeleton height="28rem" />}
          <img
            src={blog.image}
            alt={blog.title}
            className={`w-full h-full object-cover ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          <button className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow" onClick={() => navigate(-1)}>
            <ArrowLeft className="inline w-4 h-4 mr-2" /> Back
          </button>
        </div>

        <h1 className="text-4xl font-bold mt-8">{blog.title}</h1>
        <p className="text-gray-600 mt-2">
          {formatDate(blog.date)} • {estimateReadTime(blog.details)} • {formatViews(blog.views)} views
        </p>
        <p className="mt-6 text-lg">{blog.details}</p>

        <div className="mt-12 text-center">
          <button onClick={() => setShowModal(true)} className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Apply for Policy
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-500"
                onClick={() => { setShowModal(false); setModalStep(1); }}
              >
                ✕
              </button>

              {/* Step 1: Form */}
              {modalStep === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Policy Form</h2>
                  <form className="flex flex-col gap-4">
                    <input type="number" name="age" placeholder="Age" value={quoteData.age} onChange={handleChange} className="p-3 border rounded" required />
                    <select name="gender" value={quoteData.gender} onChange={handleChange} className="p-3 border rounded" required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <input type="number" name="coverage" placeholder="Coverage Amount" value={quoteData.coverage} onChange={handleChange} className="p-3 border rounded" required />
                    <input type="number" name="duration" placeholder="Duration (Years)" value={quoteData.duration} onChange={handleChange} className="p-3 border rounded" required />
                    <select name="smoker" value={quoteData.smoker} onChange={handleChange} className="p-3 border rounded">
                      <option value="No">Non-Smoker</option>
                      <option value="Yes">Smoker</option>
                    </select>

                    <div className="flex justify-between items-center gap-2">
                      <button onClick={handleEstimate} className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all">
                        Estimate Premium
                      </button>
                      {estimatedPremium && <span className="text-gray-800 font-bold text-lg">${estimatedPremium}</span>}
                    </div>

                    <button type="button" onClick={() => { if (!estimatedPremium) return toast.error("Please calculate premium first"); setModalStep(2); }} className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all">
                      Review & Submit
                    </button>
                  </form>
                </>
              )}

              {/* Step 2: Review */}
              {modalStep === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Review Policy</h2>

                  {/* Mini blog card */}
                  <div className="flex gap-4 mb-4 border p-4 rounded-lg shadow">
                    <img src={blog.image} alt={blog.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex flex-col justify-between flex-1">
                      <p className="font-semibold">{blog.title}</p>
                      <p className="text-sm text-gray-500">{blog.category || "Uncategorized"}</p>
                      <p className="text-gray-700 text-sm">{blog.details?.substring(0, 100)}{blog.details?.length > 100 ? "..." : ""}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {blog.tags?.map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Policy & user data */}
                  <div className="flex flex-col gap-2 text-gray-700 mb-4">
                    <p><strong>Age:</strong> {quoteData.age}</p>
                    <p><strong>Gender:</strong> {quoteData.gender}</p>
                    <p><strong>Coverage:</strong> ${quoteData.coverage}</p>
                    <p><strong>Duration:</strong> {quoteData.duration} years</p>
                    <p><strong>Smoker:</strong> {quoteData.smoker}</p>
                    <p><strong>Estimated Premium:</strong> ${estimatedPremium}</p>
                    <p><strong>User:</strong> {user.displayName || "Anonymous"} ({user.email})</p>
                  </div>

                  <div className="mt-6 flex justify-between gap-2">
                    <button onClick={() => setModalStep(1)} className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition-all">Back</button>
                    <button onClick={handleSubmitPolicy} className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all">Confirm & Submit</button>
                  </div>
                </>
              )}

              {/* Step 3: Success */}
              {modalStep === 3 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-green-600">Success!</h2>
                  <p className="text-gray-700 mb-4">Your policy has been successfully applied.</p>
                  <div className="flex flex-col gap-2 text-gray-700">
                    <p><strong>Blog:</strong> {blog.title}</p>
                    <p><strong>Premium:</strong> ${estimatedPremium}</p>
                    <p><strong>User:</strong> {user.displayName || "Anonymous"} ({user.email})</p>
                  </div>
                  <button onClick={() => { setShowModal(false); setModalStep(1); navigate("/quote-insurance"); }} className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all">
                    Close
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;
