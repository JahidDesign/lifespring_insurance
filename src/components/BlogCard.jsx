import React from "react";
import VisitorCount from "../pages/VisitorCount";

const BlogCards = ({ blog }) => {
  return (
    <div className="p-6 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-48 object-cover rounded-md mb-4"
          loading="lazy"
        />
      )}
      <h2 className="font-bold text-xl mb-1">{blog.title}</h2>
      <p className="text-gray-500 mb-2">{blog.category}</p>
      <p className="text-gray-700 mb-4 line-clamp-3">{blog.description}</p>
      <VisitorCount blogId={blog._id} />
    </div>
  );
};

export default BlogCards;
