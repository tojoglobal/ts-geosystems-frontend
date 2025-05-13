import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useDataQuery from "../../utils/useDataQuery";
import { useParams } from "react-router-dom";

const availableTags = [
  "#GeoBusiness",
  "#GeospatialTech",
  "#SeeYouThere",
  "#ExCeLLondon",
  "#MappingTheFuture",
];

const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const axiosPublicUrl = useAxiospublic();

  const { data: authors = [] } = useDataQuery(["authors"], "/api/authors");
  const { data: blogTypes = [] } = useDataQuery(
    ["blogTypes"],
    "/api/blog-types"
  );

  const { data } = useDataQuery(["blogView", id], `/api/blogs/${id}`, !!id);
  const existingBlog = data?.blog;
  // console.log(existingBlog);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([
    { file: null, show: true, order: 1 },
    { file: null, show: true, order: 2 },
    { file: null, show: true, order: 3 },
    { file: null, show: true, order: 4 },
  ]);

  const { register, handleSubmit, setValue, control, reset } = useForm({
    defaultValues: {
      title: "",
      author: "",
      blogType: "",
      content: "",
      tags: [],
    },
  });

  console.log(selectedTags);

  useEffect(() => {
    if (existingBlog) {
      setValue("title", existingBlog.title);
      setValue("author", existingBlog.author);
      setValue("blogType", existingBlog.blogType);
      setValue("content", existingBlog.content);
      //   setSelectedTags(existingBlog.tags || []);
      //   setValue("tags", existingBlog.tags || []);
      const parsedTags =
        typeof existingBlog.tags === "string"
          ? JSON.parse(existingBlog.tags)
          : Array.isArray(existingBlog.tags)
          ? existingBlog.tags
          : [];

      setSelectedTags(parsedTags);
      setValue("tags", parsedTags);

      if (existingBlog.images) {
        const updatedImages = images.map((img, idx) => {
          const existing = existingBlog.images[idx];
          return existing
            ? {
                file: null,
                show: existing.show,
                order: existing.order,
                previewUrl: existing.url,
              }
            : img;
        });
        setImages(updatedImages);
      }
    }
  }, [existingBlog]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setValue("tags", newTags);
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  const handleImageDrop = (index) => (acceptedFiles) => {
    const newImages = [...images];
    newImages[index].file = acceptedFiles[0];
    newImages[index].previewUrl = URL.createObjectURL(acceptedFiles[0]);
    setImages(newImages);
  };

  const handleImageToggle = (index) => {
    const newImages = [...images];
    newImages[index].show = !newImages[index].show;
    setImages(newImages);
  };

  const handleOrderChange = (index, order) => {
    const newImages = [...images];
    newImages[index].order = order;
    setImages(newImages);
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("blogType", data.blogType);
      formData.append("content", data.content);
      formData.append("tags", JSON.stringify(selectedTags));

      images.forEach((img, idx) => {
        if (img.file) {
          formData.append(`images[${idx}][file]`, img.file);
        }
        formData.append(`images[${idx}][show]`, img.show);
        formData.append(`images[${idx}][order]`, img.order);
      });

      if (isEdit) {
        await axiosPublicUrl.put(`/api/blogs/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Updated!", "Blog post updated successfully.", "success");
      } else {
        await axiosPublicUrl.post("/api/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Created!", "Blog post created successfully.", "success");
        reset();
        setSelectedTags([]);
        setImages(
          images.map((img) => ({ ...img, file: null, previewUrl: null }))
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">
        {isEdit ? "Update Blog Post" : "Create Blog Post"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="mb-5">
          <label className="block mb-1">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded"
            placeholder="Enter blog title"
          />
        </div>
        {/* Author and Blog Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="mb-5">
            <label className="block mb-1">Author</label>
            <select
              {...register("author", { required: true })}
              className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded"
            >
              <option value="">Select author</option>
              {authors?.author?.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Blog Type</label>
            <select
              {...register("blogType", { required: true })}
              className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded"
            >
              <option value="">Select type</option>
              {blogTypes?.blogTypes?.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Content */}
        <div className="mb-5">
          <label className="block mb-1">Content</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                {...field}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: "link image code lists",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
                }}
              />
            )}
          />
        </div>

        {/* Tags */}
        <div className="mb-5">
          <label className="block mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className="px-3 py-1 bg-gray-700 rounded text-white text-sm"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-teal-600 px-3 py-1 rounded-full text-sm"
              >
                {tag}{" "}
                <button type="button" onClick={() => removeTag(tag)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image Uploads */}
        <div className="grid md:grid-cols-2 gap-4">
          {images.map((img, idx) => {
            const { getRootProps, getInputProps } = useDropzone({
              onDrop: handleImageDrop(idx),
              accept: { "image/*": [] },
              maxFiles: 1,
            });

            return (
              <div key={idx} className="border p-4 bg-gray-900 rounded">
                <label className="block text-white mb-2">Image {idx + 1}</label>
                <div
                  {...getRootProps()}
                  className="cursor-pointer bg-gray-800 text-white text-center py-4 rounded"
                >
                  <input {...getInputProps()} />
                  <p>Drag & drop or click to select image</p>
                </div>

                {img.previewUrl && (
                  <img
                    src={img.previewUrl}
                    alt="Preview"
                    className="mt-2 h-24 object-cover rounded"
                  />
                )}

                <div className="mt-3 text-white space-y-2">
                  <div>
                    <label className="block text-sm">Display:</label>
                    <input
                      type="checkbox"
                      checked={img.show}
                      onChange={() => handleImageToggle(idx)}
                      className="mr-2"
                    />
                    {img.show ? "Visible" : "Hidden"}
                  </div>

                  <div>
                    <label className="block text-sm">Order (1 to 4):</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={img.order}
                      onChange={(e) =>
                        handleOrderChange(idx, Number(e.target.value))
                      }
                      className="w-full p-1 bg-gray-700 border border-gray-600 rounded"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-5">
          <Button
            disabled={isUploading}
            text={
              isUploading
                ? "Uploading..."
                : isEdit
                ? "Update Blog Post"
                : "Create Blog Post"
            }
          />
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
