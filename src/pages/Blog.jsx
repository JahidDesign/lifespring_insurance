import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BlogCards from "../components/BlogCard";
import BlogCard from "./BlogCard";
import VisitorNewsCards from "./VisitorNewsCards";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/blogposts");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-10">
      {/* SEO + Favicon */}
      <Helmet>
        <title>Blog | Smart Insurance</title>
        <meta
          name="description"
          content="Read the latest news, insights, and articles from Smart Insurance. Stay updated with tips on policies, claims, and financial protection."
        />
        <meta
          name="keywords"
          content="insurance blog, smart insurance news, policy updates, insurance tips"
        />
        <link rel="icon" href="insurance.png" sizes="any" />
        <link rel="icon" type="image/png" href="insurance.png" />
        <link rel="apple-touch-icon" href="insurance.png" />
      </Helmet>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Smart Insurance Blog
        </h1>
        <p className="text-gray-600">
          Stay updated with the latest insurance news, tips, and insights.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCards key={blog._id} blog={blog} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No blogs available at the moment.
          </p>
        )}
      </div>

      {/* Visitor News Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <BlogCard />
      </div>
      <div className="max-w-7xl mx-auto mt-16">
        <VisitorNewsCards />
      </div>
    </div>
  );
};

export default Blog;
