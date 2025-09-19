// src/components/ProfileModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

const ProfileModal = ({ userId, initialData, onClose, onSaved }) => {
  const [form, setForm] = useState({
    fullName: initialData.fullName || "",
    title: initialData.title || "",
    bio: initialData.bio || "",
    location: initialData.location || "",
    phone: initialData.phone || "",
    avatar: initialData.avatar || "",
    coverImage: initialData.coverImage || "",
    socialLinks: initialData.socialLinks || {
      linkedin: "", twitter: "", facebook: "", website: ""
    },
    skills: initialData.skills || [],
    experience: initialData.experience || [],
  });
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("social_")) {
      const key = name.split("_")[1];
      setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/profiledesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...form }),
      });
      const saved = await res.json();
      onSaved(saved);
      toast.success("Profile saved!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" />
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" />
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" className="w-full border p-2 rounded" />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />

          {/* Avatar + Cover */}
          <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="Avatar URL" className="w-full border p-2 rounded" />
          <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="Cover URL" className="w-full border p-2 rounded" />

          {/* Social Links */}
          <h3 className="font-semibold mt-4">Social Links</h3>
          <input name="social_linkedin" value={form.socialLinks.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full border p-2 rounded" />
          <input name="social_twitter" value={form.socialLinks.twitter} onChange={handleChange} placeholder="Twitter URL" className="w-full border p-2 rounded" />
          <input name="social_facebook" value={form.socialLinks.facebook} onChange={handleChange} placeholder="Facebook URL" className="w-full border p-2 rounded" />
          <input name="social_website" value={form.socialLinks.website} onChange={handleChange} placeholder="Website URL" className="w-full border p-2 rounded" />

          {/* Skills */}
          <h3 className="font-semibold mt-4">Skills</h3>
          <div className="flex gap-2">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add Skill" className="flex-1 border p-2 rounded" />
            <button type="button" onClick={addSkill} className="bg-blue-500 text-white px-3 rounded">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {form.skills.map((s, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded">{s}</span>
            ))}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Save</button>
        </form>

        <button onClick={onClose} className="mt-4 w-full py-2 border rounded">Cancel</button>
      </div>
    </div>
  );
};

export default ProfileModal;
