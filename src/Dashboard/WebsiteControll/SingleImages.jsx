import React, { useEffect, useRef, useState } from "react";
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
    <p className="text-center  text-gray-500"> Loading images...</p>
  ) : isError ? (
    <p className="text-center text-red-500">Failed to load images</p>
  ) : (
    <>
      <h2 className=" mt-2  mb-2 text-2xl text-teal-600">
        Dynamic Single Images{" "}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {images.length > 0 &&
          images.map((image) => (
            <div
              key={image.id}
              className="relative border p-4 rounded-md shadow-md bg-gray-800"
            >
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleEditClick(image?.id)}
                  className="px-2 py-2 bg-[#0b6d7f] text-white font-bold rounded transition hover:bg-[#095666] disabled:bg-gray-400"
                >
                  <EditIcon />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (fileInputs.current[image?.id] = el)}
                  onChange={(e) => handleFileChange(image?.id, e)}
                />
              </div>
              <div className="h-50 w-full bg-gray-200 flex items-center justify-center">
                <img
                  src={import.meta.env.VITE_OPEN_APIURL + image?.imageUrl}
                  alt={image.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 text-xl text-teal-600 text-center font-semibold">
                {image?.uniqueName}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default SingleImages;
