// src/components/InsPaymentsTable.jsx
import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://insurances-lmy8.onrender.com/paymentsInsurance";
const ADMIN_EMAIL = "jhadam904@gmail.com";

const InsPaymentsTable = () => {
  const { user } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // modal state
  const [viewItem, setViewItem] = useState(null); // object or null
  const [editItem, setEditItem] = useState(null); // object or null
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  // ---- Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ---- Inline status update (admin)
  const updateStatus = async (id, status) => {
    if (!isAdmin) return Swal.fire("Unauthorized", "Admin only action.", "warning");
    try {
      const prev = payments;
      setPayments(prev.map(p => (p._id === id ? { ...p, status } : p)));

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setPayments(prev); // rollback
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }
      Swal.fire("Success", `Status updated to "${status}"`, "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", e.message || "Something went wrong", "error");
    }
  };

  // ---- Delete (admin)
  const handleDelete = async (id) => {
    if (!isAdmin) return Swal.fire("Unauthorized", "Admin only action.", "warning");
    const confirm = await Swal.fire({
      title: "Delete this payment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }
      setPayments(payments.filter(p => p._id !== id));
      Swal.fire("Deleted", "Payment removed.", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", e.message || "Something went wrong", "error");
    }
  };

  // ---- Save edits (admin)
  const saveEdit = async () => {
    if (!isAdmin) return Swal.fire("Unauthorized", "Admin only action.", "warning");
    if (!editItem) return;

    const { _id, title, premium, coverageAmount, status } = editItem;
    if (!title?.trim()) return Swal.fire("Validation", "Title is required.", "info");

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          premium: Number(premium) || 0,
          coverageAmount: String(coverageAmount ?? ""),
          status: status || "pending",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save changes");
      }
      // update local list
      setPayments(ps => ps.map(p => (p._id === _id ? { ...p, ...editItem } : p)));
      setEditItem(null);
      Swal.fire("Saved", "Payment updated.", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", e.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  // ---- Filter for search
  const list = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.paymentId?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    );
  });

  // ---- UI helpers
  const badge = (status = "pending") => {
    if (status === "completed" || status === "paid")
      return "bg-green-100 text-green-800";
    if (status === "rejected" || status === "failed")
      return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading payments…</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Header + Search */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <h2 className="text-2xl font-bold">Payments Management</h2>
        <div className="flex-1" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID / title / status"
          className="px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-80"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Payment ID</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Premium</th>
              <th className="py-3 px-4 text-left">Coverage</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Created</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
            {list.map((p, i) => (
              <tr
                key={p._id}
                className={`border-t hover:bg-gray-50 ${i % 2 ? "bg-gray-50/40" : "bg-white"}`}
              >
                <td className="py-3 px-4 font-mono">{p.paymentId || "-"}</td>
                <td className="py-3 px-4">{p.title || "-"}</td>
                <td className="py-3 px-4">${p.premium ?? 0}</td>
                <td className="py-3 px-4">${p.coverageAmount ?? 0}</td>
                <td className="py-3 px-4">
                  {/* Inline status control */}
                  {isAdmin ? (
                    <select
                      value={p.status || "pending"}
                      onChange={(e) => updateStatus(p._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">pending</option>
                      <option value="completed">completed</option>
                      <option value="rejected">rejected</option>
                      <option value="paid">paid</option>
                      <option value="failed">failed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full font-semibold ${badge(p.status)}`}>
                      {p.status || "pending"}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
                </td>
                <td className="py-3 px-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setViewItem(p)}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => (isAdmin ? setEditItem({ ...p }) : Swal.fire("Unauthorized", "Admin only action.", "warning"))}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewItem && (
        <Modal onClose={() => setViewItem(null)} title="Payment Details">
          <div className="space-y-2 text-sm">
            <Row k="Payment ID" v={viewItem.paymentId} mono />
            <Row k="Policy" v={viewItem.title} />
            <Row k="Type" v={viewItem.type} />
            <Row k="Premium" v={`$${viewItem.premium ?? 0}`} />
            <Row k="Coverage" v={`$${viewItem.coverageAmount ?? 0}`} />
            <Row k="Status" v={viewItem.status} />
            <Row k="Policy ID" v={viewItem.policyId} mono />
            <Row k="Payment Intent" v={viewItem.paymentIntentId} mono />
            <Row k="Client Secret" v={viewItem.clientSecret} mono />
            <Row k="Email" v={viewItem.userEmail || viewItem.email || "N/A"} />
            <Row
              k="Created"
              v={viewItem.createdAt ? new Date(viewItem.createdAt).toLocaleString() : "-"}
            />
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editItem && (
        <Modal
          title="Edit Payment"
          onClose={() => setEditItem(null)}
          footer={
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => setEditItem(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                onClick={saveEdit}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-3">
            <Labeled label="Title">
              <input
                className="w-full border rounded px-3 py-2"
                value={editItem.title || ""}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
              />
            </Labeled>
            <Labeled label="Premium">
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={editItem.premium ?? 0}
                onChange={(e) => setEditItem({ ...editItem, premium: e.target.value })}
              />
            </Labeled>
            <Labeled label="Coverage Amount">
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={editItem.coverageAmount ?? 0}
                onChange={(e) => setEditItem({ ...editItem, coverageAmount: e.target.value })}
              />
            </Labeled>
            <Labeled label="Status">
              <select
                className="w-full border rounded px-3 py-2"
                value={editItem.status || "pending"}
                onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
              >
                <option value="pending">pending</option>
                <option value="completed">completed</option>
                <option value="rejected">rejected</option>
                <option value="paid">paid</option>
                <option value="failed">failed</option>
              </select>
            </Labeled>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ---------- tiny UI helpers ---------- */
const Row = ({ k, v, mono }) => (
  <p>
    <b>{k}:</b>{" "}
    <span className={mono ? "font-mono break-all" : "break-words"}>{v ?? "-"}</span>
  </p>
);

const Labeled = ({ label, children }) => (
  <label className="text-sm">
    <div className="mb-1 font-medium text-gray-700">{label}</div>
    {children}
  </label>
);

const Modal = ({ title, children, onClose, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-xl w-[92%] max-w-lg p-6 animate-[fadeIn_.15s_ease-out]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <button
          onClick={onClose}
          className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">{children}</div>
      <div className="mt-5">{footer || (
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onClose}>
            Close
          </button>
        </div>
      )}</div>
    </div>
  </div>
);

export default InsPaymentsTable;
