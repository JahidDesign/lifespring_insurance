// src/components/ProfileCard.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaGlobe,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import ProfileModern from "./EditProfileModal";
import { AuthContext } from "../context/AuthContext";

const ProfileCard = () => {
  const { logout, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch profile data from JSON API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://insurances-lmy8.onrender.com/profiledesign?userId=${user?.uid}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setProfile(data[0]); // assuming API returns array
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-10">No profile found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
      {/* Cover */}
      <div className="h-40 bg-gray-200 relative">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Avatar + Info */}
      <div className="p-6 relative">
        <div className="absolute -top-12 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white">
          <img
            src={profile.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="ml-32">
          <h2 className="text-2xl font-bold">{profile.fullName}</h2>
          <p className="text-gray-600">{profile.title}</p>
          <p className="mt-2">{profile.bio}</p>

          <div className="flex gap-3 mt-3 text-gray-700">
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin size={20} />
              </a>
            )}
            {profile.socialLinks?.facebook && (
              <a
                href={profile.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook size={20} />
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter size={20} />
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noreferrer"
              >
                <FaGlobe size={20} />
              </a>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded"
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-gray-300 px-4 py-2 rounded"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Skills */}
          <div className="flex gap-2 flex-wrap mt-4">
            {profile.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProfileModern profile={profile} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ProfileCard;
