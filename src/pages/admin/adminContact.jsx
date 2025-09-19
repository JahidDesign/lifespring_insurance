// File: ContactManager.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Mail,
  Phone,
  AlertCircle,
  Search,
  X,
} from "lucide-react";

const API_URL = "https://insurances-lmy8.onrender.com/contact";

// ---------------------------
// Inquiry Style Mapping
// ---------------------------
const getInquiryStyle = (type) => {
  switch (type) {
    case "support":
      return "from-blue-500/20 to-blue-400/10 border-blue-400/40";
    case "sales":
      return "from-green-400/20 to-green-300/10 border-green-300/40";
    case "general":
      return "from-purple-500/20 to-purple-400/10 border-purple-400/40";
    default:
      return "from-pink-500/20 to-pink-400/10 border-pink-400/40";
  }
};

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);

  // ---------------------------
  // Fetch Contacts
  // ---------------------------
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setContacts(json.data || []);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };
    fetchContacts();
  }, []);

  // ---------------------------
  // Bulk Delete
  // ---------------------------
  const handleDeleteSelected = async () => {
    if (!selectedContacts.length) return;
    if (!window.confirm("Delete selected contacts?")) return;

    try {
      await Promise.all(
        selectedContacts.map((id) =>
          fetch(`${API_URL}/${id}`, { method: "DELETE" })
        )
      );
      setContacts((prev) =>
        prev.filter((c) => !selectedContacts.includes(c._id))
      );
      setSelectedContacts([]);
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // ---------------------------
  // Search Filter
  // ---------------------------
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white">
      {/* ---------------------------
          Hero Section
      --------------------------- */}
      <section className="px-6 md:px-12 py-12 text-center border-b border-white/10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          Contact Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 mt-3"
        >
          Stay on top of your customer inquiries ✨
        </motion.p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 max-w-4xl mx-auto">
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold">{contacts.length}</h3>
            <p className="text-slate-400 text-sm">Total Inquiries</p>
          </div>
          <div className="p-6 bg-blue-500/20 rounded-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold">
              {contacts.filter((c) => c.inquiryType === "support").length}
            </h3>
            <p className="text-slate-400 text-sm">Support</p>
          </div>
          <div className="p-6 bg-green-500/20 rounded-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold">
              {contacts.filter((c) => c.inquiryType === "sales").length}
            </h3>
            <p className="text-slate-400 text-sm">Sales</p>
          </div>
          <div className="p-6 bg-purple-500/20 rounded-2xl backdrop-blur-md">
            <h3 className="text-2xl font-bold">
              {contacts.filter((c) => c.inquiryType === "general").length}
            </h3>
            <p className="text-slate-400 text-sm">General</p>
          </div>
        </div>
      </section>

      {/* ---------------------------
          Toolbar
      --------------------------- */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        {selectedContacts.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 px-5 py-2 rounded-xl text-white font-semibold hover:scale-105 transition"
          >
            <Trash2 size={16} /> Delete Selected
          </motion.button>
        )}
      </div>

      {/* ---------------------------
          Contacts Grid
      --------------------------- */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact, index) => (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveContact(contact)}
            className={`relative bg-gradient-to-br ${getInquiryStyle(
              contact.inquiryType
            )} border backdrop-blur-xl rounded-3xl p-6 shadow-lg cursor-pointer`}
          >
            {/* Badge */}
            <span className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full bg-black/40 text-white border border-white/20">
              {contact.inquiryType || "N/A"}
            </span>

            {/* Info */}
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              {contact.name}
              {contact.inquiryType === "support" && (
                <AlertCircle className="text-blue-400" size={18} />
              )}
            </h3>
            <p className="flex items-center gap-2 text-slate-300 text-sm">
              <Mail size={16} /> {contact.email}
            </p>
            <p className="flex items-center gap-2 text-slate-400 text-sm mb-3">
              <Phone size={16} /> {contact.phone || "No phone"}
            </p>
            <p className="text-slate-200 font-medium">{contact.subject}</p>
            <p className="text-slate-300 italic text-sm mt-2">
              “{contact.message.substring(0, 80)}...”
            </p>
          </motion.div>
        ))}
      </div>

      {/* ---------------------------
          Modal for Full Details
      --------------------------- */}
      <AnimatePresence>
        {activeContact && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-900 text-white max-w-lg w-full p-8 rounded-2xl shadow-xl relative border border-white/20"
            >
              <button
                onClick={() => setActiveContact(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={22} />
              </button>
              <h2 className="text-2xl font-bold mb-2">{activeContact.name}</h2>
              <p className="text-slate-400 mb-2">{activeContact.email}</p>
              <p className="text-slate-400 mb-4">
                {activeContact.phone || "No phone"}
              </p>
              <h3 className="font-semibold text-lg mb-1">
                {activeContact.subject}
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                {activeContact.message}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(activeContact.date).toLocaleString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
