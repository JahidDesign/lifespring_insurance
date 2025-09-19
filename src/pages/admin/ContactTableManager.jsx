// File: ContactTableManager.jsx
import React, { useEffect, useState } from "react";
import { Trash2, Edit, X, Check } from "lucide-react";

const API_URL = "https://insurances-lmy8.onrender.com/contact";

export default function ContactTableManager() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editContact, setEditContact] = useState(null);

  // ---------------------------
  // Fetch Contacts
  // ---------------------------
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setContacts(data.data || []);
    } catch (err) {
      setError("Failed to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ---------------------------
  // Delete Contact
  // ---------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setContacts(contacts.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete contact.");
    }
  };

  // ---------------------------
  // Save Edited Contact
  // ---------------------------
  const handleSaveEdit = async () => {
    try {
      const { _id, name, email, phone, subject, message } = editContact;
      await fetch(`${API_URL}/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      setContacts(
        contacts.map((c) => (c._id === _id ? editContact : c))
      );
      setEditContact(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Manager</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/20 shadow-lg bg-white/5 backdrop-blur-sm">
          <table className="min-w-full text-left divide-y divide-white/20">
            <thead>
              <tr className="bg-white/10">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-white/10 transition">
                  <td className="px-6 py-3">{contact.name}</td>
                  <td className="px-6 py-3">{contact.email}</td>
                  <td className="px-6 py-3">{contact.phone}</td>
                  <td className="px-6 py-3">{contact.subject}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => setEditContact(contact)}
                      className="px-3 py-1 bg-blue-600/80 hover:bg-blue-700 rounded-xl flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="px-3 py-1 bg-red-600/80 hover:bg-red-700 rounded-xl flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------------------
          Edit Modal
      --------------------------- */}
      {editContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 text-white max-w-md w-full p-6 rounded-2xl border border-white/20 shadow-lg relative">
            <button
              onClick={() => setEditContact(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={editContact.name}
                onChange={(e) =>
                  setEditContact({ ...editContact, name: e.target.value })
                }
                className="p-2 rounded-xl bg-white/10 border border-white/20"
              />
              <input
                type="email"
                placeholder="Email"
                value={editContact.email}
                onChange={(e) =>
                  setEditContact({ ...editContact, email: e.target.value })
                }
                className="p-2 rounded-xl bg-white/10 border border-white/20"
              />
              <input
                type="text"
                placeholder="Phone"
                value={editContact.phone}
                onChange={(e) =>
                  setEditContact({ ...editContact, phone: e.target.value })
                }
                className="p-2 rounded-xl bg-white/10 border border-white/20"
              />
              <input
                type="text"
                placeholder="Subject"
                value={editContact.subject}
                onChange={(e) =>
                  setEditContact({ ...editContact, subject: e.target.value })
                }
                className="p-2 rounded-xl bg-white/10 border border-white/20"
              />
              <textarea
                placeholder="Message"
                value={editContact.message}
                onChange={(e) =>
                  setEditContact({ ...editContact, message: e.target.value })
                }
                className="p-2 rounded-xl bg-white/10 border border-white/20 resize-none"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditContact(null)}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-xl flex items-center gap-1"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600/80 hover:bg-green-700 rounded-xl flex items-center gap-1"
              >
                <Check size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
