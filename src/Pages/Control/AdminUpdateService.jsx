import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";
import ServcePageImageControll from "../../Dashboard/WebsiteControll/ServicePage/ServicePageImageControll";
import AdminUpdateServiceEquipment from "./AdminUpdateServiceEquipment";

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
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
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
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full m-0 md:m-2">
      <div className="rounded-lg shadow-2xl mb-4 border border-gray-800 bg-gray-900/95 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-8 bg-clip-text text-white tracking-tight">
          Update Service Page
        </h1>
        {isLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Title Section */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block font-medium text-gray-200"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
                className="w-full border border-gray-800 rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-[#e62245] transition"
                placeholder="Enter page title"
              />
            </div>
            {/* Description Section */}
            <div className="space-y-4">
              <label
                htmlFor="description"
                className="block font-medium text-gray-200"
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
                      height: 260,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | fontselect fontsizeselect | " +
                        "bold italic underline removeformat | forecolor backcolor | " +
                        "alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist outdent indent | link image media table | " +
                        "preview fullscreen | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                    onEditorChange={(content) => field.onChange(content)}
                  />
                )}
              />
            </div>
            {/* Grid Image Upload */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"> */}
            {/* Grid Image */}
            {/* <div className="space-y-2">
                <label className="block font-medium text-gray-200">
                  Grid Image (will be repeated 4 times)
                </label>
                <div
                  {...getRootPropsGrid()}
                  className={`border-2 border-dashed border-gray-800 rounded-lg p-6 text-center cursor-pointer transition hover:border-teal-500`}
                >
                  <input {...getInputPropsGrid()} />
                  {isUploading ? (
                    <p className="text-gray-400">Uploading image...</p>
                  ) : (
                    <p className="text-gray-400">
                      Drag & drop or{" "}
                      <span className="underline text-teal-500 cursor-pointer">
                        browse
                      </span>{" "}
                      to upload a new grid image
                    </p>
                  )}
                </div>
                {(gridImage || serviceContent?.image_grid) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">
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
                      className="h-24 w-full md:w-44 object-cover rounded-lg border border-gray-800"
                    />
                  </div>
                )}
              </div>
              {/* Banner Image */}
            {/* <div className="space-y-2">
                <label className="block font-medium text-gray-200">
                  Banner Image (will be repeated 2 times)
                </label>
                <div
                  {...getRootPropsBanner()}
                  className={`border-2 border-dashed border-gray-800 rounded-lg p-6 text-center cursor-pointer transition hover:border-teal-500`}
                >
                  <input {...getInputPropsBanner()} />
                  {isUploading ? (
                    <p className="text-gray-400">Uploading image...</p>
                  ) : (
                    <p className="text-gray-400">
                      Drag & drop or{" "}
                      <span className="underline text-teal-500 cursor-pointer">
                        browse
                      </span>{" "}
                      to upload a new banner image
                    </p>
                  )}
                </div>
                {(bannerImage || serviceContent?.image_banner) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">
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
                      className="h-24 w-full md:w-44 object-cover rounded-lg border border-gray-800"
                    />
                  </div>
                )}
              </div>
            // </div> */}
            {/* Info After Images Section */}
            <div className="space-y-3">
              <label
                htmlFor="info_after_images"
                className="block font-medium text-gray-200"
              >
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
                      height: 260,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | fontselect fontsizeselect | " +
                        "bold italic underline removeformat | forecolor backcolor | " +
                        "alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist outdent indent | link image media table | " +
                        "preview fullscreen | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                    onEditorChange={(content) => field.onChange(content)}
                  />
                )}
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-start">
              <Button
                text={"Save Changes"}
                disabled={isUploading}
                className="cursor-pointer !rounded-lg"
              />
            </div>
          </form>
        )}
      </div>
      <div>
        <AdminUpdateServiceEquipment />
        <ServcePageImageControll />
      </div>
    </div>
  );
};

export default AdminUpdateServicePage;
