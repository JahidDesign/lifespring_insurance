// src/pages/BlogHomeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import VisitorCountHome from "./VisitorCountHome";
import toast, { Toaster } from "react-hot-toast";

const BlogHomeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recent";

  const estimateReadTime = (content) =>
    content ? `${Math.ceil(content.split(" ").length / 200)} min read` : "5 min read";

  // Fetch blog + related + increment views
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://insurances-lmy8.onrender.com/blogpostHome/${id}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data);
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Increment views
        fetch(`https://insurances-lmy8.onrender.com/blogpostHome/${data._id}/increment-view`, {
          method: "POST",
        }).catch(console.error);

        // Related blogs
        if (data.tags?.length > 0) {
          const tagsQuery = data.tags.join(",");
          const relatedRes = await fetch(
            `https://insurances-lmy8.onrender.com/blogpostHome/search?tags=${tagsQuery}`
          );
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            const filtered = relatedData.filter((b) => b._id !== data._id);
            setRelatedBlogs(filtered.slice(0, 3));
          }
        }
      } catch (err) {
        console.error(err);
        setError("Blog not found");
        toast.error("Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const renderContent = (text) =>
    text?.split("\n").map((line, i) => {
      line = line.trim();
      if (!line) return null;
      if (line.startsWith("## ")) return <h3 key={i}>{line.replace("## ", "")}</h3>;
      if (line.startsWith("# ")) return <h2 key={i}>{line.replace("# ", "")}</h2>;
      if (line.startsWith("> ")) return <blockquote key={i}>{line.replace("> ", "")}</blockquote>;
      if (line.startsWith("![")) {
        const match = line.match(/!\[(.*?)\]\((.*?)(?: "(.*?)")?\)/);
        if (match)
          return (
            <motion.figure
              key={i}
              className="my-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={match[2]}
                alt={match[1]}
                loading="lazy"
                className="rounded-2xl w-full object-cover"
              />
              {match[3] && (
                <figcaption className="text-gray-500 text-sm mt-2 text-center">{match[3]}</figcaption>
              )}
            </motion.figure>
          );
      }
      return (
        <p key={i} className="mb-4">
          {line}
        </p>
      );
    });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black text-lg font-medium">Loading article...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600 text-lg font-medium text-center">{error}</p>
      </div>
    );

  if (!blog) return null;

  return (
    <article className="bg-white text-black min-h-screen py-16 px-6">
      <Toaster />
      <div className="container max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-8 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Blogs
        </button>

        <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-6 text-gray-500 mb-8 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {formatDate(blog.date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {estimateReadTime(blog.details)}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <VisitorCountHome blogId={blog._id} initialCount={blog.views || 0} />
          </div>
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Featured Image */}
        {blog.image && (
          <motion.img
            src={blog.image}
            alt={blog.title}
            loading="lazy"
            className="w-full h-[500px] object-cover rounded-3xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-full text-gray-700 mb-12">{renderContent(blog.details)}</div>

        {/* Author Info */}
        <div className="flex items-center gap-4 border-t border-gray-200 pt-6 mb-12">
          <img
            src={blog.authorImage || "/avatar.png"}
            alt={blog.author}
            loading="lazy"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="font-semibold text-black">{blog.author}</p>
            <p className="text-gray-500 text-sm">{blog.category}</p>
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <motion.div
                  key={b._id}
                  className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${b._id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {b.image && (
                    <motion.img
                      src={b.image}
                      alt={b.title}
                      loading="lazy"
                      className="w-full h-40 object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                    <p className="text-gray-500 text-sm">{formatDate(b.date)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default BlogHomeDetail;
