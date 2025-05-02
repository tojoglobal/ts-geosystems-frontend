import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Button from "../../Dashboard/Button/Button";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const AdminUpdateServicePage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const onDrop1 = useCallback((acceptedFiles) => {
    setImage1(acceptedFiles[0]);
  }, []);

  const onDrop2 = useCallback((acceptedFiles) => {
    setImage2(acceptedFiles[0]);
  }, []);

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } =
    useDropzone({
      onDrop: onDrop1,
      accept: { "image/*": [] },
      maxFiles: 1,
      multiple: false,
    });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      onDrop: onDrop2,
      accept: { "image/*": [] },
      maxFiles: 1,
      multiple: false,
    });

  const onSubmit = (data) => {
    const formData = {
      title: data.title,
      description: data.description,
      image1: image1 ? image1.name : null,
      image2: image2 ? image2.name : null,
    };

    console.log("✅ Ready JSON for backend:", formData);
    console.log("📁 image1 file object:", image1);
    console.log("📁 image2 file object:", image2);
    // You can now use image1/image2 along with formData in a FormData payload
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Update Service Page</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Title Section */}
        <div className="space-y-3">
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
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
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
        {/* Image 1 Upload */}
        <div className="space-y-3">
          <label className="block font-medium">Upload Image 1</label>
          <div
            {...getRootProps1()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-teal-500"
          >
            <input {...getInputProps1()} />
            <p>
              Drag & drop or{" "}
              <span className="underline text-teal-500">Browse</span> 1 image
            </p>
          </div>
          {image1 && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image1)}
                alt="Image 1 Preview"
                className="h-20 w-full object-cover rounded"
              />
            </div>
          )}
        </div>
        {/* Image 2 Upload */}
        <div className="space-y-3">
          <label className="block font-medium">Upload Image 2</label>
          <div
            {...getRootProps2()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-teal-500"
          >
            <input {...getInputProps2()} />
            <p>
              Drag & drop or{" "}
              <span className="underline text-teal-500">Browse</span> 1 image
            </p>
          </div>
          {image2 && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image2)}
                alt="Image 2 Preview"
                className="h-20 w-full object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-start">
          <Button text={"Save Changes"} />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateServicePage;
