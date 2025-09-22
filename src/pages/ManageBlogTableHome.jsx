// src/components/ManageBlogTable.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageBlogTableHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    image: "",
    author: "",
    authorImage: "",
    tags: "",
  });

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://insurances-lmy8.onrender.com/blogpostHome");
      setBlogs(res.data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      Swal.fire("Error", "Failed to load blogs", "error");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog
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
        await axios.delete(`https://insurances-lmy8.onrender.com/blogpostHome/${id}`);
        setBlogs(blogs.filter((b) => b._id !== id));
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  // Start editing
  const startEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      details: blog.details,
      image: blog.image,
      author: blog.author,
      authorImage: blog.authorImage || "",
      tags: blog.tags ? blog.tags.join(", ") : "",
    });
  };

  const cancelForm = () => {
    setEditingBlog(null);
    setShowCreateModal(false);
    setFormData({
      title: "",
      details: "",
      image: "",
      author: "",
      authorImage: "",
      tags: "",
    });
  };

  // Input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Update blog
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      const updatedBlog = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      };
      await axios.put(
        `https://insurances-lmy8.onrender.com/blogpostHome/${editingBlog._id}`,
        updatedBlog
      );
      setBlogs(
        blogs.map((b) =>
          b._id === editingBlog._id ? { ...b, ...updatedBlog } : b
        )
      );
      Swal.fire("Success", "Blog updated successfully", "success");
      cancelForm();
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire("Error", "Failed to update blog", "error");
    }
  };

  // Create blog
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newBlog = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        date: new Date().toISOString(),
      };
      const res = await axios.post(
        "https://insurances-lmy8.onrender.com/blogpostHome",
        newBlog
      );
      setBlogs([res.data, ...blogs]);
      Swal.fire("Success", "Blog created successfully", "success");
      cancelForm();
    } catch (error) {
      console.error("Create failed", error);
      Swal.fire("Error", "Failed to create blog", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-black">Manage Blogs</h2>

      {/* Add New Blog */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
        >
          + Add New Blog
        </button>
      </div>

      {/* Create/Edit Modal */}
      {(editingBlog || showCreateModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative text-black">
            <h3 className="text-2xl font-semibold mb-4">
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </h3>
            <form
              onSubmit={editingBlog ? handleUpdate : handleCreate}
              className="space-y-4"
            >
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

              {/* Blog Image URL & Preview */}
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="Cover Image URL"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Blog Preview"
                  className="w-full h-40 object-cover rounded-md mt-2"
                />
              )}

              {/* Author & Author Image */}
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
              {formData.authorImage && (
                <img
                  src={formData.authorImage}
                  alt="Author Preview"
                  className="w-16 h-16 rounded-full mt-2"
                />
              )}

              {/* Tags */}
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma separated tags (e.g., health, insurance, travel)"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white ${
                    editingBlog
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  } transition`}
                >
                  {editingBlog ? "Update Blog" : "Create Blog"}
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
            <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tags</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Author</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-6 italic text-gray-600">
                No blogs found.
              </td>
            </tr>
          )}
          {blogs.map((blog) => (
            <tr key={blog._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-20 h-16 object-cover rounded"
                />
              </td>
              <td
                className="border border-gray-300 px-4 py-2 max-w-xs truncate"
                title={blog.title}
              >
                {blog.title}
              </td>
              <td
                className="border border-gray-300 px-4 py-2 max-w-xs truncate"
                title={blog.details}
              >
                {blog.details}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {blog.tags && blog.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No tags</span>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                {blog.authorImage && (
                  <img
                    src={blog.authorImage}
                    alt={blog.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                {blog.author}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {blog.date ? new Date(blog.date).toLocaleDateString() : "N/A"}
              </td>
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

export default ManageBlogTableHome;
