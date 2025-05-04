import React, { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useDropzone } from "react-dropzone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";

const AdminUpdateHire = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing hire content
  const { data: hireContent, isLoading } = useQuery({
    queryKey: ["hireContent"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/hire");
      return response.data.data;
    },
  });

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      infoBox: "",
      imageUrl: "",
    },
  });

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles(acceptedFiles); // Update the files state for preview and upload
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  });

  // Reset form when data is loaded
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

      // Prepare form data for submission
      const formData = new FormData();
      if (files.length > 0) {
        formData.append("image", files[0]); // Add new image file, if uploaded
      }
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value); // Add other form fields
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Update Hire Page</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Section */}
          <div className="space-y-3">
            <label htmlFor="title" className="block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "Title is required" })}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-[#e62245]"
              placeholder="Enter page title"
            />
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <label htmlFor="description" className="block font-medium">
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
          <div className="space-y-4">
            <label htmlFor="infoBox" className="block font-medium">
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

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block font-medium">Banner Image</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                isDragActive ? "border-teal-500 bg-teal-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <p>Uploading image...</p>
              ) : (
                <p>
                  Drag & drop or{" "}
                  <span className="underline text-teal-500">browse</span> to
                  upload a new banner image
                </p>
              )}
            </div>
            {/* Image Preview */}
            {(files.length > 0 || hireContent.imageUrl) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Current Banner:</p>
                <img
                  src={
                    files.length > 0
                      ? URL.createObjectURL(files[0])
                      : `${import.meta.env.VITE_OPEN_APIURL}${
                          hireContent.imageUrl
                        }`
                  }
                  alt="Banner preview"
                  className="h-32 w-56 object-cover rounded"
                />
              </div>
            )}
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
