import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { MdEdit, MdDelete } from "react-icons/md";

// --- Equipment Form ---
const initialState = {
  trackingNo: "",
  equipment: "",
  serialNo: "",
  accuracy: "",
  manufacturer: "",
  companyName: "",
  validity: "",
};

// edit time format data
function formatDateForInput(date) {
  if (!date) return "";
  // Handles both Date object and string
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d)) return "";
  // Format as yyyy-mm-dd
  return d.toISOString().slice(0, 10);
}

function EquipmentForm({
  onSubmit,
  initialData,
  isEditing,
  onCancel,
  resetTrigger,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(
      initialData && Object.keys(initialData).length
        ? {
            ...initialData,
            validity: formatDateForInput(initialData.validity),
          }
        : initialState
    );
  }, [initialData, resetTrigger]);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
    };
    onSubmit(data);
    if (!isEditing) setForm(initialState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto rounded-xl p-4 md:p-6 mb-8 border border-gray-800 bg-gray-900/95"
      style={{
        boxShadow: "0 6px 32px 0 rgba(25,118,210,0.11)",
      }}
    >
      <h2 className="font-semibold text-xl mb-8 text-center tracking-wide text-white">
        {isEditing ? "Edit Equipment" : "Add New Equipment"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1 text-gray-200">
            Tracking No
          </label>
          <input
            name="trackingNo"
            type="text"
            className="eqp-input"
            value={form.trackingNo}
            onChange={handleChange}
            required
            autoFocus
            placeholder="Enter tracking no"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-200">
            Equipment
          </label>
          <input
            name="equipment"
            type="text"
            className="eqp-input"
            value={form.equipment}
            onChange={handleChange}
            required
            placeholder="Equipment name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-200">
            Serial No
          </label>
          <input
            name="serialNo"
            type="text"
            className="eqp-input"
            value={form.serialNo}
            onChange={handleChange}
            required
            placeholder="Serial number"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-200">
            Accuracy
          </label>
          <input
            name="accuracy"
            type="text"
            className="eqp-input"
            value={form.accuracy}
            onChange={handleChange}
            placeholder="Accuracy"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-200">
            Manufacturer
          </label>
          <input
            name="manufacturer"
            type="text"
            className="eqp-input"
            value={form.manufacturer}
            onChange={handleChange}
            required
            placeholder="Manufacturer"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-200">
            Company Name
          </label>
          <input
            name="companyName"
            type="text"
            className="eqp-input"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Company name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-200">
            Validity
          </label>
          <input
            name="validity"
            type="date"
            className="eqp-input"
            value={form.validity}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        <button
          type="submit"
          className="bg-teal-600 text-white py-2 px-6 rounded-sm shadow hover:brightness-110 font-semibold text-base transition cursor-pointer"
        >
          {isEditing ? "Update Equipment" : "Add New Equipment"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-8 py-2 rounded-lg font-semibold hover:bg-gray-500 transition cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
      <style>{`
        .eqp-input {
          width: 100%;
          padding: 8px 14px;
          font-size: 16px;
          border: 1.5px solid #334155;
          border-radius: 8px;
          background: #181f2a;
          color: #f8fafc;
          box-sizing: border-box;
          transition: border 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px 0 rgba(25,118,210,0.04);
        }
        .eqp-input:focus {
          border-color: #38b2ac;
          outline: none;
          box-shadow: 0 0 0 2px #b2f5ea55;
        }
      `}</style>
    </form>
  );
}

// --- Equipment List ---
function EquipmentList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-5 mb-3">
      <h3 className="text-2xl sm:text-2xl font-semibold mb-4">
        Equipment List
      </h3>
      <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-800 bg-gray-900/95">
        <table className="min-w-full text-sm text-left bg-gray-900 text-white rounded-xl">
          <thead>
            <tr className="text-left bg-gray-800/80">
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Tracking No
              </th>
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Equipment
              </th>
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Serial No
              </th>
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Accuracy
              </th>
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Manufacturer
              </th>
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Company Name
              </th>
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Validity
              </th>
              <th className="p-3 whitespace-nowrap font-semibold border-b border-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((eqp) => (
              <tr
                key={eqp.id || eqp.trackingNo}
                className="transition hover:bg-gray-800/70"
              >
                <td className="p-3 border-b border-gray-800 font-semibold">
                  {eqp.trackingNo}
                </td>
                <td className="p-3 border-b border-gray-800 font-semibold">
                  {eqp.equipment}
                </td>
                <td className="p-3 border-b border-gray-800 font-semibold">
                  {eqp.serialNo}
                </td>
                <td className="p-3 border-b border-gray-800 font-semibold">
                  {eqp.accuracy}
                </td>
                <td className="p-3 border-b border-gray-800 font-semibold">
                  {eqp.manufacturer}
                </td>
                <td className="p-3 border-b border-gray-800 font-semibold">
                  {eqp.companyName}
                </td>
                <td className="p-3 border-b border-gray-800 font-semibold">
                  {eqp.validity
                    ? new Date(eqp.validity).toLocaleDateString()
                    : ""}
                </td>
                <td className="p-3 border-b border-gray-800 ">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(eqp)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded cursor-pointer transition"
                      title="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(eqp.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer transition"
                      title="Delete"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="p-3 text-center text-gray-400 bg-gray-900"
                >
                  No equipment found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Main EquipmentManagement Component ---
export default function EquipmentManagement() {
  const axiosPublicUrl = useAxiospublic();
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const { data: equipments = [], refetch } = useQuery({
    queryKey: ["equipments"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/equipments/search");
      return res.data;
    },
  });

  // SweetAlert2 dark theme
  const showSwal = ({ icon, title, text }) =>
    Swal.fire({
      icon,
      title,
      text,
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      timer: 4000,
    });

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing && editing.id) {
        await axiosPublicUrl.put(`/api/equipments/${editing.id}`, data);
        setEditing(null);
        showSwal({
          icon: "success",
          title: "Updated!",
          text: "Equipment updated successfully.",
        });
      } else {
        await axiosPublicUrl.post("/api/equipments", data);
        setResetFormTrigger((prev) => !prev);
        showSwal({
          icon: "success",
          title: "Created!",
          text: "Equipment added successfully.",
        });
      }
      refetch();
    } catch (err) {
      showSwal({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to save equipment.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      reverseButtons: true,
      focusCancel: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPublicUrl.delete(`/api/equipments/${id}`);
          refetch();
          showSwal({
            icon: "success",
            title: "Deleted!",
            text: "Equipment has been deleted.",
          });
        } catch (err) {
          showSwal({
            icon: "error",
            title: "Error",
            text: err?.response?.data?.message || "Error deleting equipment.",
          });
        }
      }
    });
  };

  const handleEdit = (equipment) => {
    setEditing(equipment);
  };

  return (
    <div className="max-w-6xl mx-auto p-2">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">
        Equipment Management
      </h2>
      <EquipmentForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || initialState}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      <EquipmentList
        data={equipments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
