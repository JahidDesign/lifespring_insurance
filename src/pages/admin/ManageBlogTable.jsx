import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageBlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    image: "",
    author: "",
    authorImage: "",
  });

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/blogpost");
      setBlogs(res.data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      Swal.fire("Error", "Failed to load blogs", "error");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog by ID
  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the blog permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`https://insurances-lmy8.onrender.com/blogpost/${id}`);
        setBlogs(blogs.filter((b) => b._id !== id));
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  // Start editing blog
  const startEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      details: blog.details,
      image: blog.image,
      author: blog.author,
      authorImage: blog.authorImage || "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      details: "",
      image: "",
      author: "",
      authorImage: "",
    });
  };

  // Update blog on server
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBlog) return;

    try {
      const updatedBlog = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      await axios.put(
        `https://insurances-lmy8.onrender.com/blogpost/${editingBlog._id}`,
        updatedBlog
      );

      setBlogs(
        blogs.map((b) =>
          b._id === editingBlog._id ? { ...b, ...updatedBlog } : b
        )
      );
      Swal.fire("Success", "Blog updated successfully", "success");
      cancelEdit();
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire("Error", "Failed to update blog", "error");
    }
  };

  // Handle input change for edit form
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">Manage Blogs</h2>

      {/* Edit Form Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative text-black">
            <h3 className="text-2xl font-semibold mb-4">Edit Blog</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Blog Title"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Blog Details"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black"
              />
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="Cover Image URL"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Author Name"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <input
                type="text"
                name="authorImage"
                value={formData.authorImage}
                onChange={handleChange}
                placeholder="Author Image URL (optional)"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Update Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blogs Table */}
      <table className="w-full border-collapse border border-gray-300 shadow-md rounded-md text-black">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Author</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-6 italic text-gray-600">
                No blogs found.
              </td>
            </tr>
          )}
          {blogs.map((blog) => (
            <tr key={blog._id} className="hover:bg-gray-50">
              <td
                className="border border-gray-300 px-4 py-2 max-w-xs truncate"
                title={blog.title}
              >
                {blog.title}
              </td>
              <td className="border border-gray-300 px-4 py-2">{blog.author}</td>
              <td className="border border-gray-300 px-4 py-2">{blog.date}</td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2">
                <button
                  onClick={() => startEdit(blog)}
                  className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBlogTable;
