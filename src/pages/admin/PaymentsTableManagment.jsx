// PaymentsTable.jsx — full modern CRUD table with search, sort, filters, pagination,
// bulk Accept/Reject using SweetAlert2, expandable rows, and optimistic updates.
// Tech: React + Tailwind + Lucide + date-fns + axios + sweetalert2
// API: GET /payments, PATCH /payments/:id  { status }
// Optional: DELETE /payments/:id

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Trash2,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";

// 👉 Adjust to your API base
const API_BASE = import.meta?.env?.VITE_API_URL || "https://insurances-lmy8.onrender.com";

const StatusPill = ({ status }) => {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium";
  if (status === "completed")
    return (
      <span className={`${base} bg-green-50 text-green-700 border border-green-200`}>
        <CheckCircle className="w-3.5 h-3.5" /> Completed
      </span>
    );
  if (status === "rejected")
    return (
      <span className={`${base} bg-red-50 text-red-700 border border-red-200`}>
        <XCircle className="w-3.5 h-3.5" /> Rejected
      </span>
    );
  return (
    <span className={`${base} bg-yellow-50 text-yellow-700 border border-yellow-200`}>
      Pending
    </span>
  );
};

export default function PaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expanded, setExpanded] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/payments`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setPayments(data);
    } catch (e) {
      console.error("Failed to fetch payments", e);
      Swal.fire("Error", "Failed to load payments.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // Optional: auto-refresh every 30s
    const t = setInterval(fetchPayments, 30000);
    return () => clearInterval(t);
  }, []);

  const confirmAction = async (label, confirmText = "Yes, proceed") => {
    const result = await Swal.fire({
      title: label,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    return result.isConfirmed;
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      const { data } = await axios.patch(`${API_BASE}/payments/${id}`, {
        status: newStatus,
      });
      // Support various API return shapes
      const ok = data?.success || data?.modifiedCount > 0 || data?.acknowledged;
      if (ok !== false) {
        setPayments((prev) => prev.map((p) => (p._id === id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p)));
        Swal.fire("Updated", `Payment marked as ${newStatus}.`, "success");
      } else {
        throw new Error("Update not applied");
      }
    } catch (e) {
      console.error("Failed to update status", e);
      Swal.fire("Error", "Could not update payment status.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAccept = async (id) => {
    const ok = await confirmAction("Accept this payment?");
    if (ok) await updateStatus(id, "completed");
  };

  const handleReject = async (id) => {
    const ok = await confirmAction("Reject this payment?");
    if (ok) await updateStatus(id, "rejected");
  };

  const handleDelete = async (id) => {
    const ok = await confirmAction("Delete this payment?", "Yes, delete");
    if (!ok) return;
    try {
      setActionLoadingId(id);
      const { data } = await axios.delete(`${API_BASE}/payments/${id}`);
      const ok2 = data?.deletedCount > 0 || data?.success;
      if (ok2) {
        setPayments((prev) => prev.filter((p) => p._id !== id));
        Swal.fire("Deleted", "Payment removed.", "success");
      } else {
        throw new Error("Delete not applied");
      }
    } catch (e) {
      console.error("Failed to delete", e);
      Swal.fire("Error", "Could not delete payment.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Derived list with search/filter/sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      const matchesSearch = q
        ? [p.title, p.type, p.status, p.policyId, p.paymentIntentId]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        : true;
      const matchesStatus = filterStatus === "all" ? true : p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, filterStatus]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;
      if (sortKey === "premium" || sortKey === "coverageAmount") {
        return (a[sortKey] - b[sortKey]) * dir;
      }
      // default: date fields
      const av = new Date(a[sortKey] || 0).getTime();
      const bv = new Date(b[sortKey] || 0).getTime();
      return (av - bv) * dir;
    });
    return arr;
  }, [filtered, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const current = sorted.slice(start, start + pageSize);

  // Selection helpers
  const onToggleSelectAllPage = (checked) => {
    const idsOnPage = current.map((p) => p._id);
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (checked) {
        idsOnPage.forEach((id) => set.add(id));
      } else {
        idsOnPage.forEach((id) => set.delete(id));
      }
      return Array.from(set);
    });
  };

  const onToggleSelectRow = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const bulkUpdate = async (status) => {
    const ok = await confirmAction(`Mark ${selectedIds.length} selected as ${status}?`);
    if (!ok) return;
    try {
      await Promise.all(selectedIds.map((id) => updateStatus(id, status)));
      setSelectedIds([]);
    } catch (_) {
      // updateStatus already handles alerts
    }
  };

  const bulkDelete = async () => {
    const ok = await confirmAction(`Delete ${selectedIds.length} selected?`, "Yes, delete");
    if (!ok) return;
    try {
      await Promise.all(selectedIds.map((id) => axios.delete(`${API_BASE}/payments/${id}`)));
      setPayments((prev) => prev.filter((p) => !selectedIds.includes(p._id)));
      setSelectedIds([]);
      Swal.fire("Deleted", "Selected payments removed.", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Bulk delete failed.", "error");
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Payments Management</h2>
          <button
            onClick={fetchPayments}
            className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-md border hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, type, status, IDs..."
              className="pl-9 pr-3 py-2 border rounded-md text-sm w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => bulkUpdate("completed")}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
              >
                Accept Selected
              </button>
              <button
                onClick={() => bulkUpdate("rejected")}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
              >
                Reject Selected
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 py-1 bg-gray-700 text-white rounded-md text-xs hover:bg-gray-800 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border w-10">
                <input
                  type="checkbox"
                  onChange={(e) => onToggleSelectAllPage(e.target.checked)}
                  checked={current.length > 0 && current.every((p) => selectedIds.includes(p._id))}
                />
              </th>
              {["title", "type", "premium", "coverageAmount", "createdAt"].map((col) => (
                <th
                  key={col}
                  className="p-3 border cursor-pointer select-none"
                  onClick={() => {
                    setSortKey(col);
                    setSortOrder(sortKey === col && sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center gap-1 capitalize">
                    {col === "coverageAmount" ? "Coverage" : col}
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
              ))}
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
              <th className="p-3 border w-16">More</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="p-6 text-center">
                  <Loader2 className="w-5 h-5 animate-spin inline-block" />
                </td>
              </tr>
            ) : current.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">No payments found</td>
              </tr>
            ) : (
              current.map((p) => (
                <React.Fragment key={p._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p._id)}
                        onChange={(e) => onToggleSelectRow(p._id, e.target.checked)}
                      />
                    </td>
                    <td className="p-3 border">{p.title}</td>
                    <td className="p-3 border">{p.type}</td>
                    <td className="p-3 border">${p.premium}</td>
                    <td className="p-3 border">${p.coverageAmount}</td>
                    <td className="p-3 border">{p.createdAt ? format(new Date(p.createdAt), "PPpp") : "—"}</td>
                    <td className="p-3 border"><StatusPill status={p.status} /></td>
                    <td className="p-3 border">
                      {p.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={actionLoadingId === p._id}
                            onClick={() => handleAccept(p._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                          >
                            {actionLoadingId === p._id ? "..." : "Accept"}
                          </button>
                          <button
                            disabled={actionLoadingId === p._id}
                            onClick={() => handleReject(p._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                          >
                            {actionLoadingId === p._id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="px-3 py-1 bg-gray-700 text-white rounded-md text-xs hover:bg-gray-800 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [p._id]: !prev[p._id] }))}
                        className="p-1 rounded hover:bg-gray-200"
                        title={expanded[p._id] ? "Collapse" : "Expand"}
                      >
                        {expanded[p._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {expanded[p._id] && (
                    <tr className="bg-gray-50">
                      <td colSpan={9} className="p-4 border">
                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <div className="text-gray-500">Policy ID</div>
                            <div className="font-mono break-all">{p.policyId || "—"}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Payment Intent</div>
                            <div className="font-mono break-all">{p.paymentIntentId || "—"}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Updated</div>
                            <div>{p.updatedAt ? format(new Date(p.updatedAt), "PPpp") : "—"}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          disabled={pageSafe === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-md text-sm ${
              pageSafe === i + 1 ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          disabled={pageSafe === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
