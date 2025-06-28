import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { X } from "lucide-react";
import useDataQuery from "../../utils/useDataQuery";

const ExperienceCenterControl = () => {
  const axiosPublicUrl = useAxiospublic();
  const {
    data = {},
    isLoading,
    isError,
    refetch,
  } = useDataQuery(
    ["experience_center_images_public"],
    "/api/get-experience-center-images"
  );
  const images = data?.data || [];

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const availableSlots = 3 - images.length;
    if (availableSlots <= 0) {
      Swal.fire(
        "Error",
        "Maximum 3 images already exist. Delete some first.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    files
      .slice(0, availableSlots)
      .forEach((file) => formData.append("images", file));

    try {
      await axiosPublicUrl.post(
        "/api/upload-experience-center-images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await refetch();
      Swal.fire("Success", "Images uploaded successfully", "success");
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Error", "Failed to upload images", "error");
    }
  };

  const handleDeleteImage = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosPublicUrl.delete(
          `/api/delete-experience-center-image/${id}`
        );
        await refetch();
        Swal.fire({
          title: "Deleted!",
          text: "The image has been deleted.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#22c55e", // green
          timer: 4000,
        });
      } catch (error) {
        Swal.fire({
          icon: "Error",
          title: "Error!",
          text: `${error.message} || Failed to delete image`,
          timer: 4000,
        });
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:gap-10 gap-4 mb-6">
        <h2 className="text-xl md:text-2xl text-teal-600 capitalize">
          Experience Center Images
        </h2>
        <div className="text-center">
          <label
            htmlFor="experienceCenterUpload"
            className={`inline-block w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#0b6d7f] cursor-pointer text-white font-bold rounded transition ${
              images.length >= 3
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#095666]"
            }`}
          >
            {images.length >= 3
              ? "Max 3 Images Reached"
              : `Upload Images (${3 - images.length} slots left)`}
          </label>
          <input
            id="experienceCenterUpload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={images.length >= 3}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0b6d7f]"></div>
        </div>
      ) : isError ? (
        <p className="text-center text-red-500 mt-4">Failed to load images</p>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-2">
            Recommended: 450×256px (desktop optimal, ~1.76:1 ratio)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${image.photourl}`}
                  alt={`Experience Center ${index + 1}`}
                  className="w-full h-40 md:h-52 object-cover rounded-md"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
                  Image {index + 1}
                </div>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute cursor-pointer top-2 right-2 z-50 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No images uploaded yet. You can upload up to 3 images.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExperienceCenterControl;
