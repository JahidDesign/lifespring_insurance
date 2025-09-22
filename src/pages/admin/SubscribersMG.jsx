// Subscribers.jsx
import React, { useEffect, useState } from "react";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/subscribers");
      const data = await res.json();
      setSubscribers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteSubscriber = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      const res = await fetch(`https://insurances-lmy8.onrender.com/subscribers/${id}`, { method: "DELETE" });
      if (res.ok) setSubscribers(subscribers.filter(s => s._id !== id));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (subscribers.length === 0) return <div className="text-center py-20">No subscribers yet.</div>;

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Subscriber List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Subscribed At</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub, index) => (
              <tr key={sub._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{sub.name}</td>
                <td className="py-3 px-6">{sub.email}</td>
                <td className="py-3 px-6">{new Date(sub.createdAt).toLocaleString()}</td>
                <td className="py-3 px-6">
                  <button className="text-red-500 hover:underline" onClick={() => deleteSubscriber(sub._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscribers;
