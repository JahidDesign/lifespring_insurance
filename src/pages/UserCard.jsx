import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaUserTag,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import Swal from "sweetalert2";
import ProfileForm from "./profileUpdate";

const UserCard = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://insurances-lmy8.onrender.com/profiledesign/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        Swal.fire("Updated!", "Profile updated successfully", "success");
        setIsEditing(false);
      } else throw new Error("Update failed");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this profile!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://insurances-lmy8.onrender.com/profiledesign/${user._id}`, {
          method: "DELETE",
        });
        if (res.ok) Swal.fire("Deleted!", "Profile has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const shouldShowAdd = !form.bio && (
    !form.socialLinks?.facebook &&
    !form.socialLinks?.twitter &&
    !form.socialLinks?.linkedin
  );

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-white to-slate-100 text-black rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl mx-auto relative border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Cover */}
        <div className="relative h-48 sm:h-60 bg-gray-300">
          <img
            src={form.coverImage || "https://i.ibb.co/8Pw8Tgy/cover.jpg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-16 left-6">
            <img
              src={form.photo || "https://i.ibb.co/20xDKTwt/jh.png"}
              alt={form.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-20 px-6 pb-6 text-center sm:text-left">
          <div className="flex justify-between items-center">
            {isEditing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="text-2xl font-bold w-full border-b"
              />
            ) : (
              <h2 className="text-3xl font-extrabold text-gray-800">{form.name}</h2>
            )}

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-green-600"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setForm(user);
                    }}
                    className="bg-gray-400 text-white px-3 py-2 rounded-full shadow-md hover:bg-gray-500"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-full shadow hover:bg-blue-700"
                  >
                    <FaEdit />
                  </button>

                  {/* ✅ Only show ADD if bio & social links not present */}
                  {shouldShowAdd && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-full shadow hover:bg-indigo-700"
                    >
                      ADD
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-3 py-2 rounded-full shadow hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <FaEnvelope /> {form.email}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
            <p>
              <FaUserTag className="inline mr-1 text-gray-400" />
              Role: {isEditing ? <input name="role" value={form.role} onChange={handleChange} className="border-b w-full" /> : form.role}
            </p>
            <p>
              <FaPhoneAlt className="inline mr-1 text-gray-400" />
              Phone: {isEditing ? <input name="phone" value={form.phone} onChange={handleChange} className="border-b w-full" /> : form.phone}
            </p>
            <p>
              Status: {isEditing ? <input name="status" value={form.status} onChange={handleChange} className="border-b w-full" /> : form.status}
            </p>
            <p>
              Joined: {new Date(form.createdAt || form.date).toLocaleDateString()}
            </p>
          </div>

          {form.bio && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800">About</h4>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full border mt-1 p-2 rounded"
                />
              ) : (
                <p className="text-sm text-gray-700 mt-1">{form.bio}</p>
              )}
            </div>
          )}

          {form.socialLinks && (
            <div className="mt-4 flex gap-4 text-xl text-gray-600">
              {form.socialLinks.facebook && (
                <a href={form.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="hover:text-blue-600 transition" />
                </a>
              )}
              {form.socialLinks.twitter && (
                <a href={form.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="hover:text-sky-500 transition" />
                </a>
              )}
              {form.socialLinks.linkedin && (
                <a href={form.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="hover:text-blue-700 transition" />
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-2xl relative shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile in Modal</h2>
              <ProfileForm user={user} onClose={() => setShowModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserCard;