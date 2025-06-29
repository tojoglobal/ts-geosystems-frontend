import { useState, useEffect } from "react";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import DropzoneImageItem from "./../../../utils/DropzoneImageItem";

const AboutUsImgesControlls = () => {
  const axiosPublicUrl = useAxiospublic();
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosPublicUrl.get("/api/get-about-us-images");
        const imagesData = response.data || [];
        const formatted = imagesData.map((img) => ({
          file: null,
          show: img.show,
          order: img.order,
          previewUrl: img.filePath,
          section: img.section,
        }));
        setImages(formatted);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };

    fetchImages();
  }, [axiosPublicUrl]);

  const handleImageDrop = (index) => (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      file,
      previewUrl: URL.createObjectURL(file),
    };
    setImages(newImages);
  };

  const handleImageToggle = (index) => {
    const newImages = [...images];
    newImages[index].show = !newImages[index].show;
    setImages(newImages);
  };

  const onSubmit = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      images.forEach((img, idx) => {
        if (img.file) {
          formData.append(`images[${idx}][file]`, img.file);
        } else {
          formData.append(`images[${idx}][filePath]`, img.previewUrl || "");
        }
        formData.append(`show_${idx}`, img.show ? "true" : "false");
        formData.append(`order_${idx}`, img.order);
        formData.append(`section_${idx}`, img.section);
        formData.append(`filePath_${idx}`, img.previewUrl || "");
      });

      await axiosPublicUrl.put("/api/update-about-us-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "About Us images updated successfully!",
        timer: 4000,
      });
    } catch (error) {
      console.error("Failed to update About Us images:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update About Us images",
        timer: 4000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-7">
      <h1 className="text-xl text-center mb-3">About Us Image Controls</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {images.map((img, idx) => (
            <DropzoneImageItem
              key={idx}
              img={img}
              idx={idx}
              onDrop={handleImageDrop(idx)}
              onToggle={() => handleImageToggle(idx)}
            />
          ))}
        </div>
        <div>
          <button
            className="w-full cursor-pointer bg-teal-600 text-white py-2 px-4 rounded-sm hover:bg-teal-700 transition"
            onClick={onSubmit}
            disabled={isUploading}
          >
            {isUploading ? "Updating..." : "Update Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutUsImgesControlls;
