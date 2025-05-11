import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

// Fake author data (will be replaced with real data from database later)
const fakeAuthors = [
  { id: 1, name: "G2 Survey Events" },
  { id: 2, name: "John Doe" },
  { id: 3, name: "Jane Smith" },
  { id: 4, name: "Tech Team" },
];

const BlogCreate = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags] = useState([
    "#GeoBusiness",
    "#GeospatialTech",
    "#SeeYouThere",
    "#ExCeLLondon",
    "#MappingTheFuture",
  ]);

  const blogTypes = ["Features", "Tips", "Announcements", "Events"];

  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
      author: "",
      blogType: "",
      readTime: "1 minute read",
      tags: [],
    },
  });

  const onDropFeaturedImage = useCallback((acceptedFiles) => {
    setFeaturedImage(acceptedFiles[0]);
  }, []);

  const onDropAudio = useCallback((acceptedFiles) => {
    setAudioFile(acceptedFiles[0]);
  }, []);

  const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } =
    useDropzone({
      onDrop: onDropFeaturedImage,
      accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
      maxFiles: 1,
    });

  const { getRootProps: getRootPropsAudio, getInputProps: getInputPropsAudio } =
    useDropzone({
      onDrop: onDropAudio,
      accept: { "audio/*": [".mp3", ".wav", ".ogg"] },
      maxFiles: 1,
    });

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setValue("tags", [...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setValue("tags", updatedTags);
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      // In a real implementation, you would upload to your backend here
      console.log("Form data:", data);
      console.log("Featured image:", featuredImage);
      console.log("Audio file:", audioFile);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog post created successfully",
      });

      // Reset form
      reset();
      setFeaturedImage(null);
      setAudioFile(null);
      setSelectedTags([]);
    } catch (error) {
      console.error("Error creating blog post:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create blog post",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-2">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Admin - Create Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-7">
        {/* Title Section */}
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium text-sm md:text-base">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm md:text-base focus:outline-none focus:ring focus:ring-[#e62245] text-white"
            placeholder="Enter blog title"
          />
        </div>
        {/* Author and Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          {/* Author Selection */}
          <div className="space-y-2">
            <label htmlFor="author" className="block font-medium text-sm md:text-base">
              Author
            </label>
            <select
              id="author"
              {...register("author", { required: "Author is required" })}
              className="w-full appearance-none bg-gray-800 border border-gray-700 rounded p-2 text-sm md:text-base focus:outline-none text-white"
            >
              <option value="" className="bg-gray-800">Select Author</option>
              {fakeAuthors.map((author) => (
                <option key={author.id} value={author.name} className="bg-gray-800">
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          {/* Blog Type Selection */}
          <div className="space-y-2">
            <label htmlFor="blogType" className="block font-medium text-sm md:text-base">
              Blog Type
            </label>
            <select
              id="blogType"
              {...register("blogType", { required: "Blog type is required" })}
              className="w-full appearance-none bg-gray-800 border border-gray-700 rounded p-2 text-sm md:text-base focus:outline-none focus:ring text-white"
            >
              <option value="" className="bg-gray-800">Select Type</option>
              {blogTypes.map((type) => (
                <option key={type} value={type} className="bg-gray-800">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Read Time */}
        <div className="space-y-2">
          <label htmlFor="readTime" className="block font-medium text-sm md:text-base">
            Read Time
          </label>
          <input
            type="text"
            id="readTime"
            {...register("readTime")}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm md:text-base focus:outline-none focus:ring focus:ring-[#e62245] text-white"
            placeholder="e.g. 1 minute read"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Featured Image Upload */}
          <div className="w-full md:w-1/2 space-y-2">
            <label className="block font-medium text-sm md:text-base">Featured Image</label>
            <div
              {...getRootPropsImage()}
              className={`border-2 border-dashed rounded-md p-4 md:p-6 text-center cursor-pointer text-sm md:text-base ${
                isUploading
                  ? "border-gray-700"
                  : "border-gray-600 hover:border-teal-500"
              }`}
            >
              <input {...getInputPropsImage()} />
              {isUploading ? (
                <p>Uploading image...</p>
              ) : (
                <p>
                  Drag & drop or{" "}
                  <span className="underline text-teal-500">browse</span> to upload
                  featured image
                </p>
              )}
            </div>
            {featuredImage && (
              <div className="mt-4">
                <p className="text-xs md:text-sm text-gray-400 mb-2">Selected Image:</p>
                <img
                  src={URL.createObjectURL(featuredImage)}
                  alt="Featured preview"
                  className="h-20 md:h-24 w-36 md:w-44 object-cover rounded"
                />
              </div>
            )}
          </div>
          {/* Audio Upload and Preview */}
          <div className="w-full md:w-1/2 space-y-2">
            <label className="block font-medium text-sm md:text-base">Audio File (Optional)</label>
            <div
              {...getRootPropsAudio()}
              className={`border-2 border-dashed rounded-md p-4 md:p-6 text-center cursor-pointer text-sm md:text-base ${
                isUploading
                  ? "border-gray-700"
                  : "border-gray-600 hover:border-teal-500"
              }`}
            >
              <input {...getInputPropsAudio()} />
              {isUploading ? (
                <p>Uploading audio...</p>
              ) : (
                <p>
                  Drag & drop or{" "}
                  <span className="underline text-teal-500">browse</span> to upload
                  audio file
                </p>
              )}
            </div>
            {audioFile && (
              <div className="mt-4">
                <p className="text-xs md:text-sm text-gray-400 mb-2">Audio Preview:</p>
                <AudioPlayer
                  src={URL.createObjectURL(audioFile)}
                  autoPlay={false}
                  controls
                  className="shadow-xl bg-gray-800 text-sm md:text-base"
                />
              </div>
            )}
          </div>
        </div>
        {/* Content Section */}
        <div className="space-y-3 md:space-y-4">
          <label htmlFor="content" className="block font-medium text-sm md:text-base">
            Content
          </label>
          <div className="bg-white rounded">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINY_APIKEY}
                  value={field.value}
                  init={{
                    height: 300,
                    menubar: true,
                    skin: "oxide-dark",
                    content_css: "dark",
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                />
              )}
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-2 md:space-y-3">
          <label className="block font-medium text-sm md:text-base">Tags</label>
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className={`px-2 md:px-3 py-0.5 md:py-1 rounded text-xs md:text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-[#e62245] text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div>
              <p className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Selected Tags:</p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-gray-700 px-2 py-0.5 md:py-1 rounded text-xs md:text-sm text-white"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-start">
          <Button
            text={isUploading ? "Publishing..." : "Publish Blog Post"}
            disabled={isUploading}
            className="text-sm md:text-base"
          />
        </div>
      </form>
    </div>
  );
};

export default BlogCreate;
