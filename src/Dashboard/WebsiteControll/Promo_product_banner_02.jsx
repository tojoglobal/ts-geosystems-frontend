/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

// Sortable image component
const SortableImage = ({ image, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border border-gray-600 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-40 bg-gray-200/80 backdrop-blur-sm text-gray-600 px-2 py-1 rounded-md cursor-grab touch-manipulation"
        title="Drag to reorder"
      >
        ⠿
      </div>
      {/* Image */}
      <img
        src={
          image?.url || `${import.meta.env.VITE_OPEN_APIURL}${image?.photourl}`
        }
        alt="Uploaded"
        className="w-full h-32 sm:h-40 object-cover"
      />

      {/* Delete Button */}
      <button
        onClick={() => onDelete(image?.id)}
        className="absolute cursor-pointer top-2 right-2 z-50 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition active:scale-95 touch-manipulation"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const Promo_product_banner_02 = () => {
  const axiosPublicUrl = useAxiospublic();
  const [images, setImages] = useState([]);

  // Fetch images
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["promo_product_banner_02_image"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/getupload-images");
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

  const sensors = useSensors(useSensor(PointerSensor));

  // Upload handler
  const handleImageUpload = async (event) => {
    // console.log("promo the fetcher");

    const files = Array.from(event.target.files);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      await axiosPublicUrl.post("/api/upload-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refetch(); // ✅ Refresh list after upload
      Swal.fire("Success", "Images uploaded successfully", "success");
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Error", "Failed to upload images", "error");
    }
  };

  // Delete handler
  const handleDeleteImage = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image?",
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
        await axiosPublicUrl.delete(`/api/delete-image/${id}`);
        refetch(); // ✅ Refresh list after deletion
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Image has been removed.",
          timer: 4000,
        });
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete image",
          timer: 4000,
        });
      }
    }
  };

  // Drag-and-drop reorder handler
  const handleDragEnd = async ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const reordered = arrayMove(images, oldIndex, newIndex);

      setImages(reordered); // Temporary local update for smooth UX

      try {
        await axiosPublicUrl.post("/api/update-image-order", {
          images: reordered.map((img, index) => ({
            id: img.id,
            order: index,
          })),
        });
        await refetch(); // ✅ Ensure backend and frontend stay in sync
      } catch (error) {
        console.error("Order update failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update image order",
          timer: 4000,
        });
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:gap-10 gap-4">
        <h2 className="text-xl md:text-2xl text-teal-600 capitalize">
          promo product banner_02
        </h2>
        <div className="text-center">
          <label
            htmlFor="imageUpload"
            className="inline-block cursor-pointer w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#0b6d7f] text-white font-bold rounded transition hover:bg-[#095666] disabled:bg-gray-400"
          >
            Add Images
          </label>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <p className="text-sm text-gray-400 mb-1 mt-5">
              Recommended: 1370×425px (desktop optimal, ~3.2:1 ratio)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {images.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onDelete={handleDeleteImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default Promo_product_banner_02;
