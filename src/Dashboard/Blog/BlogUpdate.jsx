/* eslint-disable react-hooks/exhaustive-deps */
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

const BlogUpdate = () => {
  const { id } = useParams();
  const axiosPublicUrl = useAxiospublic();

  const { data: authors = [] } = useDataQuery(["authors"], "/api/authors");
  const { data: blogTypes = [] } = useDataQuery(
    ["blogTypes"],
    "/api/blog-types"
  );
  const { data: { blog } = {} } = useDataQuery(
    ["blogView", id],
    `/api/blogs/${id}`
  );

  const [isUploading, setIsUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([
    { file: null, show: true, order: 1, previewUrl: "" },
    { file: null, show: true, order: 2, previewUrl: "" },
    { file: null, show: true, order: 3, previewUrl: "" },
    { file: null, show: true, order: 4, previewUrl: "" },
  ]);
  const [originalImages, setOriginalImages] = useState([]);

  const { register, handleSubmit, setValue, control, reset } = useForm({
    defaultValues: {
      title: "",
      author: "",
      blogType: "",
      content: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (blog?.id) {
      const parsedTags = Array.isArray(blog.tags)
        ? blog.tags
        : typeof blog.tags === "string"
        ? JSON.parse(blog.tags)
        : [];

      setSelectedTags(parsedTags);

      reset({
        title: blog.title || "",
        author: blog.author || "",
        blogType: blog.blog_type || "",
        content: blog.content || "",
        tags: parsedTags,
      });

      const parsedImages =
        typeof blog.images === "string" ? JSON.parse(blog.images) : blog.images;

      if (parsedImages) {
        const newImages = parsedImages.map((img) => ({
          file: null,
          show: img?.show,
          order: img?.order,
          previewUrl: img?.filePath || img?.url || "",
        }));
        setImages([...newImages, ...images.slice(newImages.length)]);
        setOriginalImages(newImages);
      }
    }
  }, [blog, reset]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      setValue("tags", updatedTags);
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setValue("tags", updatedTags);
  };

  const handleImageDrop = (index) => (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      file,
      previewUrl: URL.createObjectURL(file),
    };
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
        const original = originalImages[idx];
        const hasFile = !!img.file;

        // Normalize 'show' values to booleans
        const normalizeBool = (val) => val === true || val === "true";
        const currentShow = normalizeBool(img.show);
        const originalShow = normalizeBool(original?.show);
        const hasVisibilityChanged = currentShow == originalShow;

        const currentOrder = parseInt(img.order) || 0;
        const originalOrder = parseInt(original?.order) || 0;
        const hasOrderChanged = currentOrder == originalOrder;

        const hasChanges = hasFile || hasVisibilityChanged || hasOrderChanged;

        if (hasChanges) {
          if (hasFile) {
            formData.append(`images[${idx}][file]`, img.file); // NEW file
          } else {
            // Send current image reference
            formData.append(`images[${idx}][previewUrl]`, img.previewUrl);
          }

          formData.append(
            `images[${idx}][show]`,
            currentShow ? "true" : "false"
          );
          formData.append(`images[${idx}][order]`, currentOrder);
        }
      });

      await axiosPublicUrl.put(`/api/updatedblogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Blog post updated successfully!", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update blog post", "error");
    } finally {
      setIsUploading(false);
    }
  };

  console.log(images);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded"
          />
        </div>

        {/* Author and Blog Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
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
        <div>
          <label className="block mb-1">Content</label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                value={field.value}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: "link image code lists",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
                }}
                onEditorChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className="px-3 py-1 cursor-pointer bg-gray-700 rounded text-white text-sm"
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
                  x
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
        <div>
          <Button
            disabled={isUploading}
            text={isUploading ? "Updating..." : "Update Blog Post"}
          />
        </div>
      </form>
    </div>
  );
};

export default BlogUpdate;
