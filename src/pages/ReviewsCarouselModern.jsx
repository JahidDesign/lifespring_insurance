import React, { useEffect, useState } from "react";
import { FaStar, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // ✅ FIXED import
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ReviewsCarouselModern = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("https://insurances-lmy8.onrender.com/users");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-32 px-6 md:px-12">
        {/* Glow background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.2),transparent)]"></div>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Building <span className="text-yellow-300">Trust</span>  
            <br />
            Through Insurance
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-100 mb-8">
            Your security is our priority. Explore reliable insurance solutions designed for peace of mind and a brighter future.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 rounded-2xl bg-white text-blue-700 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Get Started
            </button>
            <button className="px-6 py-3 rounded-2xl border border-white font-semibold hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
        {/* Decorative blurred circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-40 -z-10"></div>

        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 mt-2 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Trusted by thousands, our services continue to inspire confidence and satisfaction.  
            See why our clients love working with us.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white/70 backdrop-blur-lg border border-gray-200 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-[1.02]">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={review.image || `https://i.pravatar.cc/150?img=${index + 10}`}
                    alt={review.name || "User"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gradient-to-r from-blue-500 to-purple-600"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {review.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.service || "Insurance Service"}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={`${
                        starIndex < (review.rating || 0)
                          ? "text-yellow-400 drop-shadow-sm"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed italic mb-6">
                  “{review.comment || "No comment"}”
                </p>

                {/* Social Links */}
                <div className="flex gap-5 text-blue-500 text-lg">
                  {review.social?.facebook && (
                    <a href={review.social.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors">
                      <FaFacebookF />
                    </a>
                  )}
                  {review.social?.linkedin && (
                    <a href={review.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors">
                      <FaLinkedinIn />
                    </a>
                  )}
                  {review.social?.twitter && (
                    <a href={review.social.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors">
                      <FaTwitter />
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default ReviewsCarouselModern;
