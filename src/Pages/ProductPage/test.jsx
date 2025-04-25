import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import Dropzone from "react-dropzone";

const ProductAddForm = () => {
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
    setImages([...images, ...acceptedFiles.slice(0, 20)]);
  };

  const onSubmit = (data) => {
    console.log({ ...data, images });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Image Upload Column */}
      <div className="col-span-1">
        <label className="block mb-2 font-medium">Upload Images</label>
        <Dropzone onDrop={onDrop} multiple maxFiles={20}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-teal-500"
            >
              <input {...getInputProps()} />
              <p>Drag & drop or click to select images</p>
            </div>
          )}
        </Dropzone>
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
      <div className="col-span-1 space-y-4">
        <input
          {...register("productName", { required: true })}
          placeholder="Product Name"
          className="input"
        />

        <select {...register("category", { required: true })} className="input">
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="cameras">Cameras</option>
        </select>

        <select
          {...register("subCategory", { required: true })}
          className="input"
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
          className="input"
        />

        <select
          {...register("condition", { required: true })}
          className="input"
        >
          <option value="">Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="old">Old</option>
        </select>
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
              className="text-black"
              placeholder="Product Options"
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
              className="text-black"
              placeholder="Software Options"
            />
          )}
        />

        <input
          {...register("brandName", { required: true })}
          placeholder="Brand Name"
          className="input"
        />

        <label>Product Overview</label>
        <Controller
          name="productOverview"
          control={control}
          render={({ field }) => (
            <Editor
              apiKey="your-tinymce-api-key"
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

        <input
          {...register("videoUrls")}
          placeholder="YouTube Video URLs (comma separated)"
          className="input"
        />

        <textarea
          {...register("warrantyInfo")}
          placeholder="Warranty Information"
          className="input"
        />

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
        >
          Submit Product
        </button>
      </div>
    </form>
  );
};

export default ProductAddForm;

// Tailwind common input class
const inputClass = `block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 text-sm bg-white dark:bg-gray-800 dark:text-white`;
const style = document.createElement("style");
style.innerHTML = `.input { ${inputClass} }`;
document.head.appendChild(style);
