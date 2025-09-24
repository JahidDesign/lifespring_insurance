// File: src/components/InsuranceAgentDashboard.jsx
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

const API_BASE = import.meta?.env?.VITE_API_URL || "https://insurances-lmy8.onrender.com";

const StatusPill = ({ status }) => {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium";
  if (status === "Approved")
    return (
      <span className={`${base} bg-green-50 text-green-700 border border-green-200`}>
        <CheckCircle className="w-3.5 h-3.5" /> Approved
      </span>
    );
  if (status === "Rejected")
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

export default function InsuranceAgentDashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expanded, setExpanded] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/policiesuser`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCustomers(data);
    } catch (e) {
      console.error("Failed to fetch customers", e);
      Swal.fire("Error", "Failed to load customers.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const t = setInterval(fetchCustomers, 30000);
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
      const { data } = await axios.patch(`${API_BASE}/policiesuser/${id}`, { status: newStatus });
      const ok = data?.success || data?.modifiedCount > 0 || data?.acknowledged;
      if (ok !== false) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c))
        );
        Swal.fire("Updated", `Customer status set to ${newStatus}.`, "success");
      } else {
        throw new Error("Update not applied");
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Could not update status.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAccept = async (id) => {
    const ok = await confirmAction("Approve this customer?");
    if (ok) await updateStatus(id, "Approved");
  };

  const handleReject = async (id) => {
    const ok = await confirmAction("Reject this customer?");
    if (ok) await updateStatus(id, "Rejected");
  };

  const handleDelete = async (id) => {
    const ok = await confirmAction("Delete this customer?", "Yes, delete");
    if (!ok) return;
    try {
      setActionLoadingId(id);
      const { data } = await axios.delete(`${API_BASE}/policiesuser/${id}`);
      const ok2 = data?.deletedCount > 0 || data?.success;
      if (ok2) {
        setCustomers((prev) => prev.filter((c) => c._id !== id));
        Swal.fire("Deleted", "Customer removed.", "success");
      } else {
        throw new Error("Delete not applied");
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Could not delete customer.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesSearch = q
        ? [c.name, c.email, c.status, c.policies?.join(",")]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        : true;
      const matchesStatus = filterStatus === "all" ? true : c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, filterStatus]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;
      const av = new Date(a[sortKey] || 0).getTime();
      const bv = new Date(b[sortKey] || 0).getTime();
      return (av - bv) * dir;
    });
    return arr;
  }, [filtered, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const current = sorted.slice(start, start + pageSize);

  const onToggleSelectAllPage = (checked) => {
    const idsOnPage = current.map((c) => c._id);
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (checked) idsOnPage.forEach((id) => set.add(id));
      else idsOnPage.forEach((id) => set.delete(id));
      return Array.from(set);
    });
  };

  const onToggleSelectRow = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const bulkUpdate = async (status) => {
    const ok = await confirmAction(`Mark ${selectedIds.length} selected as ${status}?`);
    if (!ok) return;
    await Promise.all(selectedIds.map((id) => updateStatus(id, status)));
    setSelectedIds([]);
  };

  const bulkDelete = async () => {
    const ok = await confirmAction(`Delete ${selectedIds.length} selected?`, "Yes, delete");
    if (!ok) return;
    await Promise.all(selectedIds.map((id) => axios.delete(`${API_BASE}/policiesuser/${id}`)));
    setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
    setSelectedIds([]);
    Swal.fire("Deleted", "Selected customers removed.", "success");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Customer Management</h2>
          <button
            onClick={fetchCustomers}
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
              placeholder="Search name, email, status..."
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => bulkUpdate("Approved")}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
              >
                Approve Selected
              </button>
              <button
                onClick={() => bulkUpdate("Rejected")}
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

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border w-10">
                <input
                  type="checkbox"
                  onChange={(e) => onToggleSelectAllPage(e.target.checked)}
                  checked={current.length > 0 && current.every((c) => selectedIds.includes(c._id))}
                />
              </th>
              {["name", "email", "policies", "createdAt"].map((col) => (
                <th
                  key={col}
                  className="p-3 border cursor-pointer select-none"
                  onClick={() => {
                    setSortKey(col);
                    setSortOrder(sortKey === col && sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center gap-1 capitalize">
                    {col} <ArrowUpDown className="w-4 h-4 text-gray-400" />
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
                <td colSpan={8} className="p-6 text-center">
                  <Loader2 className="w-5 h-5 animate-spin inline-block" />
                </td>
              </tr>
            ) : current.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              current.map((c) => (
                <React.Fragment key={c._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 border">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c._id)}
                        onChange={(e) => onToggleSelectRow(c._id, e.target.checked)}
                      />
                    </td>
                    <td className="p-3 border">{c.name}</td>
                    <td className="p-3 border">{c.email}</td>
                    <td className="p-3 border">{c.policies?.join(", ") || "—"}</td>
                    <td className="p-3 border">{c.createdAt ? format(new Date(c.createdAt), "PPpp") : "—"}</td>
                    <td className="p-3 border">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="p-3 border">
                      {c.status === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={actionLoadingId === c._id}
                            onClick={() => handleAccept(c._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                          >
                            {actionLoadingId === c._id ? "..." : "Approve"}
                          </button>
                          <button
                            disabled={actionLoadingId === c._id}
                            onClick={() => handleReject(c._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                          >
                            {actionLoadingId === c._id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="px-3 py-1 bg-gray-700 text-white rounded-md text-xs hover:bg-gray-800 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [c._id]: !prev[c._id] }))}
                        className="p-1 rounded hover:bg-gray-200"
                        title={expanded[c._id] ? "Collapse" : "Expand"}
                      >
                        {expanded[c._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {expanded[c._id] && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="p-4 border">
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-gray-500">Phone</div>
                            <div>{c.phone || "—"}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">City</div>
                            <div>{c.city || "—"}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Country</div>
                            <div>{c.country || "—"}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Last Updated</div>
                            <div>{c.updatedAt ? format(new Date(c.updatedAt), "PPpp") : "—"}</div>
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
