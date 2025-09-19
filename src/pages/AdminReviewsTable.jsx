// File: AdminReviewsTable.jsx
import React, { useState, useEffect } from "react";
import { FaStar, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const API_URL = "https://insurances-lmy8.onrender.com/users";

const AdminReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    service: "",
    comment: "",
    rating: 0,
    image: "",
    social: { facebook: "", linkedin: "", twitter: "" },
  });

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["facebook", "linkedin", "twitter"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        social: { ...prev.social, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (rate) =>
    setForm((prev) => ({ ...prev, rating: rate }));

  // Edit
  const handleEdit = (review) => {
    setEditingReview(review);
    setForm({ ...review, social: review.social || {} });
  };

  const handleUpdate = () => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === editingReview._id ? { ...editingReview, ...form } : r
      )
    );
    setEditingReview(null);
  };

  // Delete
  const handleDelete = (review) => {
    if (window.confirm("Delete this review?")) {
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    }
  };

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Reviews</h2>

      {/* Edit Form */}
      {editingReview && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border">
          <h3 className="text-xl font-bold mb-4">Edit Review</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              placeholder="Name"
            />
            <input
              type="text"
              name="service"
              value={form.service}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
              placeholder="Service"
            />
          </div>

          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full mb-4"
            placeholder="Photo URL"
          />

          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full mb-4"
            placeholder="Comment"
          ></textarea>

          <div className="flex items-center gap-2 mb-4">
            <span>Rating:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`cursor-pointer ${
                  i < form.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRatingChange(i + 1)}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white py-2 px-6 rounded-xl hover:bg-blue-600 transition"
            >
              Update
            </button>
            <button
              onClick={() => setEditingReview(null)}
              className="bg-gray-300 text-gray-800 py-2 px-6 rounded-xl hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Photo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Service</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Comment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="hover:bg-gray-50 transition-all duration-150"
              >
                <td className="px-6 py-4">
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{review.name || "Anonymous"}</td>
                <td className="px-6 py-4">{review.service || "-"}</td>
                <td className="px-6 py-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < (review.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </td>
                <td className="px-6 py-4">{review.comment || "-"}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(review)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="text-green-500 hover:text-green-700 transition"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full relative shadow-lg">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            {selectedReview.image && (
              <img
                src={selectedReview.image}
                alt={selectedReview.name}
                className="w-24 h-24 rounded-full mb-2 object-cover mx-auto border"
              />
            )}
            <h3 className="text-xl font-bold mb-2 text-center">
              {selectedReview.name}
            </h3>
            <p className="text-gray-500 mb-2 text-center">
              {selectedReview.service}
            </p>
            <div className="flex justify-center items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < (selectedReview.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-gray-600 mb-2 text-center">
              "{selectedReview.comment}"
            </p>
            <div className="flex justify-center gap-4 mt-2 text-blue-500">
              {selectedReview.social?.facebook && (
                <a
                  href={selectedReview.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              )}
              {selectedReview.social?.linkedin && (
                <a
                  href={selectedReview.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {selectedReview.social?.twitter && (
                <a
                  href={selectedReview.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminReviewsTable;
