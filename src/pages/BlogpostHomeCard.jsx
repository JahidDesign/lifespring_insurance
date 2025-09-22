// src/components/BlogpostHomeCard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import VisitorCountHome from "./VisitorCountHome";

const BlogpostHomeCard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://insurances-lmy8.onrender.com/blogpostHome");
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        // ✅ সবসময় array বানানো হচ্ছে
        const blogsArray = Array.isArray(data) ? data : data.blogs || [];
        setBlogs(blogsArray);

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
  const currentBlogs = blogs.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recent";

  const estimateReadTime = (content) => {
    if (!content) return "5 min read";
    const words = content.split(" ").length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const handleReadArticle = async (blogIds) => {
    try {
      await fetch(
        `https://insurances-lmy8.onrender.com/blogpostHome/${blogIds}/increment-view`,
        { method: "POST" }
      );
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogIds ? { ...b, views: (b.views || 0) + 1 } : b
        )
      );
    } catch (err) {
      console.error(err);
    }
    navigate(`/articles/${blogIds}`);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black text-lg font-medium">Loading blogs...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );

  return (
    <section className="bg-white text-black min-h-screen py-16 px-6">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Latest Articles
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover insights, stories, and expertise from our community of
            writers
          </p>
        </div>

        {/* Featured Blog */}
        {currentBlogs[0] && (
          <div className="mb-20 group cursor-pointer">
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-black hover:shadow-2xl transition-all duration-500">
              <div className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative overflow-hidden">
                  <img
                    src={currentBlogs[0].image}
                    alt={currentBlogs[0].title}
                    className="object-cover w-full h-80 lg:h-[500px] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                      Featured
                    </span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-black group-hover:text-gray-700 transition-colors duration-300">
                    {currentBlogs[0].title}
                  </h2>

                  {/* Tags */}
                  {currentBlogs[0].tags && currentBlogs[0].tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentBlogs[0].tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(currentBlogs[0].date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{estimateReadTime(currentBlogs[0].details)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <VisitorCountHome
                        blogIds={currentBlogs[0]._id}
                        initialCount={currentBlogs[0].views}
                      />
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3">
                    {currentBlogs[0].details}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={currentBlogs[0].authorImage}
                        alt={currentBlogs[0].author}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-black">
                          {currentBlogs[0].author}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {currentBlogs[0].category || "Writer"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReadArticle(currentBlogs[0]._id)}
                      className="flex items-center gap-2 px-8 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-300 hover:gap-4"
                    >
                      Read Article <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentBlogs.slice(1).map((blog) => (
            <article
              key={blog._id}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-xl transition-all duration-500"
            >
              <div className="relative overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="object-cover w-full h-56 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6 pb-20">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {blog.details}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(blog.date)}
                  </span>
                  <div className="flex items-center gap-4">
                    <VisitorCountHome
                      blogIds={blog._id}
                      initialCount={blog.views}
                    />
                    <span>{estimateReadTime(blog.details)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleReadArticle(blog._id)}
                className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-full transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800"
              >
                Read Article <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-3 rounded-full border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`w-12 h-12 rounded-full font-medium transition-all duration-300 ${
                    currentPage === i + 1
                      ? "bg-black text-white shadow-lg"
                      : "border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-3 rounded-full border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogpostHomeCard;
