// File: Home.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import HeroSlider from "./HomeHero";
import BlogpostHomeCard from "./BlogpostHomeCard";
import PolicyList from "./PolicyListCard";
import MeetOurTeam from "../components/MeetOurTeam";
import InsuranceSection from "./AboutInsuranceSection";
import Subscribers from "./Subscribers";
import ReviewsCarouselModern from "./ReviewsCarouselModern";
import MotionSkeleton from "../components/MotionSkeleton";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
  }),
};

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <MotionSkeleton />;
  }

  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Smart Insurance | Protect What Matters</title>
        <meta
          name="description"
          content="Discover Smart Insurance services — tailored policies, reliable coverage, and peace of mind for you and your family."
        />
        <meta
          name="keywords"
          content="insurance, policy, life, health, smart insurance"
        />
        <link rel="icon" type="image/png" href="insurance.png" />
        <link rel="apple-touch-icon" href="insurance.png" />
        <link rel="icon" href="insurance.png" sizes="any" />
      </Helmet>

      {/* Hero */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <HeroSlider />
      </motion.div>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-20 px-6 md:px-12 max-w-6xl mx-auto text-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <InsuranceSection />
      </motion.section>

      {/* Services / PolicyList */}
      <motion.section
        id="services"
        className="bg-gray-50 py-20 px-6 md:px-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <PolicyList />
      </motion.section>

      {/* Reviews Carousel */}
      <motion.section
        id="reviews"
        className="bg-gray-50 py-2 px-6 md:px-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <ReviewsCarouselModern />
      </motion.section>

      {/* Blog Section */}
      <motion.section
        id="blogs"
        className="bg-gray-50 py-2 px-6 md:px-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <BlogpostHomeCard />
      </motion.section>

      {/* Subscribers */}
      <motion.section
        id="subscribers"
        className="bg-gray-50 py-2 px-6 md:px-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={5}
      >
        <Subscribers />
      </motion.section>

      {/* Meet Our Team */}
      <motion.section
        className="py-16 px-6 bg-gradient-to-r from-blue-50 to-blue-100"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={6}
      >
        <MeetOurTeam />
      </motion.section>
    </div>
  );
};

export default Home;
