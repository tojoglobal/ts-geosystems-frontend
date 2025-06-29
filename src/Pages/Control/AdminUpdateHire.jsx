import { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useDropzone } from "react-dropzone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";
import HireEquipmentEditor from "../../Dashboard/WebsiteControll/HirePage/HireEquipmentEditor";

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
      show_hire_enquiry_button: true,
      show_credit_account_button: true,
      show_info_box: true,
      links: {
        contactUs: "",
        privacyPolicy: "",
        termsOfService: "",
      },
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
        show_hire_enquiry_button: !!hireContent.show_hire_enquiry_button,
        show_credit_account_button: !!hireContent.show_credit_account_button,
        show_info_box: !!hireContent.show_info_box,
        links: hireContent.links || {
          contactUs: "",
          privacyPolicy: "",
          termsOfService: "",
        },
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

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("infoBox", data.infoBox);
      formData.append("imageUrl", data.imageUrl);

      formData.append(
        "show_hire_enquiry_button",
        data.show_hire_enquiry_button
      );
      formData.append(
        "show_credit_account_button",
        data.show_credit_account_button
      );
      formData.append("show_info_box", data.show_info_box);

      formData.append("links", JSON.stringify(data.links));

      const response = await axiosPublicUrl.put("/api/hire", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response?.data?.message || "Hire content updated successfully",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
        queryClient.invalidateQueries(["hireContent"]);
      }
    } catch (error) {
      console.error("Error updating hire content:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update hire content",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
        timer: 4000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full m-0 md:m-2">
      <div className="rounded-lg shadow-2xl mb-4 border border-gray-800 bg-gray-900/95 p-0 sm:p-5">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-8 bg-clip-text text-white tracking-tight">
          Update Hire Page
        </h1>
        {isLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("show_hire_enquiry_button")}
                  className="form-checkbox h-5 w-5 text-[#e62245] border-gray-800 rounded focus:ring-[#e62245] cursor-pointer"
                />
                <span className="ml-2 text-sm cursor-pointer text-gray-200">
                  Show Hire Enquiry Button
                </span>
              </label>
              <label className="inline-flex items-center ml-6 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("show_credit_account_button")}
                  className="form-checkbox h-5 w-5 text-[#e62245] border-gray-800 rounded focus:ring-[#e62245] cursor-pointer"
                />
                <span className="ml-2 text-sm cursor-pointer text-gray-200">
                  Show Credit Account Application Button
                </span>
              </label>
              <label className="inline-flex items-center ml-6 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("show_info_box")}
                  className="form-checkbox h-5 w-5 text-[#e62245] border-gray-800 rounded focus:ring-[#e62245] cursor-pointer"
                />
                <span className="ml-2 text-sm cursor-pointer text-gray-200">
                  Show Info Box Content (Estimated Price Sections)
                </span>
              </label>
            </div>
            {/* Image and Title Section */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Image Upload Section */}
              <div className="w-full lg:w-1/2 space-y-3">
                <label className="block font-medium text-sm text-gray-200">
                  Banner Image
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed border-gray-800 rounded-lg p-3 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-teal-500 bg-teal-50" : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <p className="text-gray-900 text-sm">Uploading image...</p>
                  ) : (
                    <p className="text-gray-900 text-sm">
                      Drag & drop or{" "}
                      <span className="underline text-teal-500 cursor-pointer">
                        browse
                      </span>{" "}
                      to upload
                    </p>
                  )}
                </div>
                {(files.length > 0 || hireContent?.imageUrl) && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">
                      Current Banner:
                    </p>
                    <div className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-800">
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
              <div className="w-full lg:w-1/2 space-y-2">
                <label
                  htmlFor="title"
                  className="block font-medium text-sm text-gray-200"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  className="w-full border border-gray-800 rounded-lg p-2 text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                  placeholder="Enter page title"
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block font-medium text-sm text-gray-200"
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
                      height: 220,
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

            {/* Info Box Section */}
            <div className="space-y-2">
              <label
                htmlFor="infoBox"
                className="block font-medium text-sm text-gray-200"
              >
                Info Box Content (Estimated Price Sections)
              </label>
              <Controller
                name="infoBox"
                control={control}
                render={({ field }) => (
                  <Editor
                    apiKey={import.meta.env.VITE_TINY_APIKEY}
                    value={field.value}
                    init={{
                      height: 220,
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

            {/* Links Section */}
            <div className="space-y-3 border-t border-gray-800 pt-3">
              <h3 className="text-base font-medium text-gray-200">
                Page Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-sm mb-1 text-gray-200">
                    Contact Us Link
                  </label>
                  <input
                    type="text"
                    {...register("links.contactUs")}
                    className="w-full border border-gray-800 rounded-lg p-2 text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                    placeholder="/contact-us"
                  />
                </div>
                <div>
                  <label className="block font-medium text-sm mb-1 text-gray-200">
                    Privacy Policy Link
                  </label>
                  <input
                    type="text"
                    {...register("links.privacyPolicy")}
                    className="w-full border border-gray-800 rounded-lg p-2 text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                    placeholder="/ts/privacy"
                  />
                </div>
                <div>
                  <label className="block font-medium text-sm mb-1 text-gray-200">
                    Terms of Service Link
                  </label>
                  <input
                    type="text"
                    {...register("links.termsOfService")}
                    className="w-full border border-gray-800 rounded-lg p-2 text-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#e62245] transition"
                    placeholder="/ts/terms"
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-start pt-2">
              <Button
                text={"Save Changes"}
                disabled={isUploading}
                className="cursor-pointer !rounded-lg"
              />
            </div>
          </form>
        )}
      </div>
      <h1 className="text-xl mt-6 sm:text-2xl font-extrabold mb-4 bg-clip-text text-white tracking-tight">
        Update Hire Equipment
      </h1>
      <HireEquipmentEditor />
    </div>
  );
};

export default AdminUpdateHire;
