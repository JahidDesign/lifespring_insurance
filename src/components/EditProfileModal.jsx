// src/pages/ProfileModern.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaLinkedin, FaFacebook, FaTwitter, FaGlobe } from "react-icons/fa";

const ProfileModern = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email || "";

  const [profile, setProfile] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    title: "",
    bio: "",
    location: "",
    phone: "",
    email: email,
    avatar: "",
    coverImage: "",
    socialLinks: { linkedin: "", facebook: "", twitter: "", website: "" },
    skills: [],
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  // Auto-fill name and email instantly + fetch profile
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || "",
      }));
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://insurances-lmy8.onrender.com/profiledesign?email=${email}`
        );
        if (res.data && res.data.length > 0) {
          const p = res.data[0];
          setProfile(p);
          setForm({
            fullName: p.fullName || user.displayName || "",
            title: p.title || "",
            bio: p.bio || "",
            location: p.location || "",
            phone: p.phone || "",
            email: user.email || "",
            avatar: p.avatar || "",
            coverImage: p.coverImage || "",
            socialLinks: p.socialLinks || { linkedin: "", facebook: "", twitter: "", website: "" },
            skills: p.skills || [],
          });
          setAvatarPreview(p.avatar);
          setCoverPreview(p.coverImage);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (email) fetchProfile();
  }, [user, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, coverImage: file }));
    }
  };

  const handleSkillAdd = () => {
    if (skillInput && !form.skills.includes(skillInput)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, skillInput] }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...form };
      updateData.skills = form.skills;

      if (profile?._id) {
        // update existing profile
        await axios.put(
          `https://insurances-lmy8.onrender.com/profiledesign/${profile._id}`,
          updateData
        );
      } else {
        // create new profile
        await axios.post(`https://insurances-lmy8.onrender.com/profiledesign`, updateData);
      }

      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  if (!profile) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-8">
      <form onSubmit={handleSubmit}>
        {/* Cover + Avatar */}
        <div className="relative mb-6">
          <div className="h-40 w-full bg-gray-200 rounded-t-lg overflow-hidden">
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="absolute top-2 right-2 opacity-70 cursor-pointer"
            />
          </div>
          <div className="absolute -bottom-12 left-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="pt-16 space-y-4">
            <div>
              <label className="font-semibold">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded mt-2"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="font-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="font-semibold">Skills</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {form.skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="border p-2 rounded flex-1"
                  placeholder="Add skill"
                />
                <button
                  type="button"
                  onClick={handleSkillAdd}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <label className="font-semibold">Social Links</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <FaLinkedin />
                  <input
                    type="text"
                    name="socialLinks.linkedin"
                    value={form.socialLinks.linkedin || ""}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaFacebook />
                  <input
                    type="text"
                    name="socialLinks.facebook"
                    value={form.socialLinks.facebook || ""}
                    onChange={handleChange}
                    placeholder="Facebook URL"
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaTwitter />
                  <input
                    type="text"
                    name="socialLinks.twitter"
                    value={form.socialLinks.twitter || ""}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaGlobe />
                  <input
                    type="text"
                    name="socialLinks.website"
                    value={form.socialLinks.website || ""}
                    onChange={handleChange}
                    placeholder="Website URL"
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileModern;
