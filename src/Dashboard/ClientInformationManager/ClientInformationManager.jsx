import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

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
      className="max-w-2xl mx-auto rounded-lg p-6 mb-8 border border-gray-600"
    >
      <h2 className="font-semibold text-xl mb-8 text-center tracking-wide">
        {isEditing ? "Edit Client" : "Add New Client"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">Company Name</label>
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
          <label className="block font-medium mb-1">Company Owner Name</label>
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
          <label className="block font-medium mb-1">Mobile Number</label>
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
          <label className="block font-medium mb-1">Address</label>
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
          className="bg-teal-600 text-white py-2 px-5 rounded-sm cursor-pointer shadow hover:brightness-110 font-semibold text-base transition"
        >
          {isEditing ? "Update Client" : "Add New Client"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 cursor-pointer text-white px-8 py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </div>
      <style>{`
        .eqp-input {
          width: 100%;
          padding: 8px 12px;
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
        <h3 className="text-xl font-semibold">Client List</h3>
        <div>
          <input
            type="text"
            placeholder="Search by mobile number"
            className="border border-gray-300 focus:outline-none rounded-md px-3 py-2 text-sm w-64"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-sm border border-gray-600">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-left text-lg border-b border-gray-600">
              <th className="p-3 whitespace-nowrap font-semibold">
                Company Name
              </th>
              <th className="p-3 whitespace-nowrap font-semibold">
                Owner Name
              </th>
              <th className="p-3 whitespace-nowrap font-semibold">
                Mobile Number
              </th>
              <th className="p-3 whitespace-nowrap font-semibold">Address</th>
              <th className="p-3 whitespace-nowrap font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((client) => (
              <tr
                key={client.id || client.companyName}
                className="text-gray-100 transition"
              >
                <td className="p-3 border-b border-gray-600 font-semibold">
                  {client.companyName}
                </td>
                <td className="p-3 border-b border-gray-600 font-semibold">
                  {client.ownerName}
                </td>
                <td className="p-3 border-b border-gray-600 font-semibold">
                  {client.mobileNumber}
                </td>
                <td className="p-3 border-b border-gray-600 font-semibold">
                  {client.address}
                </td>
                <td className="p-3 border-b border-gray-600">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(client)}
                      className="text-blue-300 cursor-pointer hover:text-blue-500 p-1"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(client.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800 p-1"
                    >
                      <FaTrash />
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

  // --- Swal2 success/error standardized
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

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editing && editing.id) {
        await axiosPublicUrl.put(`/api/clients/${editing.id}`, data);
        setEditing(null);
        showSwal({
          icon: "success",
          title: "Updated!",
          text: "Client updated successfully.",
        });
      } else {
        await axiosPublicUrl.post("/api/clients", data);
        setResetFormTrigger((prev) => !prev);
        showSwal({
          icon: "success",
          title: "Created!",
          text: "Client added successfully.",
        });
      }
      refetch();
    } catch (err) {
      showSwal({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to save client.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
          await axiosPublicUrl.delete(`/api/clients/${id}`);
          refetch();
          showSwal({
            icon: "success",
            title: "Deleted!",
            text: "Client has been deleted.",
            timer: 4000,
          });
        } catch (err) {
          showSwal({
            icon: "error",
            title: "Error",
            text: err?.response?.data?.message || "Error deleting client.",
            timer: 4000,
          });
        }
      }
    });
  };

  const handleEdit = (client) => {
    setEditing(client);
  };

  const handleSearch = (value) => {
    setSearchMobile(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
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
        <div className="text-center py-8">Loading...</div>
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
