import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Button from "../../Dashboard/Button/Button";

const AdminUpdateHire = () => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: "", // Default title
      description: "", // Default description
    },
  });

  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    // Handle form submission logic (e.g., send data to API)
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Update Hire Page</h1>
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
                apiKey={import.meta.env.VITE_TINY_APIKEY} // Use your TinyMCE API key
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

        {/* Submit Button */}
        <div className="flex justify-start">
          <Button text={"Save Changes"} />
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateHire;
