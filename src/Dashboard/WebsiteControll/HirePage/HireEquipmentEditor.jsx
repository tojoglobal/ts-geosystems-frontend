import React, { useEffect, useState } from "react";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import useDataQuery from "../../../utils/useDataQuery";
import Loader from "../../../utils/Loader";

const normalizeEquipment = (data) =>
  data.map((eq) => ({
    ...eq,
    is_visible: eq.is_visible === 1 || eq.is_visible === true,
  }));

const HireEquipmentEditor = () => {
  const axiosPublUrl = useAxiospublic();

  const { data, isLoading, error, refetch } = useDataQuery(
    ["equipment"],
    "/api/equipment",
    true,
    normalizeEquipment
  );

  const [equipments, setEquipments] = useState([]);

  // Sync fetched data to local state once loaded
  useEffect(() => {
    if (data) {
      setEquipments(data);
    }
  }, [data]);

  const handleChange = (id, field, value) => {
    setEquipments((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
  };

  const saveChanges = async (id) => {
    const equipment = equipments.find((eq) => eq.id === id);

    const formData = new FormData();

    formData.append("name", equipment.name);
    formData.append("is_visible", equipment.is_visible ? "true" : "false");
    formData.append("image_url", equipment.image_url || "");

    if (equipment.newImageFile) {
      formData.append("image", equipment.newImageFile);
    }

    try {
      const res = await axiosPublUrl.put(`/api/equipment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        Swal.fire({
          title: "Success",
          text: res.data?.message,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // optional: refetch data from server
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          error.message ||
          "An unknown error occurred.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  if (isLoading) return <Loader />
  if (error) return <div>Error loading equipment</div>;

  return (
    <div>
      <div className="rounded-lg shadow-2xl mb-4 border border-gray-800 bg-gray-900/95 p-0 sm:p-5">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-8 bg-clip-text text-white tracking-tight">
          Manage Equipment (Admin)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipments.map((eq) => (
            <div
              key={eq.id}
              className="border border-gray-800 bg-gray-800/80 p-4 rounded-lg shadow transition"
            >
              <label className="block mb-1 font-medium text-gray-200">
                Name
              </label>
              <input
                type="text"
                className="w-full mb-2 p-2 border border-gray-800 rounded-lg bg-gray-900 text-white"
                value={eq.name || ""}
                onChange={(e) => handleChange(eq.id, "name", e.target.value)}
              />

              <label className="block mb-1 font-medium text-gray-200">
                Current Image
              </label>
              <img
                src={import.meta.env.VITE_OPEN_APIURL + eq.image_url}
                alt="equipment"
                className="w-full h-40 object-contain mb-2 border border-gray-800 rounded-lg bg-gray-900"
              />

              <label className="block mb-1 font-medium text-gray-200">
                Upload New Image
              </label>
              <input
                type="file"
                className="mb-2 cursor-pointer"
                accept="image/*"
                onChange={(e) =>
                  handleChange(eq.id, "newImageFile", e.target.files[0])
                }
              />

              {/* Toggle Switch for Visibility */}
              <div className="flex items-center gap-2 mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={eq.is_visible}
                    onChange={(e) =>
                      handleChange(eq.id, "is_visible", e.target.checked)
                    }
                  />
                  <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:bg-teal-500 transition duration-300"></div>
                </label>
                <span
                  className={`text-sm font-semibold ${
                    eq.is_visible ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {eq.is_visible ? "Visible" : "Hidden"}
                </span>
              </div>

              <button
                onClick={() => saveChanges(eq.id)}
                className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg transition font-semibold"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HireEquipmentEditor;
