// src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/ProfileCard";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://insurances-lmy8.onrender.com/profiledesign?userId=${user.uid}`
        );
        if (res.data && res.data.length > 0) setProfile(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          {profile ? `${profile.fullName} | My Portfolio` : "Profile | My Portfolio"}
        </title>
        <meta name="description" content={profile?.bio || "User profile page"} />
        <meta name="author" content={profile?.fullName || "Portfolio User"} />
        {/* Favicon */}
        <link rel="icon" href="/insurance.png" type="image/x-icon" />
      </Helmet>

      <ProfileCard profile={profile} />
    </HelmetProvider>
  );
};

export default Profile;
