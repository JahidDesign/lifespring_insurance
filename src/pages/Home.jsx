// File: Home.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSlider from "./HomeHero";
import InsuranceServicesCard from "./InsuranceServicesCard";
import PolicyList from "./PolicyListCard";
import InsuranceCarouselHero from "./InsuranceCarouselHero";
import InsuranceSection from "./AboutInsuranceSection";
import ReviewsCarouselModern from "./ReviewsCarouselModern";

const Home = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* SEO Helmet */}
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

        {/* ✅ Favicon setup */}
        <link rel="icon" type="image/png" href="insurance.png" />
        <link rel="apple-touch-icon" href="insurance.png" />
        <link rel="icon" href="insurance.png" sizes="any" />
      </Helmet>

      {/* Hero Section */}
      <HeroSlider />

      {/* About Section */}
      <section
        id="about"
        className="py-20 px-6 md:px-12 max-w-6xl mx-auto text-center"
      >
        <InsuranceSection />
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-50 py-20 px-6 md:px-12">
        <PolicyList />
      </section>

      {/* Carousel Highlight */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <InsuranceCarouselHero />
      </section>

      {/* Cards Section */}
     <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
  {/* Heading */}
  <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
    Explore Our Plans
  </h2>

  {/* Animated gradient underline */}
  <div className="flex justify-center mb-8">
    <span className="block w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full animate-pulse"></span>
  </div>

  {/* Description */}
  <p className="text-center text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-12">
    Discover a variety of insurance solutions tailored to your lifestyle. From health and life coverage to travel and vehicle protection, secure your future confidently with plans designed to fit your needs.
  </p>

  {/* Cards container */}
    <InsuranceServicesCard />

</section>
 <section id="services" className="bg-gray-50 py-2 px-6 md:px-12">
        <ReviewsCarouselModern />
      </section>

    </div>
  );
};

export default Home;
