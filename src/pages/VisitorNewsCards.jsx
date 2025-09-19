import { useEffect, useState } from "react";
import { Calendar, ArrowRight, TrendingUp, Zap, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const VisitorNewsCards = () => {
  const [visitors, setVisitors] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://insurances-lmy8.onrender.com/visitors");
      const data = await res.json();
      setVisitors(data);
      setIsVisible(true);
    } catch (error) {
      console.error("Failed to fetch visitors:", error);
      // Mock data for demo
      const mockData = [
        {
          _id: "1",
          title: "LifeSecure Launches Revolutionary AI-Powered Claims Processing",
          description: "Experience lightning-fast claim settlements with our cutting-edge artificial intelligence technology. Reduce processing time by 90% while ensuring maximum accuracy and transparency in every decision.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format",
          createdAt: "2024-03-15",
          category: "Technology",
          views: 12500,
          trending: true
        },
        {
          _id: "2",
          title: "Annual Customer Appreciation Gala: Celebrating Trust & Partnership",
          description: "Join us for an exclusive evening of recognition, networking, and celebration. Meet our leadership team, enjoy premium entertainment, and discover exciting new benefits coming your way.",
          image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&auto=format",
          createdAt: "2024-03-12",
          category: "Events",
          views: 8900
        },
        {
          _id: "3",
          title: "New Health & Wellness Benefits Program Launches Nationwide",
          description: "Introducing comprehensive wellness rewards, telemedicine access, and preventive care coverage. Take charge of your health while earning valuable rewards and reducing your premiums.",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format",
          createdAt: "2024-03-10",
          category: "Health",
          views: 15200
        }
      ];
      setVisitors(mockData);
      setIsVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "from-blue-500 via-cyan-500 to-teal-500",
      Events: "from-purple-500 via-pink-500 to-rose-500",
      Health: "from-green-500 via-emerald-500 to-teal-500",
      Education: "from-orange-500 via-red-500 to-pink-500",
      Healthcare: "from-cyan-500 via-blue-500 to-indigo-500",
      Sustainability: "from-green-500 via-lime-500 to-emerald-500",
      default: "from-gray-500 via-slate-500 to-gray-600"
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Technology: Zap,
      Events: Star,
      Health: Sparkles,
      Education: TrendingUp,
      Healthcare: Star,
      Sustainability: Sparkles,
      default: TrendingUp
    };
    const IconComponent = icons[category] || icons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading latest news...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 py-16 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              News & Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated with our latest innovations, exclusive events, and industry insights
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visitors.map((visitor, index) => (
            <div
              key={visitor._id}
              onMouseEnter={() => setHoveredCard(visitor._id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative transform transition-all duration-700 ${hoveredCard === visitor._id ? 'scale-105 -translate-y-2 z-30' : 'z-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${getCategoryColor(visitor.category)} rounded-3xl opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500`} />

              {/* Card */}
              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col h-full">
                {/* Image */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={visitor.image}
                    alt={visitor.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-2"
                  />
                  {visitor.category && (
                    <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${getCategoryColor(visitor.category)} text-white text-xs font-bold rounded-xl shadow-lg backdrop-blur-sm`}>
                      {getCategoryIcon(visitor.category)}
                      {visitor.category}
                    </div>
                  )}
                  {visitor.trending && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-xl shadow-lg animate-pulse">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="space-y-3">
                    <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      {visitor.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                      {visitor.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200/50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span className="font-medium">{formatDate(visitor.createdAt)}</span>
                    </div>

                    <Link
                      to={`/visitor/${visitor._id}`}
                      className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(visitor.category)} text-white font-bold text-sm rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2`}
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className={`text-center mt-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link
            to="/visitor"
            className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-black text-lg rounded-3xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
          >
            View All News <ArrowRight className="inline w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {/* Line Clamp Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VisitorNewsCards;
