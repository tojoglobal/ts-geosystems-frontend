import { useEffect, useState, useMemo } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";

// --- Client Information Form ---
const initialState = {
  companyName: "",
  ownerName: "",
  mobileNumber: "",
  address: "",
};

function ClientForm({
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
        ? { ...initialData }
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
    onSubmit(form);
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
        {isEditing ? "Edit Client" : "Add New Client"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            required
            placeholder="Company name"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Company Owner Name
          </label>
          <input
            name="ownerName"
            type="text"
            className="eqp-input"
            value={form.ownerName}
            onChange={handleChange}
            required
            placeholder="Owner name"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Mobile Number
          </label>
          <input
            name="mobileNumber"
            type="tel"
            className="eqp-input"
            value={form.mobileNumber}
            onChange={handleChange}
            required
            placeholder="Mobile number"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Address
          </label>
          <input
            name="address"
            type="text"
            className="eqp-input"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Address"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-8 rounded-lg shadow hover:brightness-110 font-semibold text-base transition"
        >
          {isEditing ? "Update Client" : "Add New Client"}
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
          border-color: #6366f1;
          outline: none;
          box-shadow: 0 0 0 2px #6366f144;
        }
      `}</style>
    </form>
  );
}

// --- Client List ---
function ClientList({ data, onEdit, onDelete, onSearch, searchValue }) {
  return (
    <div className="mt-5 mb-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Client List</h3>
        <div>
          <input
            type="text"
            placeholder="Search by mobile number"
            className="border border-gray-300 rounded px-3 py-2 text-sm w-56"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-xl border border-[#e3eaf5] bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-[#e8f0fe] to-[#fafdff]">
            <tr className="text-left">
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Company Name
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Owner Name
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Mobile Number
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Address
              </th>
              <th className="p-3 whitespace-nowrap text-gray-700 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((client) => (
              <tr
                key={client.id || client.companyName}
                className="hover:bg-[#f5faff] transition"
              >
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {client.companyName}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {client.ownerName}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {client.mobileNumber}
                </td>
                <td className="p-3 border-b border-[#e3eaf5] text-gray-900 font-semibold">
                  {client.address}
                </td>
                <td className="p-3 border-b border-[#e3eaf5]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(client)}
                      className="text-blue-600 font-semibold px-3 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(client.id)}
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
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Main ClientInformationManager Component ---
export default function ClientInformationManager() {
  const axiosPublicUrl = useAxiospublic();
  const [editing, setEditing] = useState(null);
  const [resetFormTrigger, setResetFormTrigger] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all clients only once
  const { data: allClients = [], refetch } = useQuery({
    queryKey: ["allClients"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/clients/search");
      return res.data;
    },
  });

  // Filter clients in-memory for instant search
  const filteredClients = useMemo(() => {
    if (!searchMobile) return allClients;
    return allClients.filter((client) =>
      client.mobileNumber
        ? client.mobileNumber.toLowerCase().includes(searchMobile.toLowerCase())
        : false
    );
  }, [allClients, searchMobile]);

  useEffect(() => {
    setClients(filteredClients);
    setLoading(false);
  }, [filteredClients]);

  useEffect(() => {
    if (!editing) setResetFormTrigger((prev) => !prev);
  }, [editing]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing && editing.id) {
        await axiosPublicUrl.put(`/api/clients/${editing.id}`, data);
        setEditing(null);
      } else {
        await axiosPublicUrl.post("/api/clients", data);
        setResetFormTrigger((prev) => !prev);
      }
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosPublicUrl.delete(`/api/clients/${id}`);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (client) => {
    setEditing(client);
  };

  const handleSearch = (value) => {
    setSearchMobile(value);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-gray-700">
        Client Information Management
      </h2>
      <ClientForm
        onSubmit={handleCreateOrUpdate}
        initialData={editing || initialState}
        isEditing={!!editing}
        onCancel={() => setEditing(null)}
        resetTrigger={resetFormTrigger}
      />
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <ClientList
          data={clients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={handleSearch}
          searchValue={searchMobile}
        />
      )}
    </div>
  );
}
