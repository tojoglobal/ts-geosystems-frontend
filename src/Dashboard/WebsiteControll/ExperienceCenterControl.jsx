import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ExperienceCenterControl = () => {
  const axiosPublicUrl = useAxiospublic();

  const {
    data: images = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["experience_center_images"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/get-experience-center-images");
      return res?.data?.data || [];
    },
  });

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:gap-10 gap-4 mb-6">
        <h2 className="text-xl md:text-2xl text-teal-600 capitalize">
          Experience Center Images
        </h2>
        <div className="text-center">
          <label
            htmlFor="experienceCenterUpload"
            className="inline-block w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#0b6d7f] text-white font-bold rounded transition hover:bg-[#095666] disabled:bg-gray-400"
          >
            Upload New Images (Max 3)
          </label>
          <input
            id="experienceCenterUpload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            max={3}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={`${import.meta.env.VITE_OPEN_APIURL}${image.photourl}`}
                alt={`Experience Center ${index + 1}`}
                className="w-full h-40 md:h-56 object-cover rounded-md"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
                Image {index + 1}
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-500">
              No images uploaded yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceCenterControl;
