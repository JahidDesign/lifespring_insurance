// src/components/DynamicHelmet.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

const DynamicHelmet = ({ title, description, keywords, image, url }) => {
  return (
    <Helmet>
      {/* Main Meta */}
      <title>{title ? `${title} | MyWebsite` : "MyWebsite"}</title>
      <meta name="description" content={description || "Default website description"} />
      <meta name="keywords" content={keywords || "default, seo, react"} />

      {/* Open Graph (Facebook/LinkedIn) */}
      <meta property="og:title" content={title || "MyWebsite"} />
      <meta property="og:description" content={description || "Default description"} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://mywebsite.com"} />
      <meta property="og:image" content={image || "https://mywebsite.com/default-image.jpg"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || "MyWebsite"} />
      <meta name="twitter:description" content={description || "Default description"} />
      <meta name="twitter:image" content={image || "https://mywebsite.com/default-image.jpg"} />
    </Helmet>
  );
};

export default DynamicHelmet;
