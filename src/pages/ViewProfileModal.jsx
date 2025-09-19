// src/components/ViewProfileModal.jsx
import React from "react";
import { FaLinkedin, FaFacebook, FaTwitter, FaGlobe, FaTimes } from "react-icons/fa";

const ViewProfileModal = ({ profile, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-3xl rounded-lg overflow-hidden shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Cover Image */}
        <div className="w-full h-40 overflow-hidden">
          <img
            src={profile.coverImage || "https://via.placeholder.com/1200x300"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center -mt-12 mb-4 px-6">
          <img
            src={profile.avatar || "https://via.placeholder.com/100"}
            alt={profile.fullName}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          <h2 className="text-xl font-semibold mt-2">{profile.fullName}</h2>
          <p className="text-gray-500">{profile.title}</p>
          <p className="text-gray-400 text-sm">{profile.location}</p>
        </div>

        {/* Bio */}
        <div className="px-6 mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">Bio</h3>
          <p className="text-gray-600">{profile.bio || "No bio provided."}</p>
        </div>

        {/* Contact Info */}
        <div className="px-6 mb-4 grid grid-cols-2 gap-2">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Phone</h3>
            <p className="text-gray-600">{profile.phone || "-"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Email</h3>
            <p className="text-gray-600">{profile.email || "-"}</p>
          </div>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="px-6 mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
          <div className="px-6 mb-6 flex gap-4 justify-center">
            {profile.socialLinks.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin size={24} className="text-blue-700 hover:text-blue-900" />
              </a>
            )}
            {profile.socialLinks.facebook && (
              <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer">
                <FaFacebook size={24} className="text-blue-600 hover:text-blue-800" />
              </a>
            )}
            {profile.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">
                <FaTwitter size={24} className="text-blue-400 hover:text-blue-600" />
              </a>
            )}
            {profile.socialLinks.website && (
              <a
                href={`https://${profile.socialLinks.website}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaGlobe size={24} className="text-gray-600 hover:text-gray-800" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfileModal;
