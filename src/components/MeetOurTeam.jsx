// src/components/MeetOurTeamDemo.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const MeetOurTeamDemo = () => {
  const [team, setTeam] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [admin, setAdmin] = useState(null);

  // Helper → pick 3 unique random agents
  const getRandomAgents = (agents, count = 3) => {
    const shuffled = [...agents].sort(() => 0.5 - Math.random());
    const uniqueAgents = [];
    const seenNames = new Set();

    for (let agent of shuffled) {
      if (!seenNames.has(agent.name)) {
        seenNames.add(agent.name);
        uniqueAgents.push(agent);
      }
      if (uniqueAgents.length === count) break;
    }

    // Fill placeholders if not enough agents
    while (uniqueAgents.length < count) {
      uniqueAgents.push({
        _id: `placeholder-${uniqueAgents.length}`,
        name: "Agent Coming Soon",
        photo: "https://via.placeholder.com/150",
        role: "agent",
        rating: 0,
        smsStrategy: "SMS strategy coming soon",
      });
    }

    return uniqueAgents;
  };

  useEffect(() => {
    axios
      .get("https://insurances-lmy8.onrender.com/customer")
      .then((res) => {
        const data = res.data;

        // Pick 1 active admin
        const adminUser =
          data.find(
            (user) => user.role === "admin" && user.status === "active"
          ) || {
            _id: "placeholder-admin",
            name: "Admin Coming Soon",
            photo: "https://via.placeholder.com/150",
            role: "admin",
            rating: 5,
            smsStrategy: "SMS strategy coming soon",
          };
        // If rating not present, add random for demo
        if (!adminUser.rating) adminUser.rating = 5;
        setAdmin(adminUser);

        // Get all active agents (roles a-e)
        const agents = data
          .filter(
            (user) =>
              ["a", "b", "c", "d", "e"].includes(user.role) &&
              user.status === "active"
          )
          .map((agent) => ({
            ...agent,
            rating: agent.rating || Math.floor(Math.random() * 5) + 1, // random 1-5
          }));
        setAllAgents(agents);

        // Initial 3 agents
        const selectedAgents = getRandomAgents(agents, 3);
        setTeam([adminUser, ...selectedAgents]);
      })
      .catch((err) => console.error(err));
  }, []);

  // Rotate agents every 10 minutes (demo: 10s)
  useEffect(() => {
    if (!admin || allAgents.length === 0) return;

    const interval = setInterval(() => {
      const selectedAgents = getRandomAgents(allAgents, 3);
      setTeam([admin, ...selectedAgents]);
    }, 10000); // 10 minutes → 600000

    return () => clearInterval(interval);
  }, [admin, allAgents]);

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="py-10 bg-gray-50">
        <div className="text-center py-20 px-6">
         <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 mb-6 animate-pulse">
             Meet Our Admin & Agents
          </h2>
          </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <AnimatePresence>
          {team.map((member, idx) => (
            <motion.div
              key={member?._id || idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className={`bg-white p-4 rounded-xl shadow-md text-center ${
                member?.role === "admin" ? "border-2 border-blue-500" : ""
              }`}
            >
              <img
                src={member?.photo}
                alt={member?.name}
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
              <h3 className="mt-3 font-semibold">{member?.name}</h3>
              <p className="text-sm text-gray-500">
                {member?.role === "admin" ? "Admin" : "Agent"}
              </p>

              {/* Rating */}
              <div className="mt-2">{renderStars(member?.rating || 0)}</div>

              {/* SMS Demo */}
              <div className="mt-3 text-xs bg-gray-100 p-2 rounded-md">
                📩 SMS:{" "}
                <span className="italic text-gray-600">
                  Hi {member?.name || "Customer"}, thanks for trusting our
                  insurance services!
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MeetOurTeamDemo;
