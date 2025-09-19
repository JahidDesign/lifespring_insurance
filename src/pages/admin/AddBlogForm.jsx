import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  PencilSquareIcon,
  UserIcon,
  PhotoIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const MySwal = withReactContent(Swal);

const AddBlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    image: "",
    author: "",
    authorImage: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showSuccessAlert = () => {
    MySwal.fire({
      html: `
        <div class="flex flex-col md:flex-row bg-white text-black rounded-lg overflow-hidden shadow-xl">
          <div class="md:w-1/2 hidden md:block">
            <img src="${formData.image}" alt="Cover" class="w-full h-full object-cover" />
          </div>
          <div class="p-6 md:w-1/2 text-left">
            <h2 class="text-2xl font-bold mb-3 text-green-600 flex items-center gap-2">
              ✅ Blog Submitted!
            </h2>
            <p class="mb-2"><strong>📌 Title:</strong> ${formData.title}</p>
            <p class="mb-2"><strong>✍️ Author:</strong> ${formData.author}</p>
            <p class="text-sm text-gray-600">Your blog has been posted successfully 🎉</p>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: "#2563eb",
      width: "650px",
      background: "transparent",
      customClass: {
        popup: "p-0 overflow-hidden rounded-xl",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date().toISOString();
    const newBlog = {
      ...formData,
      date: timestamp.split("T")[0],
      createdAt: timestamp,
      updatedAt: timestamp,
      totalVisit: 0,
    };

    try {
      await axios.post("https://insurances-lmy8.onrender.com/blogpost", newBlog);
      showSuccessAlert();
      setFormData({
        title: "",
        details: "",
        image: "",
        author: "",
        authorImage: "",
      });
    } catch (error) {
      console.error("Error posting blog:", error);
      Swal.fire("Error", "Failed to submit blog", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-slate-800 flex items-center justify-center gap-2">
        <PencilSquareIcon className="w-8 h-8 text-blue-600" />
        Publish a New Blog Post
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
      >
        {/* Blog Title */}
        <div className="col-span-1 md:col-span-2">
          <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
            <DocumentTextIcon className="w-5 h-5 text-blue-500" />
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter your blog title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Blog Details */}
        <div className="col-span-1 md:col-span-2">
          <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
            <DocumentTextIcon className="w-5 h-5 text-blue-500" />
            Blog Details
          </label>
          <textarea
            name="details"
            placeholder="Write at least 30 words..."
            value={formData.details}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg h-40 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
            <PhotoIcon className="w-5 h-5 text-blue-500" />
            Cover Image URL
          </label>
          <input
            type="text"
            name="image"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Author Name */}
        <div>
          <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
            <UserIcon className="w-5 h-5 text-blue-500" />
            Author Name
          </label>
          <input
            type="text"
            name="author"
            placeholder="John Doe"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Author Image */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
            <PhotoIcon className="w-5 h-5 text-blue-500" />
            Author Profile Image URL (optional)
          </label>
          <input
            type="text"
            name="authorImage"
            placeholder="https://example.com/author.jpg"
            value={formData.authorImage}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg font-semibold shadow-md flex items-center gap-2 ml-auto"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Submit Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogForm;
