import { useForm, Controller } from "react-hook-form";
import Button from "../../Dashboard/Button/Button";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import Loader from "../../utils/Loader";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaTrashAlt, FaEdit } from "react-icons/fa";

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
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
      setFile(null);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
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
      setFile(null);
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
    <div className="m-0 md:m-2">
      <div className="rounded-lg border border-gray-800 shadow-2xl mb-4 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-8 text-white flex items-center gap-2 tracking-tight">
          <span className="inline-block bg-clip-text text-white">
            Update Certificate Tracking Page
          </span>
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1 text-gray-200">
              Title
            </label>
            <input
              {...register("title")}
              className="w-full border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-base text-white shadow focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
              placeholder="Certificate Tracking"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 text-gray-200">
              Main Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-base text-white shadow h-28 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                  placeholder="Enter main description"
                />
              )}
            />
          </div>
          {/* Tracking Title */}
          <div>
            <label className="block font-semibold mb-1 text-gray-200">
              Tracking Title
            </label>
            <input
              {...register("tracking_title")}
              className="w-full border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-base text-white shadow focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
              placeholder="Tracking Information"
            />
          </div>
          {/* Tracking Description */}
          <div>
            <label className="block font-semibold mb-1 text-gray-200">
              Tracking Small Description
            </label>
            <Controller
              name="tracking_description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full border border-gray-700 bg-gray-800 rounded-lg px-3 py-2 text-base text-white shadow h-20 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                  placeholder="Tracking small description"
                />
              )}
            />
          </div>
          {/* Image Upload */}
          <div>
            <label className="block font-semibold mb-1 text-gray-200">
              Banner Image
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors bg-gray-900/80 shadow group
                ${
                  isDragActive
                    ? "border-teal-400 bg-gray-800/80"
                    : "border-gray-700"
                }
              `}
              style={{ minHeight: 150 }}
            >
              <input {...getInputProps()} />
              {file || image_url ? (
                <div className="flex flex-col items-center space-y-2 w-full">
                  <img
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : `${import.meta.env.VITE_OPEN_APIURL}${image_url}`
                    }
                    alt="Banner preview"
                    className="max-h-40 rounded-lg border border-gray-700 shadow"
                  />
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex cursor-pointer gap-1 items-center px-3 py-1 rounded-full bg-gray-700/80 text-gray-200 text-xs hover:bg-red-700/80 hover:text-white shadow"
                    >
                      <FaTrashAlt className="text-xs" /> Remove
                    </button>
                    <button
                      type="button"
                      onClick={openFileDialog}
                      className="flex gap-1 items-center cursor-pointer px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs hover:from-teal-600 hover:to-cyan-700 shadow"
                    >
                      <FaEdit className="text-xs" /> Replace Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FaCloudUploadAlt size={38} className="mb-2 text-teal-400" />
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold shadow hover:from-teal-600 hover:to-cyan-700 transition"
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
          <div className="flex justify-end">
            <Button
              text={updateMutation.isPending ? "Saving..." : "Save Changes"}
              disabled={updateMutation.isPending}
              className="!px-8 !py-2 !rounded-xl !font-semibold !text-base"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateCertificateTracking;
