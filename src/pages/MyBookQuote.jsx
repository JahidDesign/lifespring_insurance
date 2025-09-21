// File: src/pages/MyBookQuote.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import UserInsuranceCards from "./UserInsuranceCards";
import MyBookings from "./MyBookings";
import MyPolicies from "./MyPolicies";
import InsuranceCards from "./InsuranceCards";

const MyBookQuote = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 via-purple-600 to-blue-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            My Booked Quotes
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            View all your booked insurance quotes in one place. Stay organized
            and manage your policies effortlessly.
          </motion.p>
        </div>
      </header>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!user && (
          <motion.p
            className="text-center text-red-500 mb-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Please login to see your booked quotes.
          </motion.p>
        )}

        {user && (
          <motion.div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <UserInsuranceCards />
          </motion.div>
        )}
      </main>

      {/* Other Sections */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <MyBookings />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <MyPolicies />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <InsuranceCards />
        </motion.div>
      </section>
    </div>
  );
};

export default MyBookQuote;
