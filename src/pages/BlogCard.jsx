// src/components/BlogListBigCard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Eye, BookOpen, Zap, TrendingUp, Star, ArrowRight } from "lucide-react";
import VisitorCount from "./VisitorCount";

const BlogListBigCard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://insurances-lmy8.onrender.com/blogpost");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(blogs.length / postsPerPage);
  const currentBlogs = blogs.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const estimateReadTime = (content) => {
    if (!content) return "5 min read";
    const words = content.split(" ").length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const handleReadArticle = async (blogId) => {
    try {
      await fetch(`https://insurances-lmy8.onrender.com/blogpost/${blogId}/increment-view`, { method: "POST" });
      navigate(`/blog/${blogId}`);
    } catch (err) {
      console.error(err);
      navigate(`/blog/${blogId}`);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <p className="text-center mt-20 text-gray-600 text-lg font-semibold">Loading blogs...</p>;
  if (error) return <p className="text-center mt-20 text-red-600 text-lg font-semibold">{error}</p>;

  return (
    <section className="dark:bg-gray-100 dark:text-gray-800 py-12 px-4">
      <div className="container max-w-6xl mx-auto space-y-12">
        {/* Featured Blog (Big Card) */}
        {currentBlogs[0] && (
          <div
            className="block sm:grid sm:grid-cols-12 gap-6 bg-white dark:bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
            onClick={() => handleReadArticle(currentBlogs[0]._id)}
          >
            <img
              src={currentBlogs[0].image}
              alt={currentBlogs[0].title}
              className="object-cover w-full h-64 sm:h-96 lg:col-span-7"
            />
            <div className="p-6 lg:col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2">{currentBlogs[0].title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(currentBlogs[0].date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{estimateReadTime(currentBlogs[0].details)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <VisitorCount blogId={currentBlogs[0]._id} initialCount={currentBlogs[0].views} />
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-3">{currentBlogs[0].details}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <img
                    src={currentBlogs[0].authorImage}
                    alt={currentBlogs[0].author}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{currentBlogs[0].author}</span>
                    <span className="text-gray-400 text-sm">{currentBlogs[0].category}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleReadArticle(currentBlogs[0]._id)}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid Blogs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBlogs.slice(1).map((blog) => (
            <div
              key={blog._id}
              className="group bg-white dark:bg-gray-50 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleReadArticle(blog._id)}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="object-cover w-full h-44 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold group-hover:underline">{blog.title}</h3>
                <span className="text-xs text-gray-500">{formatDate(blog.date)}</span>
                <p className="text-gray-600 line-clamp-3">{blog.details}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <VisitorCount blogId={blog._id} initialCount={blog.views} />
                  <span>{estimateReadTime(blog.details)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-300 text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-300 text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-300 text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListBigCard;
