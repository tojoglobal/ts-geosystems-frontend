import Swal from "sweetalert2";
import { useRef } from "react";
import { X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const AdminUpdateTopClients = () => {
  const axiosPublic = useAxiospublic();
  const queryClient = useQueryClient();

  // Fetch current images
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-clients"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/get-top-clients");
      return res?.data?.data;
    },
  });

  // Add images mutation
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      return axiosPublic.post("/api/top-clients", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["top-clients"] });
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Images uploaded successfully",
        timer: 4000,
      });
    },
    onError: () =>
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Failed to upload images",
        timer: 4000,
      }),
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosPublic.delete(`/api/top-clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["top-clients"] });
      Swal.fire({
        title: "Deleted!",
        text: "The image has been deleted.",
        icon: "success",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#22c55e",
        timer: 4000,
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: `${error?.message || "Failed to delete image"}`,
        timer: 4000,
      });
    },
  });

  const fileRef = useRef();

  // Handle image upload
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    addMutation.mutate(formData);
    fileRef.current.value = ""; // reset input after upload
  };

  // Handle delete with confirmation
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
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:gap-10 gap-4 mb-6">
        <h2 className="text-xl md:text-2xl text-teal-600 capitalize">
          Top Clients Images
        </h2>
        <div className="text-center">
          <label
            htmlFor="topClientsUpload"
            className={`inline-block w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#0b6d7f] cursor-pointer text-white font-bold rounded transition hover:bg-[#095666]`}
          >
            Upload Images
          </label>
          <input
            id="topClientsUpload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            ref={fileRef}
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
            Recommended: 200×80px (logo optimal, transparent background
            preferred)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {(data || []).map((client, index) => (
              <div key={client.id} className="relative group">
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${client.imageUrl}`}
                  alt={`Client ${index + 1}`}
                  className="w-full h-24 md:h-28 object-contain rounded-md bg-white"
                />
                <button
                  onClick={() => handleDeleteImage(client.id)}
                  className="absolute cursor-pointer top-2 right-2 z-50 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!data || data.length === 0) && (
              <div className="col-span-2 text-center py-10 text-gray-500">
                No client images uploaded yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUpdateTopClients;
