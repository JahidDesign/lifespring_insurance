import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const VisitorNewsTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchVisitors = async () => {
    try {
      const res = await fetch("https://insurances-lmy8.onrender.com/visitors");
      const data = await res.json();
      setVisitors(data);
    } catch (error) {
      console.error("Failed to fetch visitors:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const res = await fetch(`https://insurances-lmy8.onrender.com/visitors/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          await Swal.fire("Deleted!", "Visitor has been deleted.", "success");
          fetchVisitors();
        } else {
          Swal.fire("Error!", "Failed to delete visitor.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Server error occurred", "error");
      }
    }
  };

  const handleEdit = (visitor) => {
    setEditingId(visitor._id);
    setEditData(visitor);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirm Update",
      text: "Do you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await fetch(`https://insurances-lmy8.onrender.com/visitors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        await Swal.fire("Updated!", "Visitor updated successfully", "success");
        setEditingId(null);
        fetchVisitors();
      } else {
        Swal.fire("Error!", "Failed to update visitor", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Server error", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-2xl text-black overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">All Visitors</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Image</th>
            <th className="p-3">Link</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v._id} className="border-t hover:bg-gray-50 text-sm">
              <td className="p-3">
                {editingId === v._id ? (
                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  v.title
                )}
              </td>
              <td className="p-3">
                {editingId === v._id ? (
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  v.description
                )}
              </td>
              <td className="p-3">
                <img src={v.image} alt="visitor" className="h-10 w-10 rounded" />
              </td>
              <td className="p-3 text-blue-600 underline">
                <a href={v.link} target="_blank" rel="noreferrer">
                  Visit
                </a>
              </td>
              <td className="p-3">{v.createdAt}</td>
              <td className="p-3 text-center space-x-2">
                {editingId === v._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(v._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditData({});
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(v)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default VisitorNewsTable;
