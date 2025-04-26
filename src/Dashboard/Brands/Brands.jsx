import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
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
    setImagePreview(`/uploads/${brand.photo}`);
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
    <div className="min-h-screen bg-[#f1f4ff] dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add a Brand</h2>
        <form
          className="p-6 bg-white dark:bg-gray-800 rounded shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Brand Name
            </label>
            <input
              type="text"
              {...register("brandName", { required: true })}
              className="w-full input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
              placeholder="Enter brand name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Slug</label>
            <input
              type="text"
              value={generateSlug(watchBrandName)}
              readOnly
              className="w-full input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Brand Logo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="w-full input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover mt-2 rounded"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("is_populer")} />
              Popular Brand
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("home_page_show")} />
              Show on Home Page
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("status")} defaultChecked />
              Active
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
          >
            {editingBrand ? "Update Brand" : "Add Brand"}
          </button>
        </form>

        {/* Brands Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="text-left p-3">Brand Name</th>
                <th className="text-left p-3">Logo</th>
                <th className="text-center p-3">Home Page</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(brands) && brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="border-b dark:border-gray-700">
                    <td className="p-3">{brand.brands_name}</td>
                    <td className="p-3">
                      <img
                        src={`/uploads/${brand.photo}`}
                        alt={brand.brands_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="text-center p-3">
                      {brand.home_page_show === 1 ? (
                        <span className="text-green-500 font-semibold">
                          Shown
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="text-center p-3 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="text-blue-600 hover:text-blue-800"
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
                <tr>
                  <td colSpan="4" className="text-center p-4">
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
