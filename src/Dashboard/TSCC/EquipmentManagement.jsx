import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";

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

// edit time fromate data
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
      className="bg-gradient-to-br from-[#f0f4f8] to-[#e1ecf7] max-w-2xl mx-auto rounded-2xl shadow-xl px-6 py-8 mb-8 border border-[#e3eaf5]"
      style={{
        boxShadow: "0 6px 32px 0 rgba(25,118,210,0.11)",
      }}
    >
      <h2 className="font-semibold text-xl mb-8 text-gray-800 text-center tracking-wide">
        {isEditing ? "Edit Equipment" : "Add New Equipment"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-600 font-medium mb-1">
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
          <label className="block text-gray-600 font-medium mb-1">
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
          <label className="block text-gray-600 font-medium mb-1">
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
          <label className="block text-gray-600 font-medium mb-1">
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
          <label className="block text-gray-600 font-medium mb-1">
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
          <label className="block text-gray-600 font-medium mb-1">
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
          <label className="block text-gray-600 font-medium mb-1">
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
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-8 rounded-lg shadow hover:brightness-110 font-semibold text-base transition"
        >
          {isEditing ? "Update Equipment" : "Add New Equipment"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-8 py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </div>
      <style>{`
        .eqp-input {
          width: 100%;
          padding: 10px 14px;
          font-size: 16px;
          border: 1.5px solid #dbeafe;
          border-radius: 8px;
          background: #fff;
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
      <h3 className="text-xl font-semibold mb-4 text-gray-200">
        Equipment List
      </h3>
      <div className="overflow-x-auto rounded-xl shadow-xl border border-[#e3eaf5] bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-[#e8f0fe] to-[#fafdff]">
            <tr className="text-left">
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Tracking No
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Equipment
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Serial No
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Accuracy
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Manufacturer
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Company Name
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Validity
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((eqp) => (
              <tr
                key={eqp.id || eqp.trackingNo}
                className="hover:bg-[#f5faff] transition"
              >
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {eqp.trackingNo}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {eqp.equipment}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {eqp.serialNo}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {eqp.accuracy}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {eqp.manufacturer}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {eqp.companyName}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {eqp.validity
                    ? new Date(eqp.validity).toLocaleDateString()
                    : ""}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] ">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(eqp)}
                      className="text-blue-600 font-semibold px-3 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(eqp.id)}
                      className="text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">
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

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing && editing.id) {
        await axiosPublicUrl.put(`/api/equipments/${editing.id}`, data);
        setEditing(null);
      } else {
        await axiosPublicUrl.post("/api/equipments", data);
        setResetFormTrigger((prev) => !prev);
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/equipments/${id}`);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (equipment) => {
    setEditing(equipment);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-700">
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
