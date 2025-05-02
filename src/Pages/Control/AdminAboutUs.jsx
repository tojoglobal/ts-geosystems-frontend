import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FiPlus } from "react-icons/fi";
import Button from "../../Dashboard/Button/Button";

const AdminAboutUs = () => {
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

  const { fields: section2Fields, append } = useFieldArray({
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

  return (
    <div className="py-2">
      <h1 className="text-xl font-semibold mb-2">Admin About Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section 1 */}
        <div className="bg-gray-800 p-3 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Section 1 (ex.Snapshot)
          </h2>
          <label className="text-white">Title</label>
          <input
            type="text"
            {...register("section1.title")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 mb-4 text-white"
          />
          <label className="text-white">Description</label>
          <textarea
            {...register("section1.description")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
            rows={4}
          />
        </div>
        {/* Section 2 */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Section 2 (ex.What We Do)
          </h2>
          <label className="text-white">Title</label>
          <input
            type="text"
            {...register("section2Title")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 mb-4 text-white"
          />
          <label className="text-white">Points</label>
          <div className="space-y-2 mb-2">
            {section2Fields.map((field, index) => (
              <input
                key={field.id}
                type="text"
                {...register(`section2.${index}.value`)}
                className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
                placeholder={`Point ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="flex items-center gap-1 text-teal-500 hover:text-teal-600"
          >
            <FiPlus className="text-xl" /> Add Point
          </button>
        </div>

        {/* Section 3 */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Section 3 (ex.Who We Serve)
          </h2>
          <label className="text-white">Title</label>
          <input
            type="text"
            {...register("section3.title")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 mb-4 text-white"
          />
          <label className="text-white">Description</label>
          <textarea
            {...register("section3.description")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
            rows={4}
          />
        </div>

        {/* Slider Images */}
        <div
          {...useDropzone({
            onDrop: handleSliderDrop,
            multiple: true,
          }).getRootProps()}
          className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center cursor-pointer hover:border-teal-500"
        >
          <input {...useDropzone({}).getInputProps()} />
          <p>
            Drag & drop or{" "}
            <span className="underline text-teal-500">Browse</span> slider
            images
          </p>
        </div>
        {/* Sections 4 to 9 */}
        <div className="grid grid-cols-2 gap-2">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">
                  Section {index + 4}
                </h2>
                <label className="text-white">Title</label>
                <input
                  type="text"
                  {...register(`section4to9.${index}.title`)}
                  className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 mb-2 text-white"
                />
                <label className="text-white">Description</label>
                <textarea
                  {...register(`section4to9.${index}.description`)}
                  className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
                  rows={3}
                />
              </div>
            ))}
        </div>

        {/* Title Image Input */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Upload After Slider Image
          </h2>
          <div
            {...useDropzone({
              onDrop: (files) => handleImageDrop(files, setTitleImage),
              maxFiles: 1,
            }).getRootProps()}
            className="border-2 border-dashed border-gray-700 rounded-md p-4 text-center cursor-pointer hover:border-teal-500 mb-4"
          >
            <input {...useDropzone({}).getInputProps()} />
            <p>
              Drag & drop or{" "}
              <span className="underline text-teal-500">Browse</span> title
              image (max 1)
            </p>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <Button text={"Submit About Us"} />
        </div>
      </form>
    </div>
  );
};

export default AdminAboutUs;