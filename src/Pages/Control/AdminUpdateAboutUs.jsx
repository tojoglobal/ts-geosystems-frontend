import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import Loader from "../../utils/Loader";

const AdminUpdateAboutUs = () => {
  const axiosPublicUrl = useAxiospublic();
  const queryClient = useQueryClient();
  const [whoWeServeImage, setWhoWeServeImage] = useState(null);
  const [bottomSectionImage, setBottomSectionImage] = useState(null);

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["aboutContent"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/about-us");
      return response.data.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosPublicUrl.put("/api/about-us", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["aboutContent"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "About Us content updated successfully",
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update content",
      });
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  console.log(errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "section2_points",
  });

  useEffect(() => {
    if (aboutContent) {
      reset({
        section1_title: aboutContent.section1_title || "",
        section1_description: aboutContent.section1_description || "",
        section2_title: aboutContent.section2_title || "",
        section2_points: aboutContent.section2_points || [],
        section3_title: aboutContent.section3_title || "",
        section3_description: aboutContent.section3_description || "",
        section4_title: aboutContent.section4_title || "",
        section4_description: aboutContent.section4_description || "",
        section5_title: aboutContent.section5_title || "",
        section5_description: aboutContent.section5_description || "",
        section6_title: aboutContent.section6_title || "",
        section6_description: aboutContent.section6_description || "",
        section7_title: aboutContent.section7_title || "",
        section7_description: aboutContent.section7_description || "",
        section8_title: aboutContent.section8_title || "",
        section8_description: aboutContent.section8_description || "",
        section9_title: aboutContent.section9_title || "",
        section9_description: aboutContent.section9_description || "",
      });
    }
  }, [aboutContent, reset]);

  const onDrop = (acceptedFiles, setImage) => {
    if (acceptedFiles?.length) {
      setImage(acceptedFiles[0]);
    }
  };

  const {
    getRootProps: getWhoWeServeProps,
    getInputProps: getWhoWeServeInputProps,
  } = useDropzone({
    onDrop: (files) => onDrop(files, setWhoWeServeImage),
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const {
    getRootProps: getBottomSectionProps,
    getInputProps: getBottomSectionInputProps,
  } = useDropzone({
    onDrop: (files) => onDrop(files, setBottomSectionImage),
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  // Function to strip HTML tags and send plain text
  const stripHtml = (html) => {
    if (!html) return ""; // Handle null or undefined cases
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all HTML tags
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === "section2_points") {
        formData.append(key, JSON.stringify(value));
      } else if (key.includes("_description")) {
        // Sanitize description fields to remove HTML tags
        formData.append(key, stripHtml(value));
      } else {
        formData.append(key, value);
      }
    });

    // Append images if they exist
    if (whoWeServeImage) {
      formData.append("who_we_serve_image", whoWeServeImage);
    }
    if (bottomSectionImage) {
      formData.append("bottom_section_image", bottomSectionImage);
    }

    updateMutation.mutate(formData);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Update About Us Page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sectionNum) => (
          <div key={sectionNum} className="p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Section {sectionNum}</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  {...register(`section${sectionNum}_title`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {sectionNum === 2 ? (
                <div>
                  <label className="block mb-2">Points</label>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <input
                          {...register(`section2_points.${index}`)}
                          className="flex-1 p-2 border rounded"
                          placeholder="Enter point"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => append("")}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Point
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block mb-2">Description</label>
                  <Controller
                    name={`section${sectionNum}_description`}
                    control={control}
                    render={({ field }) => (
                      <Editor
                        apiKey={import.meta.env.VITE_TINY_APIKEY}
                        value={field.value}
                        onEditorChange={(content) => field.onChange(content)}
                        init={{
                          height: 200,
                          menubar: false,
                          plugins: ["link", "lists", "image"],
                          toolbar:
                            "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist",
                        }}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Image Upload Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Who We Serve Image</h2>
            <div
              {...getWhoWeServeProps()}
              className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer"
            >
              <input {...getWhoWeServeInputProps()} />
              <p>Drag & drop or click to select image</p>
            </div>
            {whoWeServeImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(whoWeServeImage)}
                  alt="Who we serve preview"
                  className="max-h-40 mx-auto"
                />
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Bottom Section Image</h2>
            <div
              {...getBottomSectionProps()}
              className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer"
            >
              <input {...getBottomSectionInputProps()} />
              <p>Drag & drop or click to select image</p>
            </div>
            {bottomSectionImage && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(bottomSectionImage)}
                  alt="Bottom section preview"
                  className="max-h-40 mx-auto"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Update About Us</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateAboutUs;
