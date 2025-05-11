import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";

const AdminUpdateServicePage = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [gridImage, setGridImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const { data: serviceContent, isLoading } = useQuery({
    queryKey: ["serviceContent"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/service");
      return response.data.data;
    },
  });

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      info_after_images: "",
      image_grid: "",
      image_banner: "",
    },
  });

  useEffect(() => {
    if (serviceContent) {
      reset({
        title: serviceContent.title || "",
        description: serviceContent.description || "",
        info_after_images: serviceContent.info_after_images || "",
        image_grid: serviceContent.image_grid || "",
        image_banner: serviceContent.image_banner || "",
      });
    }
  }, [serviceContent, reset]);

  const onDropGrid = useCallback((acceptedFiles) => {
    setGridImage(acceptedFiles[0]);
  }, []);

  const onDropBanner = useCallback((acceptedFiles) => {
    setBannerImage(acceptedFiles[0]);
  }, []);

  const { getRootProps: getRootPropsGrid, getInputProps: getInputPropsGrid } =
    useDropzone({
      onDrop: onDropGrid,
      accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
      maxFiles: 1,
    });

  const {
    getRootProps: getRootPropsBanner,
    getInputProps: getInputPropsBanner,
  } = useDropzone({
    onDrop: onDropBanner,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("info_after_images", data.info_after_images);
      formData.append("oldImageGrid", data.image_grid);
      formData.append("oldImageBanner", data.image_banner);

      if (gridImage) formData.append("imageGrid", gridImage);
      if (bannerImage) formData.append("imageBanner", bannerImage);

      const response = await axiosPublicUrl.put("/api/service", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Service content updated successfully",
        });
        queryClient.invalidateQueries(["serviceContent"]);
        setGridImage(null);
        setBannerImage(null);
      }
    } catch (error) {
      console.error("Error updating service content:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "Failed to update service content",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-5">
        Admin - Update Service Page
      </h1>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          {/* Title Section */}
          <div className="space-y-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Grid Image Upload */}
            <div className="space-y-2">
              <label className="block font-medium">
                Grid Image (will be repeated 4 times)
              </label>
              <div
                {...getRootPropsGrid()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isUploading ? "border-gray-300" : "hover:border-teal-500"
                }`}
              >
                <input {...getInputPropsGrid()} />
                {isUploading ? (
                  <p>Uploading image...</p>
                ) : (
                  <p>
                    Drag & drop or{" "}
                    <span className="underline text-teal-500">browse</span> to
                    upload a new grid image
                  </p>
                )}
              </div>
              {(gridImage || serviceContent?.image_grid) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Current Grid Image:
                  </p>
                  <img
                    src={
                      gridImage
                        ? URL.createObjectURL(gridImage)
                        : `${import.meta.env.VITE_OPEN_APIURL}${
                            serviceContent.image_grid
                          }`
                    }
                    alt="Grid preview"
                    className="h-24 w-full md:w-44 object-cover rounded"
                  />
                </div>
              )}
            </div>
            {/* Banner Image Upload */}
            <div className="space-y-2">
              <label className="block font-medium">
                Banner Image (will be repeated 2 times)
              </label>
              <div
                {...getRootPropsBanner()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isUploading ? "border-gray-300" : "hover:border-teal-500"
                }`}
              >
                <input {...getInputPropsBanner()} />
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
              {(bannerImage || serviceContent?.image_banner) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Current Banner Image:
                  </p>
                  <img
                    src={
                      bannerImage
                        ? URL.createObjectURL(bannerImage)
                        : `${import.meta.env.VITE_OPEN_APIURL}${
                            serviceContent.image_banner
                          }`
                    }
                    alt="Banner preview"
                    className="h-24 w-full md:w-44 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
          {/* Info After Images Section */}
          <div className="space-y-3">
            <label htmlFor="info_after_images" className="block font-medium">
              Content After Repeated 4 Images
            </label>
            <Controller
              name="info_after_images"
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

export default AdminUpdateServicePage;
