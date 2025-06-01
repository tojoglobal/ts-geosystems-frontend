import { useEffect, useRef, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";

const SingleImages = () => {
  const [images, setImages] = useState([]);
  const fileInputs = useRef({});
  const axiosPublicUrl = useAxiospublic();

  // Fetch images
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["homepage-single-images"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/get-homepage-single-images");
      return res?.data?.data;
    },
  });

  useEffect(() => {
    if (data?.length) {
      const formatted = data.map((img) => ({
        ...img,
        id: img.id.toString(),
      }));
      setImages(formatted);
    }
  }, [data]);

  const handleFileChange = async (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axiosPublicUrl.put(`/api/homepage-single-images/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh the image list
      refetch();
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleEditClick = (id) => {
    if (fileInputs.current[id]) {
      fileInputs.current[id].click();
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0b6d7f]"></div>
    </div>
  ) : isError ? (
    <p className="text-center text-red-500 mt-4">Failed to load images</p>
  ) : (
    <div>
      <h2 className="text-xl md:text-2xl text-teal-600 mb-4 sm:mb-6">
        Dynamic Single Images
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {images.length > 0 &&
          images.map((image, idx) => {
            // Set recommended resolution for each image
            let recommendation = "";
            if (idx === 0)
              recommendation =
                "Recommended: 450×320px (for 3rd banner right side)";
            if (idx === 1)
              recommendation =
                "Recommended: 450×288px (for 4th banner left)";
            if (idx === 2)
              recommendation = "Recommended: 920×288px (for 4th banner right)";
            if (idx === 3)
              recommendation = "Recommended: 1370×320px (for 5th banner)";
            if (idx === 4)
              recommendation = "Recommended: 1370×320px (for 6th banner)";

            return (
              <div
                key={image.id}
                className="relative border border-gray-600 p-3 sm:p-4 rounded-md shadow-md bg-gray-900 transition-shadow hover:shadow-lg"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleEditClick(image?.id)}
                    className="p-2 cursor-pointer sm:p-2.5 bg-[#0b6d7f] text-white rounded-full transition hover:bg-[#095666] disabled:bg-gray-400 active:scale-95 touch-manipulation"
                    aria-label="Edit image"
                  >
                    <EditIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => (fileInputs.current[image?.id] = el)}
                    onChange={(e) => handleFileChange(image?.id, e)}
                  />
                </div>
                <div className="relative w-full h-40 md:h-50 bg-gray-200 rounded-sm overflow-hidden">
                  <img
                    src={import.meta.env.VITE_OPEN_APIURL + image?.imageUrl}
                    alt={image.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                {/* Show the recommendation here */}
                <p className="text-[13px] text-gray-400 my-2 text-center">
                  {recommendation}
                </p>
                <div className="mt-3 text-lg capitalize sm:text-xl text-teal-600 text-center font-semibold break-words">
                  {image?.uniqueName}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SingleImages;
