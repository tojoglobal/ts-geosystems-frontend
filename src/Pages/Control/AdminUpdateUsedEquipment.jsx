import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { useDropzone } from "react-dropzone";
import { useState, useEffect, useCallback } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import Loader from "../../utils/Loader";

const AdminUpdateUsedEquipment = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const [bannerFile, setBannerFile] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["usedEquipmentContent"],
    queryFn: async () => {
      const { data } = await axiosPublicUrl.get("/api/used-equipment-content");
      return data.data;
    },
  });

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      banner_image: "",
      banner_image_show: true,
      description: "",
      benefits_box_title: "USED SURVEYING EQUIPMENT BENEFITS",
      benefits_box_description: "",
      benefits_box_show: true,
      links: {
        contactUs: "",
        brochure: "",
      },
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        banner_image: data.banner_image,
        banner_image_show: !!data.banner_image_show,
        description: data.description,
        benefits_box_title: data.benefits_box_title,
        benefits_box_description: data.benefits_box_description,
        benefits_box_show: !!data.benefits_box_show,
        links: data.links || { contactUs: "", brochure: "" },
      });
    }
  }, [data, reset]);

  const onBannerDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) setBannerFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onBannerDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const mutation = useMutation({
    mutationFn: async (formDataObj) => {
      return axiosPublicUrl.put("/api/used-equipment-content", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usedEquipmentContent"]);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        timer: 1000,
        showConfirmButton: false,
      });
      setBannerFile(null);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to update",
      });
    },
  });

  const onSubmit = (formVals) => {
    const formData = new FormData();
    if (bannerFile) formData.append("banner_image", bannerFile);
    formData.append("banner_image_show", formVals.banner_image_show);
    formData.append("description", formVals.description);
    formData.append("benefits_box_title", formVals.benefits_box_title);
    formData.append(
      "benefits_box_description",
      formVals.benefits_box_description
    );
    formData.append("benefits_box_show", formVals.benefits_box_show);
    formData.append("links", JSON.stringify(formVals.links || {}));
    mutation.mutate(formData);
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Admin - Update Used Equipment Page
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium text-sm mb-2">Banner Image</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded p-3 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>
              Drag & drop or{" "}
              <span className="underline text-teal-500">browse</span> to upload
            </p>
          </div>
          {(bannerFile || watch("banner_image")) && (
            <img
              src={
                bannerFile
                  ? URL.createObjectURL(bannerFile)
                  : watch("banner_image") &&
                    import.meta.env.VITE_OPEN_APIURL + watch("banner_image")
              }
              alt="Banner Preview"
              className="w-full max-h-48 object-contain mt-2"
            />
          )}
          <label className="inline-flex items-center mt-2">
            <input
              type="checkbox"
              {...register("banner_image_show")}
              className="form-checkbox h-5 w-5 cursor-pointer text-[#e62245]"
            />
            <span className="ml-2 text-sm cursor-pointer">
              Show Banner Image
            </span>
          </label>
        </div>
        <div>
          <label className="block font-medium text-sm mb-2">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                value={field.value}
                init={{
                  height: 150,
                  menubar: false,
                  plugins: "link image code",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
                }}
                onEditorChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="border-t pt-4">
          <label className="block font-medium text-sm mb-2">
            Benefits Box Title
          </label>
          <input
            type="text"
            {...register("benefits_box_title")}
            className="w-full border border-gray-600 rounded p-2 text-sm"
          />
          <label className="block font-medium text-sm mb-2 mt-4">
            Benefits Box Description
          </label>
          <Controller
            name="benefits_box_description"
            control={control}
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                value={field.value}
                init={{
                  height: 120,
                  menubar: false,
                  plugins: "link image code",
                  toolbar:
                    "undo redo | bold italic | alignleft aligncenter alignright | code",
                }}
                onEditorChange={field.onChange}
              />
            )}
          />
          <label className="inline-flex items-center mt-2">
            <input
              type="checkbox"
              {...register("benefits_box_show")}
              className="form-checkbox h-5 w-5 cursor-pointer text-[#e62245]"
            />
            <span className="ml-2 text-sm cursor-pointer">
              Show Benefits Box Section
            </span>
          </label>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-base font-medium">Page Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-sm mb-1">
                Contact Us Link
              </label>
              <input
                type="text"
                {...register("links.contactUs")}
                className="w-full border border-gray-600 rounded p-2 text-sm"
                placeholder="/contact-us"
              />
            </div>
            <div>
              <label className="block font-medium text-sm mb-1">
                Brochure Link
              </label>
              <input
                type="text"
                {...register("links.brochure")}
                className="w-full border border-gray-600 rounded p-2 text-sm"
                placeholder="https://"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-start pt-2">
          <button
            type="submit"
            className="w-full cursor-pointer bg-teal-600 text-white py-2 px-4 rounded-sm hover:bg-teal-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateUsedEquipment;
