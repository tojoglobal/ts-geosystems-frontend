import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { AiOutlinePlus } from "react-icons/ai";
import Button from "../../Dashboard/Button/Button";

const AdminAboutUs = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      section1: { title: "", description: "" },
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
    // Send formData to the backend
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
      <h1 className="text-2xl font-semibold mb-4">Admin About Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1 */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Section 1 (Snapshot)</h2>
          <input
            type="text"
            placeholder="Title"
            {...register("section1.title")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 mb-4 text-white"
          />
          <textarea
            placeholder="Description"
            {...register("section1.description")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
            rows={4}
          />
        </div>

        {/* Section 2 */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Section 2 (What We Do)</h2>
          {section2Fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder={`Key ${index + 1}`}
                {...register(`section2.${index}`)}
                className="flex-1 border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
              />
              <button
                type="button"
                onClick={() => append("")}
                className="bg-teal-500 text-white px-2 py-1 rounded-md hover:bg-teal-600"
              >
                <AiOutlinePlus size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Section 3 */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Section 3 (Who We Serve)
          </h2>
          <input
            type="text"
            placeholder="Title"
            {...register("section3.title")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 mb-4 text-white"
          />
          <textarea
            placeholder="Description"
            {...register("section3.description")}
            className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
            rows={4}
          />
        </div>

        {/* Sections 4 to 9 */}
        <div className="grid grid-cols-2 gap-4">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Section {index + 4}
                </h2>
                <input
                  type="text"
                  placeholder="Title"
                  {...register(`section4to9.${index}.title`)}
                  className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 mb-4 text-white"
                />
                <textarea
                  placeholder="Description"
                  {...register(`section4to9.${index}.description`)}
                  className="w-full border border-gray-700 bg-gray-700 rounded-md p-2 text-white"
                  rows={4}
                />
              </div>
            ))}
        </div>

        {/* Image Input */}
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <div
            {...useDropzone({
              onDrop: (files) => handleImageDrop(files, setTitleImage),
              maxFiles: 1,
            }).getRootProps()}
            className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center cursor-pointer hover:border-teal-500 mb-4"
          >
            <input {...useDropzone({}).getInputProps()} />
            <p>
              Drag & drop or{" "}
              <span className="underline text-teal-500">Browse</span> title
              image (max 1)
            </p>
          </div>
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

        <div className="col-span-1 space-y-4">
          <Button text={"Submit About Us"} />
        </div>
      </form>
    </div>
  );
};

export default AdminAboutUs;
