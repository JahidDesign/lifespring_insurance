import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { auth } from "../firebase";

const CustomerList = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const token = localStorage.getItem("token"); // store after login
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const res1 = await fetch("https://insurances-lmy8.onrender.com/customer", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const customerResponse = await res1.json();

      if (!customerResponse.success) {
        console.error("Failed to fetch customers:", customerResponse.error);
        return;
      }

      const customers = customerResponse.data; // based on your backend's shape

      const res2 = await fetch("https://insurances-lmy8.onrender.com/profiledesign");
      const profileData = await res2.json();

      const matchedUser = customers.find(
        (user) => user.email === currentUser.email
      );

      if (!matchedUser) return;

      const matchedProfile = profileData.find(
        (profile) => profile.uid === matchedUser.uid
      );

      setUserData({
        ...matchedUser,
        ...matchedProfile
      });

    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  fetchUser();
}, []);

  if (!userData) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-100">
      <UserCard user={userData} />
    </div>
  );
};

export default CustomerList;
