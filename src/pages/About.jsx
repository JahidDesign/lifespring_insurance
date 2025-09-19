// File: About.jsx
import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import AboutPage from "./AboutPage";
import VisionMissionSection from "./VisionMissionSection";

class About extends Component {
  render() {
    return (
      <div className="bg-white text-gray-900">
        {/* ✅ SEO Helmet with favicon */}
        <Helmet>
          <title>About Us | Smart Insurance</title>
          <meta
            name="description"
            content="Learn more about Smart Insurance — our mission, vision, and commitment to providing reliable insurance solutions tailored to your needs."
          />
          <meta
            name="keywords"
            content="about smart insurance, insurance company, mission, vision, values"
          />

          {/* ✅ Favicon links */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Helmet>

        {/* Page Content */}
        <AboutPage />
        <VisionMissionSection />
      </div>
    );
  }
}

export default About;
