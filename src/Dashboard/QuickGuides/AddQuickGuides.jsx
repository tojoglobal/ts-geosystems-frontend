import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import useDataQuery from "../../utils/useDataQuery";
import Loader from "../../utils/Loader";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const AddQuickGuides = () => {
  const axiosPublicUrl = useAxiospublic();
  const [imagePreview, setImagePreview] = useState(null);
  const [editingGuide, setEditingGuide] = useState(null);

  const {
    data = {},
    isLoading,
    error,
    refetch: fetchQuickGuides,
  } = useDataQuery(["quickGuides"], "/api/quickGuides");
  const quickGuides = data?.data || [];

  const { register, handleSubmit, watch, reset, setValue } = useForm();

  const watchQuickGuidesName = watch("quickGuidesName", "");

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("quickGuides_name", data.quickGuidesName);
      formData.append("slug", generateSlug(data.quickGuidesName));
      formData.append("quickGuideslink", data.quickGuideslink);
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      let message = "";
      if (editingGuide) {
        await axiosPublicUrl.put(
          `/api/put-quickGuides/${editingGuide.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message = "Quick Guide updated successfully!";
      } else {
        await axiosPublicUrl.post("/api/quickGuides", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message = "Quick Guide added successfully!";
      }

      fetchQuickGuides();
      reset();
      setEditingGuide(null);
      setImagePreview(null);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error saving quick guide.",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    }
  };

  const handleEdit = (guide) => {
    setEditingGuide(guide);
    setValue("quickGuidesName", guide?.quick_guides_name);
    setValue("quickGuideslink", guide.quick_guides_link);
    setImagePreview(guide?.photo);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
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
          await axiosPublicUrl.delete(`/api/quickGuides/${id}`);
          fetchQuickGuides();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Quick guide has been deleted.",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
            timer: 4000,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Error deleting quick guide.",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
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

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading quick guides</div>;

  return (
    <div className="max-w-4xl mx-auto mb-3">
      <h2 className="text-2xl font-bold mb-3 md:mb-5">Add a Quick Guide</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Quick Guide Name
          </label>
          <input
            type="text"
            {...register("quickGuidesName", { required: true })}
            className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            placeholder="Enter Guide name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Slug</label>
          <input
            type="text"
            value={generateSlug(watchQuickGuidesName)}
            readOnly
            className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Quick Guide Logo
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
              Quick Guide Drive Link
            </label>
            <input
              type="text"
              {...register("quickGuideslink", { required: true })}
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              placeholder="Enter quick guide link"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 cursor-pointer text-white py-2 px-4 rounded-sm hover:bg-teal-700 transition"
        >
          {editingGuide ? "Update Quick Guide" : "Add Quick Guide"}
        </button>
      </form>
      {/* Quick Guides Table */}
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
                      Guide Link
                    </th>
                    <th className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(quickGuides) && quickGuides.length > 0 ? (
                    quickGuides.map((guide) => (
                      <tr
                        key={guide?.id}
                        className="border border-gray-600 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                          {guide?.quick_guides_name}
                        </td>
                        <td className="p-2 sm:p-3 border border-gray-600">
                          <img
                            src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                              guide?.photo
                            }`}
                            alt={guide?.quick_guides_name}
                            className="w-20 h-12 object-cover rounded-sm"
                          />
                        </td>
                        <td className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                          <a
                            href={guide?.quick_guides_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-500"
                          >
                            {guide?.quick_guides_name.slice(0, 20)}
                          </a>
                        </td>
                        <td className="text-center p-2 sm:p-3 border border-gray-600 whitespace-nowrap">
                          <div className="flex justify-center items-center gap-1">
                            <button
                              onClick={() => handleEdit(guide)}
                              className="text-blue-300 cursor-pointer hover:text-blue-500 p-1"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(guide?.id)}
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
                        colSpan="4"
                        className="text-center p-3 border border-gray-600"
                      >
                        No quick guides found.
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

export default AddQuickGuides;
