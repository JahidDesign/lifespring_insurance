// File: MotionSkeleton.jsx
import React from "react";
import { motion } from "framer-motion";

const skeletonVariants = {
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.2,
      repeat: Infinity,
    },
  },
};

const MotionSkeleton = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Hero */}
      <motion.div className="h-64 bg-gray-200 rounded-xl" variants={skeletonVariants} animate="pulse" />

      {/* About */}
      <motion.div className="h-32 bg-gray-200 rounded-lg" variants={skeletonVariants} animate="pulse" />

      {/* Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="h-40 bg-gray-200 rounded-lg" variants={skeletonVariants} animate="pulse" />
        ))}
      </div>

      {/* Blog Section */}
      <motion.div className="h-40 bg-gray-200 rounded-lg" variants={skeletonVariants} animate="pulse" />

      {/* Subscribers */}
      <motion.div className="h-24 bg-gray-200 rounded-lg" variants={skeletonVariants} animate="pulse" />

      {/* Meet Our Team */}
      <motion.div className="h-48 bg-gray-200 rounded-lg" variants={skeletonVariants} animate="pulse" />
    </div>
  );
};

export default MotionSkeleton;
