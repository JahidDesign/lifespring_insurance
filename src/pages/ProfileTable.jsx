// src/components/ProfileTableAPI.jsx
import React, { useEffect, useState, useContext } from "react";
import EditProfileModal from "../components/EditProfileModal";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ProfileTableAPI = () => {
  const { user } = useContext(AuthContext); // current logged-in user
  const [profiles, setProfiles] = useState([]);
  const [editingProfile, setEditingProfile] = useState(null);

  const isAdmin = user?.email === "jhadam904@gmail.com"; // check admin email

  // Fetch profiles from API
  const fetchProfiles = async () => {
    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/profiledesign");
      if (!res.ok) throw new Error("Failed to fetch profiles");
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading profiles");
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Delete profile
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      const res = await fetch(`https://insurances-lmy8.onrender.com/profiledesign/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      toast.success("Profile deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete profile");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Profiles</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Full Name</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Email</th>
              {isAdmin && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile._id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{profile.fullName}</td>
                <td className="py-2 px-4">{profile.title}</td>
                <td className="py-2 px-4">{profile.email}</td>
                {isAdmin && (
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() => setEditingProfile(profile)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleDelete(profile._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProfile && isAdmin && (
        <EditProfileModal
          userId={user.uid}
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSaved={(updatedProfile) => {
            setProfiles((prev) =>
              prev.map((p) => (p._id === updatedProfile._id ? updatedProfile : p))
            );
          }}
        />
      )}
    </div>
  );
};

export default ProfileTableAPI;
