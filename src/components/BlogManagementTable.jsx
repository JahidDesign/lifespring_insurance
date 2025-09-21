// src/components/BlogManagementTable.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BlogManagementTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://insurances-lmy8.onrender.com/blogpost");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      Swal.fire("Error", "Failed to fetch blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete a blog
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://insurances-lmy8.onrender.com/blogpost/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok) {
          Swal.fire("Deleted!", "Blog has been deleted.", "success");
          setBlogs((prev) => prev.filter((b) => b._id !== id));
        } else {
          Swal.fire("Error", data.message || "Delete failed", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Server error. Try again later.", "error");
      }
    }
  };

  // Edit blog inline
  const handleEdit = (id) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, isEditing: true } : b
      )
    );
  };

  // Save updated blog
  const handleUpdate = async (id, updatedBlog) => {
    try {
      const res = await fetch(`https://insurances-lmy8.onrender.com/blogpost/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBlog),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("Updated!", "Blog has been updated.", "success");
        setBlogs((prev) =>
          prev.map((b) => (b._id === id ? { ...updatedBlog, _id: id, isEditing: false } : b))
        );
      } else {
        Swal.fire("Error", data.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error. Try again later.", "error");
    }
  };

  if (loading) return <p className="text-center py-10">Loading blogs...</p>;
  if (!blogs.length) return <p className="text-center py-10">No blogs found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
      <table className="min-w-full border rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Author</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-b">
              <td className="py-2 px-4">
                {blog.isEditing ? (
                  <input
                    type="text"
                    defaultValue={blog.title}
                    onChange={(e) => (blog.title = e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  blog.title
                )}
              </td>
              <td className="py-2 px-4">
                {blog.isEditing ? (
                  <input
                    type="text"
                    defaultValue={blog.author}
                    onChange={(e) => (blog.author = e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  blog.author
                )}
              </td>
              <td className="py-2 px-4">
                {blog.isEditing ? (
                  <input
                    type="text"
                    defaultValue={blog.category}
                    onChange={(e) => (blog.category = e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  blog.category
                )}
              </td>
              <td className="py-2 px-4">
                {blog.isEditing ? (
                  <input
                    type="date"
                    defaultValue={blog.date?.split("T")[0]}
                    onChange={(e) => (blog.date = e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  new Date(blog.date || blog.createdAt).toLocaleDateString()
                )}
              </td>
              <td className="py-2 px-4 space-x-2">
                {blog.isEditing ? (
                  <button
                    onClick={() => handleUpdate(blog._id, blog)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(blog._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogManagementTable;
