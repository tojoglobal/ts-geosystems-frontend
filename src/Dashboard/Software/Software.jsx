/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const Software = () => {
  const axiosPublicUrl = useAxiospublic();
  const [imagePreview, setImagePreview] = useState(null);
  const [softwar, setSoftwar] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);

  const { register, handleSubmit, watch, reset, setValue } = useForm();

  const watchSoftwarName = watch("softwarName", "");

  const fetchSoftwar = async () => {
    try {
      const res = await axiosPublicUrl.get("/api/softwar");
      setSoftwar(res.data);
    } catch (error) {
      console.error("Error fetching softwar:", error);
    }
  };

  useEffect(() => {
    fetchSoftwar();
  }, []);

  const onSubmit = async (data) => {
    // console.log(data);

    try {
      const formData = new FormData();
      formData.append("softwar_name", data.softwarName);
      formData.append("slug", generateSlug(data.softwarName));
      formData.append("softwarlink", data.softwarlink);
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      if (editingBrand) {
        await axiosPublicUrl.put(`/api/softwar/${editingBrand.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosPublicUrl.post("/api/softwar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchSoftwar();
      reset();
      setEditingBrand(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setValue("softwarName", brand.softwar_name);
    setValue("softwarlink", brand.softwarlink);
    setImagePreview(brand.photo);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await axiosPublicUrl.delete(`/api/softwar/${id}`);
        fetchSoftwar();
      } catch (error) {
        console.error("Error deleting brand:", error);
      }
    }
  };

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.photo && value.photo.length > 0) {
        const file = value.photo[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  //   console.log(softwar);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add a Software</h2>
        <form className="p-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Softwar Name
            </label>
            <input
              type="text"
              {...register("softwarName", { required: true })}
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              placeholder="Enter brand name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Slug</label>
            <input
              type="text"
              value={generateSlug(watchSoftwarName)}
              readOnly
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Softwar Logo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            />
            {imagePreview && (
              <img
                src={
                  imagePreview.startsWith("data:")
                    ? imagePreview
                    : `${
                        import.meta.env.VITE_OPEN_APIURL
                      }/uploads/${imagePreview}`
                }
                alt="Preview"
                className="w-4/12 h-24 object-cover mt-2 rounded"
              />
            )}

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1">
                Softwar Link
              </label>
              <input
                type="text"
                {...register("softwarlink", { required: true })}
                className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                placeholder="Enter Softwar Link"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
          >
            {editingBrand ? "Update Software" : "Add Software"}
          </button>
        </form>

        {/* Brands Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border border-gray-600 rounded shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left p-3 border border-gray-600">
                  Brand Name
                </th>
                <th className="text-left p-3 border border-gray-600">Logo</th>
                <th className="text-center p-3 border border-gray-600">
                  Softwar Link
                </th>
                <th className="text-center p-3 border border-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(softwar) && softwar.length > 0 ? (
                softwar.map((brand) => (
                  <tr
                    key={brand.id}
                    className="border border-gray-600 bg-gray-900 text-white"
                  >
                    <td className="p-3 border border-gray-600">
                      {brand.softwar_name}
                    </td>
                    <td className="p-3 border border-gray-600">
                      <img
                        src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                          brand.photo
                        }`}
                        alt={brand.softwar_name}
                        className="w-10/12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="text-center p-3 border border-gray-600">
                      <a
                        href={brand.softwarlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500"
                      >
                        {brand.softwar_name.slice(0, 20)}
                      </a>
                    </td>
                    <td className="text-center p-3 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="text-blue-300 hover:text-blue-500"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border border-gray-600 bg-gray-900 text-white">
                  <td
                    colSpan="4"
                    className="text-center p-4 border border-gray-600"
                  >
                    No software found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Software;
