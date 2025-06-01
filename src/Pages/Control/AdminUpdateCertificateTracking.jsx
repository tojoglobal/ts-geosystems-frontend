import { useForm, Controller } from "react-hook-form";
import Button from "../../Dashboard/Button/Button";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import Loader from "../../utils/Loader";
import { useDropzone } from "react-dropzone";

const AdminUpdateCertificateTracking = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);

  const { data: certificateData, isLoading } = useQuery({
    queryKey: ["certificateDescription"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/certificate-description");
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      if (data.image) formData.append("image", data.image);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("tracking_title", data.tracking_title);
      formData.append("tracking_description", data.tracking_description);
      formData.append("image_url", data.image_url || "");
      return axiosPublicUrl.put("/api/certificate-description", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["certificateDescription"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Certificate tracking content updated successfully",
      });
      setFile(null);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update",
      });
    },
  });

  const { control, handleSubmit, reset, register, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      description: "",
      tracking_title: "",
      tracking_description: "",
      image_url: "",
    },
  });

  useEffect(() => {
    if (certificateData) {
      reset({
        title: certificateData.title || "",
        description: certificateData.description || "",
        tracking_title: certificateData.tracking_title || "",
        tracking_description: certificateData.tracking_description || "",
        image_url: certificateData.image_url || "",
      });
      setFile(null); // reset local file state
    }
  }, [certificateData, reset]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const image_url = watch("image_url");

  const removeImage = (e) => {
    e.preventDefault();
    setFile(null);
    setValue("image_url", "");
  };

  const onSubmit = (data) => {
    updateMutation.mutate({ ...data, image: file });
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Admin - Update Certificate Tracking Page
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            Title
          </label>
          <input
            {...register("title")}
            className="w-full border border-gray-600 rounded-sm p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
            placeholder="Certificate Tracking"
          />
        </div>
        {/* Description */}
        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            Main Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full border border-gray-600 rounded-sm p-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                placeholder="Enter main description"
              />
            )}
          />
        </div>
        {/* Tracking Title */}
        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            Tracking Title
          </label>
          <input
            {...register("tracking_title")}
            className="w-full border border-gray-600 rounded-sm p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
            placeholder="Tracking Information"
          />
        </div>
        {/* Tracking Description */}
        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            Tracking Small Description
          </label>
          <Controller
            name="tracking_description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full border border-gray-600 rounded-sm p-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                placeholder="Tracking small description"
              />
            )}
          />
        </div>
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            Banner Image
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors
            ${
              isDragActive ? "border-[#e62245] bg-[#faebef]" : "border-gray-300"
            }
            `}
            style={{ minHeight: 120 }}
          >
            <input {...getInputProps()} />
            {file || image_url ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : `${import.meta.env.VITE_OPEN_APIURL}${image_url}`
                  }
                  alt="Banner preview"
                  className="max-h-40 rounded"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-3 py-1 cursor-pointer rounded bg-gray-200 text-gray-800 text-xs hover:bg-gray-300"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="px-3 py-1 cursor-pointer rounded bg-[#e62245] text-white text-xs hover:bg-[#c81e3c]"
                  >
                    Replace Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="px-4 py-2 rounded bg-[#e62245] text-white text-sm hover:bg-[#c81e3c]"
                >
                  Upload Image
                </button>
                <p className="mt-2 text-xs text-gray-400">
                  Drag & drop or click to select a banner image (JPEG, PNG,
                  WEBP)
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-start">
          <Button text={"Save Changes"} disabled={updateMutation.isPending} />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateCertificateTracking;
