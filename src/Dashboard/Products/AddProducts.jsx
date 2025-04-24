import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Button from "../Button/Button";

const ProductAddForm = () => {
  const axiosPublicUrl = useAxiospublic();
  const [images, setImages] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const watchCategory = watch("category");

  useEffect(() => {
    if (watchCategory) {
      // Fetch subcategories based on selected category
      setSubCategories([
        { value: "camera", label: "Camera" },
        { value: "lens", label: "Lens" },
      ]);
    }
  }, [watchCategory]);

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.slice(0, 20);
    setImages((prev) => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 20,
  });

  const onSubmit = async (data) => {
    console.log({ ...data, images });

    try {
      const formData = new FormData();

      // Append images (support multiple files)
      images.forEach((file) => {
        formData.append("images", file);
      });

      // Append other fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : value
        );
      });

      const response = await axiosPublicUrl.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4ff] dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Image Upload Column */}
        <div className="col-span-1">
          <label className="block mb-2 font-medium">Upload Images</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-teal-500"
          >
            <input {...getInputProps()} />
            <p>
              Drag & drop or{" "}
              <span className="underline text-teal-500">Browse</span> images
              (max 20)
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {images.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-20 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Second Column */}
        <div className="col-span-2 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 space-y-4">
            <input
              {...register("productName", { required: true })}
              placeholder="Product Name"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />

            <select
              {...register("category", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            >
              <option value="" className="hover:bg-amber-200">
                Select Category
              </option>
              <option value="electronics">Electronics</option>
              <option value="cameras">Cameras</option>
            </select>

            <select
              {...register("subCategory", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>

            <input
              {...register("sku", { required: true })}
              placeholder="SKU / Unique Code"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <input
              {...register("videoUrls")}
              placeholder="YouTube Video URLs (comma separated)"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
          </div>

          {/* Third Column */}
          <div className="col-span-1 space-y-4">
            <Controller
              name="productOptions"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={[
                    { value: "wifi", label: "WiFi" },
                    { value: "bluetooth", label: "Bluetooth" },
                  ]}
                  placeholder="Product Options"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "rgb(255, 255, 255)", // Tailwind: dark:bg-gray-800
                      borderColor: state.isFocused
                        ? "#14b8a6"
                        : "rgb(75 85 99)", // Tailwind: focus:border-teal-500, dark:border-gray-600
                      color: "white",
                      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : "none",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "rgb(255,255,255)",
                      color: "white",
                      zIndex: 10,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#0f766e" // Tailwind: bg-teal-700
                        : state.isFocused
                        ? "#115e59" // Tailwind: hover:bg-teal-800
                        : "rgb(209, 213, 219)",
                      color: state.isFocused ? "white" : "black",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#363636", // dark teal
                      color: "white",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "white",
                      ":hover": {
                        backgroundColor: "#0f766e",
                        color: "white",
                      },
                    }),
                  }}
                />
              )}
            />

            <Controller
              name="softwareOptions"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={[
                    { value: "photoshop", label: "Photoshop" },
                    { value: "lightroom", label: "Lightroom" },
                  ]}
                  placeholder="Software Options"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "rgb(255, 255, 255)", // Tailwind: dark:bg-gray-800
                      borderColor: state.isFocused
                        ? "#14b8a6"
                        : "rgb(75 85 99)", // Tailwind: focus:border-teal-500, dark:border-gray-600
                      color: "white",
                      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : "none",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "rgb(255,255,255)",
                      color: "white",
                      zIndex: 10,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#0f766e" // Tailwind: bg-teal-700
                        : state.isFocused
                        ? "#115e59" // Tailwind: hover:bg-teal-800
                        : "rgb(209, 213, 219)",
                      color: state.isFocused ? "white" : "black",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#363636", // dark teal
                      color: "white",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "white",
                      ":hover": {
                        backgroundColor: "#0f766e",
                        color: "white",
                      },
                    }),
                  }}
                />
              )}
            />

            <input
              {...register("brandName", { required: true })}
              placeholder="Brand Name"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />

            <select
              {...register("condition", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            >
              <option value="">Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="old">Old</option>
            </select>
          </div>
          <div className="col-span-2 space-y-4">
            <label className="ml-1">Product Overview</label>
            <Controller
              name="productOverview"
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
            <label className="ml-1">Warranty Info</label>
            <Controller
              name="warrantyInfo"
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

            {/* <textarea
              {...register("warrantyInfo")}
              placeholder="Warranty Information"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            /> */}
          </div>
          <div className="col-span-1 space-y-4">
            <Button text={"Submit Product"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAddForm;

// Tailwind common input class
const inputClass = `block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 text-sm bg-white dark:bg-gray-800 dark:text-white`;
const style = document.createElement("style");
style.innerHTML = `.input { ${inputClass} }`;
document.head.appendChild(style);
