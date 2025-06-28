/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdEdit, MdDelete } from "react-icons/md";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";

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

  // SweetAlert2 with dark theme
  const showSwal = ({ icon, title, text }) =>
    Swal.fire({
      icon,
      title,
      text,
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      timer: 3000,
    });

  const watchBrandName = watch("brandName", "");

  const fetchBrands = async () => {
    try {
      const res = await axiosPublicUrl.get("/api/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      showSwal({
        icon: "error",
        title: "Error!",
        text: "Failed to load brands",
      });
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
        showSwal({
          icon: "success",
          title: "Success!",
          text: "Brand updated successfully",
        });
      } else {
        await axiosPublicUrl.post("/api/brands", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSwal({
          icon: "success",
          title: "Success!",
          text: "Brand added successfully",
        });
      }

      fetchBrands();
      reset();
      setEditingBrand(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving brand:", error);
      showSwal({
        icon: "error",
        title: "Error!",
        text: "Failed to save brand",
      });
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
          await axiosPublicUrl.delete(`/api/brands/${id}`);
          showSwal({
            icon: "success",
            title: "Deleted!",
            text: "Brand deleted successfully",
          });
          fetchBrands();
        } catch (error) {
          console.error("Error deleting brand:", error);
          showSwal({
            icon: "error",
            title: "Error!",
            text: "Failed to delete brand",
          });
        }
      }
    });
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
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-5">
        Add a Brand
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200">
            Brand Name
          </label>
          <input
            type="text"
            {...register("brandName", { required: true })}
            className="w-full px-3 py-2 input border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 rounded-md"
            placeholder="Enter brand name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200">
            Slug
          </label>
          <input
            type="text"
            value={generateSlug(watchBrandName)}
            readOnly
            className="w-full px-3 py-2 input border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 rounded-md"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200">
            Brand Logo
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("photo")}
            className="w-full px-3 py-2 input border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 rounded-md"
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
              className="h-24 object-cover mt-2 rounded-md border border-gray-700"
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="checkbox"
              {...register("is_populer")}
              className="w-4 h-4"
            />
            <span>Popular Brand</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="checkbox"
              {...register("home_page_show")}
              className="w-4 h-4"
            />
            <span>Show on Home Page</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-white">
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
          className="w-full cursor-pointer bg-teal-600 text-white py-[8px] px-4 rounded-md hover:bg-teal-700 transition text-sm sm:text-base font-semibold"
        >
          {editingBrand ? "Update Brand" : "Add Brand"}
        </button>
      </form>
      {/* Brands Table */}
      <div className="mt-8 overflow-x-auto mb-2">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border border-gray-700 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="text-left p-3 border border-gray-700 whitespace-nowrap font-semibold">
                  Brand Name
                </th>
                <th className="text-left p-3 border border-gray-700 whitespace-nowrap font-semibold">
                  Logo
                </th>
                <th className="text-center p-3 border border-gray-700 whitespace-nowrap font-semibold">
                  Home Page
                </th>
                <th className="text-center p-3 border border-gray-700 whitespace-nowrap font-semibold">
                  Is Popular
                </th>
                <th className="text-center p-3 border border-gray-700 whitespace-nowrap font-semibold">
                  Active
                </th>
                <th className="text-center p-3 border border-gray-700 whitespace-nowrap font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(brands) && brands.length > 0 ? (
                brands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-gray-800/70 transition"
                  >
                    <td className="p-3 border border-gray-700 whitespace-nowrap">
                      {brand.brands_name}
                    </td>
                    <td className="p-3 border border-gray-700">
                      <img
                        src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                          brand.photo
                        }`}
                        alt={brand.brands_name}
                        className="w-20 sm:w-32 h-12 object-cover rounded-md border border-gray-700 mx-auto"
                      />
                    </td>
                    <td className="text-center p-3 border border-gray-700 whitespace-nowrap">
                      {brand.home_page_show === 1 ? (
                        <span className="text-green-400 font-semibold">
                          Shown
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="text-center p-3 border border-gray-700 whitespace-nowrap">
                      {brand.is_populer === 1 ? (
                        <span className="text-green-400 font-semibold">
                          Popular
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold">
                          Not Popular
                        </span>
                      )}
                    </td>
                    <td className="text-center p-3 border border-gray-700 whitespace-nowrap">
                      {brand.status === 1 ? (
                        <span className="text-green-400 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-700">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-blue-400 hover:text-blue-600 p-1 rounded cursor-pointer transition"
                          title="Edit"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer transition"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-700">
                  <td
                    colSpan="6"
                    className="text-center p-4 border-b border-gray-700 text-gray-400"
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
