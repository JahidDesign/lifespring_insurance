// File: src/pages/MyBookQuote.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import UserInsuranceCards from "./UserInsuranceCards"; // make sure path is correct

const MyBookQuote = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Booked Quotes
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            View all your booked insurance quotes in one place. Stay organized
            and keep track of your policies easily.
          </p>
        </div>
      </header>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!user && (
          <p className="text-center text-red-500 mb-6">
            Please login to see your booked quotes.
          </p>
        )}

        {user && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Display UserInsuranceCards component */}
            <UserInsuranceCards />
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookQuote;
