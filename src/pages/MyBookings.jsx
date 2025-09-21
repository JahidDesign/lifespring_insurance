// src/components/MyBookings.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        // Fetch all bookings from bookInsurance API
        const res = await fetch("https://insurances-lmy8.onrender.com/bookInsurance");
        const data = await res.json();

        // Filter bookings for the logged-in user
        const userBookings = data.filter((b) => b.userEmail === user.email);

        setBookings(userBookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        Swal.fire("Error", "Could not fetch bookings.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading)
    return <p className="text-center py-10">Loading your bookings...</p>;
  if (!bookings.length)
    return <p className="text-center py-10">No bookings found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white shadow-md rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{b.serviceName}</h3>
              <p>Provider: {b.providerName}</p>
              <p>Coverage: ${b.coverageAmount}</p>
              <p>Premium: ${b.premium}</p>
              <p>Booked At: {new Date(b.bookedAt || b.createdAt).toLocaleString()}</p>
            </div>
            {b.userPhoto && (
              <img
                src={b.userPhoto || b.imageUrl}
                alt={b.userName}
                className="w-12 h-12 rounded-full mt-2 sm:mt-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
