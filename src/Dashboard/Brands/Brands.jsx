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

const Brands = () => {
  const axiosPublicUrl = useAxiospublic();
  const [imagePreview, setImagePreview] = useState(null);
  const [brands, setBrands] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);

  const { register, handleSubmit, watch, reset, setValue } = useForm();

  const watchBrandName = watch("brandName", "");

  const fetchBrands = async () => {
    try {
      const res = await axiosPublicUrl.get("/api/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const formData = new FormData();
      formData.append("brands_name", data.brandName);
      formData.append("slug", generateSlug(data.brandName));
      formData.append("is_populer", data.is_populer ? 1 : 0);
      formData.append("home_page_show", data.home_page_show ? 1 : 0);
      formData.append("status", data.status ? 1 : 0);

      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      if (editingBrand) {
        await axiosPublicUrl.put(`/api/brands/${editingBrand.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosPublicUrl.post("/api/brands", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchBrands();
      reset();
      setEditingBrand(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setValue("brandName", brand.brands_name);
    setValue("is_populer", brand.is_populer === 1);
    setValue("home_page_show", brand.home_page_show === 1);
    setValue("status", brand.status === 1);
    setImagePreview(brand.photo);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await axiosPublicUrl.delete(`/api/brands/${id}`);
        fetchBrands();
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

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-5">
        Add a Brand
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Brand Name</label>
          <input
            type="text"
            {...register("brandName", { required: true })}
            className="w-full px-3 py-2 input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 rounded-sm"
            placeholder="Enter brand name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Slug</label>
          <input
            type="text"
            value={generateSlug(watchBrandName)}
            readOnly
            className="w-full px-3 py-2 input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 rounded-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Brand Logo</label>
          <input
            type="file"
            accept="image/*"
            {...register("photo")}
            className="w-full px-3 py-2 input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 rounded-sm"
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
              className="w-32 sm:w-48 h-24 object-cover mt-2 rounded-sm"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("is_populer")}
              className="w-4 h-4"
            />
            <span>Popular Brand</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("home_page_show")}
              className="w-4 h-4"
            />
            <span>Show on Home Page</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("status")}
              defaultChecked
              className="w-4 h-4"
            />
            <span>Active</span>
          </label>
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer bg-teal-600 text-white py-[6px] px-4 rounded-sm hover:bg-teal-700 transition text-sm sm:text-base"
        >
          {editingBrand ? "Update Brand" : "Add Brand"}
        </button>
      </form>

      {/* Brands Table */}
      <div className="mt-8 overflow-x-auto mb-2">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border border-gray-600 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="text-left p-3 border border-gray-600 whitespace-nowrap">
                  Brand Name
                </th>
                <th className="text-left p-3 border border-gray-600 whitespace-nowrap">
                  Logo
                </th>
                <th className="text-center p-3 border border-gray-600 whitespace-nowrap">
                  Home Page
                </th>
                <th className="text-center p-3 border border-gray-600 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(brands) && brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="border border-gray-600">
                    <td className="p-3 border border-gray-600 whitespace-nowrap">
                      {brand.brands_name}
                    </td>
                    <td className="p-3 border border-gray-600">
                      <img
                        src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                          brand.photo
                        }`}
                        alt={brand.brands_name}
                        className="w-20 sm:w-32 h-12 object-cover rounded-sm mx-auto"
                      />
                    </td>
                    <td className="text-center p-3 border border-gray-600 whitespace-nowrap">
                      {brand.home_page_show === 1 ? (
                        <span className="text-green-600 font-semibold">
                          Shown
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-600">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-blue-600 cursor-pointer hover:text-blue-800 p-1.5"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="text-red-600 cursor-pointer hover:text-red-800 p-1.5"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border border-gray-600">
                  <td
                    colSpan="4"
                    className="text-center p-4 border border-gray-600 text-black"
                  >
                    No brands found.
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

export default Brands;
