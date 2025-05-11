import React, { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useDropzone } from "react-dropzone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";

const AdminUpdateHire = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: hireContent, isLoading } = useQuery({
    queryKey: ["hireContent"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/hire");
      return response.data.data;
    },
  });

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      infoBox: "",
      imageUrl: "",
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    if (hireContent) {
      reset({
        title: hireContent.title || "",
        description: hireContent.description || "",
        infoBox: hireContent.infoBox || "",
        imageUrl: hireContent.imageUrl || "",
      });
    }
  }, [hireContent, reset]);

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      if (files.length > 0) {
        formData.append("image", files[0]);
      }
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axiosPublicUrl.put("/api/hire", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Hire content updated successfully",
        });
        queryClient.invalidateQueries(["hireContent"]);
      }
    } catch (error) {
      console.error("Error updating hire content:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update hire content",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Admin - Update Hire Page
      </h1>
      {isLoading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-7"
        >
          {/* Image and Title Section */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Image Upload Section */}
            <div className="w-full lg:w-1/2 space-y-3">
              <label className="block font-medium text-sm sm:text-base mb-1">
                Banner Image
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-sm p-4 sm:p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-600"
                }`}
              >
                <input {...getInputProps()} />
                {isUploading ? (
                  <p className="text-gray-900 text-sm sm:text-base">
                    Uploading image...
                  </p>
                ) : (
                  <p className="text-gray-900 text-sm sm:text-base">
                    Drag & drop or{" "}
                    <span className="underline text-teal-500">browse</span> to
                    upload a new banner image
                  </p>
                )}
              </div>
              {(files.length > 0 || hireContent?.imageUrl) && (
                <div className="mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Current Banner:
                  </p>
                  <div className="relative w-full h-40 md:h-52 rounded-sm overflow-hidden bg-gray-100">
                    <img
                      src={
                        files.length > 0
                          ? URL.createObjectURL(files[0])
                          : `${import.meta.env.VITE_OPEN_APIURL}${
                              hireContent.imageUrl
                            }`
                      }
                      alt="Banner preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div className="w-full lg:w-1/2 space-y-2 sm:space-y-3">
              <label
                htmlFor="title"
                className="block font-medium text-sm sm:text-base"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
                className="w-full border border-gray-300 rounded-sm p-2.5 sm:p-3 text-base focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                placeholder="Enter page title"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2 sm:space-y-4">
            <label
              htmlFor="description"
              className="block font-medium text-sm sm:text-base"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINY_APIKEY}
                  value={field.value}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: "link image code",
                    toolbar:
                      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                />
              )}
            />
          </div>

          {/* Info Box Section */}
          <div className="space-y-2 sm:space-y-4">
            <label
              htmlFor="infoBox"
              className="block font-medium text-sm sm:text-base"
            >
              Info Box Content
            </label>
            <Controller
              name="infoBox"
              control={control}
              render={({ field }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINY_APIKEY}
                  value={field.value}
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: "link image code",
                    toolbar:
                      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <Button text={"Save Changes"} disabled={isUploading} />
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminUpdateHire;
