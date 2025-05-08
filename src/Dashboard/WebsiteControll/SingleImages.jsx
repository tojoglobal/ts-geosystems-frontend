import React, { useEffect, useRef, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";

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

  console.log(images);

  //   const handleFileChange = async (id, event) => {
  //     const file = event.target.files[0];
  //     if (!file) return;

  //     const formData = new FormData();
  //     formData.append("image", file);

  //     try {
  //       const response = await axiosPublicUrl.put(
  //         `/api/homepage-single-images/${id}`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       const updatedImages = images.map((img) =>
  //         img.id === id ? { ...img, url: response.data.imageUrl } : img
  //       );
  //       setImages(updatedImages);
  //     } catch (error) {
  //       console.error("Upload failed", error);
  //     }
  //   };

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

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.length > 0 &&
        images.map((image) => (
          <div
            key={image.id}
            className="relative border p-4 rounded-md shadow-md bg-white"
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleEditClick(image?.id)}
                className="bg-blue-500 text-white p-1 rounded-full"
              >
                Edit
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => (fileInputs.current[image?.id] = el)}
                onChange={(e) => handleFileChange(image?.id, e)}
              />
            </div>
            <div className="h-32 w-full bg-gray-200 flex items-center justify-center">
              <img
                src={image?.imageUrl}
                alt={image.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-2 text-center font-semibold">
              {image?.uniqueName}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SingleImages;
