import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../../Dashboard/Button/Button";

const AdminUpdateAboutUs = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      section1: { title: "", description: "" },
      section2Title: "",
      section2: [""],
      section3: { title: "", description: "" },
      section4to9: Array(6).fill({ title: "", description: "" }),
      sliderImages: [],
      titleImage: null,
    },
  });

  const {
    fields: section2Fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "section2",
  });

  const [sliderImages, setSliderImages] = useState([]);
  const [titleImage, setTitleImage] = useState(null);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      sliderImages,
      titleImage,
    };
    console.log("Form Data:", formData);
  };

  const handleImageDrop = (acceptedFiles, setImageState) => {
    if (acceptedFiles.length > 0) {
      setImageState(acceptedFiles[0]);
    }
  };

  const handleSliderDrop = (acceptedFiles) => {
    setSliderImages((prev) => [...prev, ...acceptedFiles]);
  };

  const removeSliderImage = (index) => {
    setSliderImages(sliderImages.filter((_, i) => i !== index));
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Admin - Update About Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section 1 */}
        <div className="bg-gray-800 p-3 rounded shadow">
          <h2 className="text-md font-medium mb-2 text-gray-300">
            Section 1 (ex.Snapshot)
          </h2>
          <div className="space-y-2">
            <input
              type="text"
              {...register("section1.title")}
              placeholder="Section Title"
              className="w-full border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white"
            />
            <textarea
              {...register("section1.description")}
              placeholder="Section Description"
              className="w-full border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white"
              rows={3}
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-gray-800 p-3 rounded shadow">
          <h2 className="text-md font-medium mb-2 text-gray-300">
            Section 2 (ex.What We Do)
          </h2>
          <div className="space-y-2">
            <input
              type="text"
              {...register("section2Title")}
              placeholder="Section Title"
              className="w-full border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white mb-2"
            />
            <div className="space-y-1">
              {section2Fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    {...register(`section2.${index}.value`)}
                    placeholder={`Point ${index + 1}`}
                    className="flex-1 border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-500 p-1"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 mt-1"
            >
              <FiPlus size={14} /> Add Point
            </button>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-gray-800 p-3 rounded shadow">
          <h2 className="text-md font-medium mb-2 text-gray-300">
            Section 3 (ex.Who We Serve)
          </h2>
          <div className="space-y-2">
            <input
              type="text"
              {...register("section3.title")}
              placeholder="Section Title"
              className="w-full border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white"
            />
            <textarea
              {...register("section3.description")}
              placeholder="Section Description"
              className="w-full border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white"
              rows={3}
            />
          </div>
        </div>

        {/* Slider Images */}
        <div className="bg-gray-800 p-3 rounded shadow">
          <h2 className="text-md font-medium mb-2 text-gray-300">
            First Images
          </h2>
          <div
            {...useDropzone({
              onDrop: handleSliderDrop,
              multiple: true,
            }).getRootProps()}
            className="border-2 border-dashed border-gray-700 rounded p-3 text-center cursor-pointer hover:border-teal-500"
          >
            <input {...useDropzone({}).getInputProps()} />
            <p className="text-sm text-gray-400">
              Drag & drop or <span className="text-teal-400">browse</span>{" "}
              slider images
            </p>
          </div>
          {sliderImages.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {sliderImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="h-20 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeSliderImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sections 4 to 9 */}
        <div className="bg-gray-800 p-3 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-400">
                    Section {index + 4}
                  </h3>
                  <input
                    type="text"
                    {...register(`section4to9.${index}.title`)}
                    placeholder="Title"
                    className="w-full border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white"
                  />
                  <textarea
                    {...register(`section4to9.${index}.description`)}
                    placeholder="Description"
                    className="w-full border border-gray-700 bg-gray-700 rounded p-2 text-sm text-white"
                    rows={2}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Title Image Input */}
        <div className="bg-gray-800 p-3 rounded shadow">
          <h2 className="text-md font-medium mb-2 text-gray-300">
            Second Image
          </h2>
          <div
            {...useDropzone({
              onDrop: (files) => handleImageDrop(files, setTitleImage),
              maxFiles: 1,
            }).getRootProps()}
            className="border-2 border-dashed border-gray-700 rounded p-3 text-center cursor-pointer hover:border-teal-500"
          >
            <input {...useDropzone({}).getInputProps()} />
            <p className="text-sm text-gray-400">
              Drag & drop or <span className="text-teal-400">browse</span>{" "}
              featured image
            </p>
          </div>
          {titleImage && (
            <div className="mt-2 flex justify-center">
              <div className="relative group">
                <img
                  src={URL.createObjectURL(titleImage)}
                  alt="preview"
                  className="h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setTitleImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button text={"Save Changes"} className="px-6 py-2" />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateAboutUs;
