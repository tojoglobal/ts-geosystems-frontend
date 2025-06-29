import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useDataQuery from "../../utils/useDataQuery";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const Software = () => {
  const axiosPublicUrl = useAxiospublic();
  const [imagePreview, setImagePreview] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [priceShow, setPriceShow] = useState(true); // controlled for checkbox

  const {
    data: softwar = [],
    isLoading,
    error,
    refetch: refetchSoftwar,
  } = useDataQuery(["software"], "/api/software");

  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const watchSoftwarName = watch("softwarName", "");

  // Reset priceShow on add/edit
  useEffect(() => {
    if (!editingBrand) setPriceShow(true);
  }, [editingBrand]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("softwar_name", data.softwarName);
      formData.append("slug", generateSlug(data.softwarName));
      formData.append("softwarlink", data.softwarlink);
      formData.append("price", data.price || "");
      formData.append("price_show", priceShow ? 1 : 0);

      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      let message = "";
      if (editingBrand) {
        await axiosPublicUrl.put(`/api/software/${editingBrand.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message = "Software updated successfully!";
      } else {
        await axiosPublicUrl.post("/api/software", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message = "Software added successfully!";
      }

      refetchSoftwar();
      reset();
      setEditingBrand(null);
      setImagePreview(null);
      setPriceShow(true);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: message,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error.message || "Error saving software.",
        timer: 4000,
      });
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setValue("softwarName", brand.softwar_name);
    setValue("softwarlink", brand.softwarlink);
    setValue("price", brand.price || "");
    setPriceShow(Boolean(Number(brand.price_show)));
    setImagePreview(brand.photo);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete this software?",
      text: "This action cannot be undone.",
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
      customClass: {
        popup: "rounded-lg",
        confirmButton: "swal2-confirm !rounded-md !px-4 !py-2",
        cancelButton: "swal2-cancel !rounded-md !px-4 !py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          await axiosPublicUrl.delete(`/api/software/${id}`);
          refetchSoftwar();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Software has been deleted.",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
            customClass: { popup: "rounded-lg" },
            timer: 4000,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Error deleting software.",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
            customClass: { popup: "rounded-lg" },
            timer: 4000,
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

  if (isLoading) return null;
  if (error) return <div>Error loading software data</div>;

  return (
    <div className="max-w-4xl mx-auto mb-3">
      <h2 className="text-2xl font-bold mb-3 md:mb-5">Add a Software</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Software Name
          </label>
          <input
            type="text"
            {...register("softwarName", { required: true })}
            className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            placeholder="Enter software name"
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
            Software Logo
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
              Software Link
            </label>
            <input
              type="text"
              {...register("softwarlink", { required: true })}
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              placeholder="Enter software link"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("price")}
            className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            placeholder="Enter price"
          />
        </div>
        {/* Price Show/Hide Option */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={priceShow}
            onChange={(e) => setPriceShow(e.target.checked)}
            className="form-checkbox cursor-pointer h-5 w-5 text-teal-600"
            id="price_show"
          />
          <label
            htmlFor="price_show"
            className="block text-sm font-semibold mb-1 cursor-pointer select-none"
          >
            Show Price
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
        >
          {editingBrand ? "Update Software" : "Add Software"}
        </button>
      </form>
      {/* Software Table */}
      <div className="mt-8">
        <div className="relative overflow-x-auto shadow-md rounded-md">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full border border-gray-600 table-auto">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="text-left p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                      Name
                    </th>
                    <th className="text-left p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                      Logo
                    </th>
                    <th className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                      Software Link
                    </th>
                    <th className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                      Price
                    </th>
                    <th className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(softwar) && softwar.length > 0 ? (
                    softwar.map((brand) => (
                      <tr
                        key={brand.id}
                        className="border border-gray-600 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                          {brand.softwar_name}
                        </td>
                        <td className="p-2 sm:p-3 border border-gray-600">
                          <img
                            src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                              brand.photo
                            }`}
                            alt={brand.softwar_name}
                            className="w-20 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                          <a
                            href={brand.softwarlink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-500"
                          >
                            {brand.softwar_name.slice(0, 20)}
                          </a>
                        </td>
                        <td className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                          {(brand.price_show == 1 ||
                            brand.price_show === "1" ||
                            brand.price_show === true ||
                            brand.price_show === "true") &&
                          brand.price ? (
                            <>৳{brand.price}</>
                          ) : (
                            <span className="italic text-gray-400">Hidden</span>
                          )}
                        </td>
                        <td className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => handleEdit(brand)}
                              className="text-blue-300 cursor-pointer hover:text-blue-500 p-1"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(brand.id)}
                              className="text-red-600 cursor-pointer hover:text-red-800 p-1"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border border-gray-600 bg-gray-900 text-white">
                      <td
                        colSpan="5"
                        className="text-center p-3 border border-gray-600"
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
      </div>
    </div>
  );
};

export default Software;
