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
  const { data: { author } = [] } = useDataQuery(["authors"], "/api/authors");
  const { data: { blogTypes } = [] } = useDataQuery(
    ["blogTypes"],
    "/api/blog-types"
  );
  const { data: { blog } = {} } = useDataQuery(
    ["blogView", id],
    `/api/blogs/${id}`
  );

  console.log(blog);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([
    { file: null, show: true, order: 1, previewUrl: "" },
    { file: null, show: true, order: 2, previewUrl: "" },
    { file: null, show: true, order: 3, previewUrl: "" },
    { file: null, show: true, order: 4, previewUrl: "" },
  ]);

  const { register, handleSubmit, setValue, control, reset, formState } =
    useForm({
      defaultValues: {
        title: "",
        author: "",
        blogType: "",
        content: "",
        tags: [],
      },
    });

  useEffect(() => {
    if (blog) {
      // Parse tags
      const parsedTags =
        typeof blog.tags === "string"
          ? JSON.parse(blog.tags)
          : Array.isArray(blog.tags)
          ? blog.tags
          : [];

      setSelectedTags(parsedTags);

      // Reset form with blog data
      reset({
        title: blog.title || "",
        author: blog.author || "",
        blogType: blog.blog_type || "",
        content: blog.content || "",
        tags: parsedTags,
      });

      // Parse and set images
      if (blog?.images) {
        const parsedImages =
          typeof blog.images === "string"
            ? JSON.parse(blog.images)
            : blog.images;

        setImages(
          parsedImages.map((img, idx) => ({
            file: null,
            show: img.show,
            order: img.order,
            previewUrl: img.filePath || img.url,
          }))
        );
      }
    }
  }, [blog, reset]);

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
    newImages[index] = {
      ...newImages[index],
      file: acceptedFiles[0],
      previewUrl: URL.createObjectURL(acceptedFiles[0]),
    };
    setImages(newImages);
  };

  const handleImageToggle = (index) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      show: !newImages[index].show,
    };
    setImages(newImages);
  };

  const handleOrderChange = (index, order) => {
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      order: Number(order),
    };
    setImages(newImages);
  };

  const onSubmit = async (data) => {
    console.log(data);

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append(
        "title",
        formState.dirtyFields.title ? data.title : blog.title
      );
      formData.append(
        "author",
        formState.dirtyFields.author ? data.author : blog.author
      );
      formData.append(
        "blogType",
        formState.dirtyFields.blogType ? data.blogType : blog.blogType
      );
      formData.append(
        "content",
        formState.dirtyFields.content ? data.content : blog.content
      );
      formData.append("tags", JSON.stringify(selectedTags));

      images.forEach((img, idx) => {
        if (img.file) {
          formData.append(`images[${idx}][file]`, img.file);
        } else if (img.previewUrl) {
          formData.append(`images[${idx}][existingUrl]`, img.previewUrl);
        }
        formData.append(
          `images[${idx}][show]`,
          img.show ? img.show.toString() : "false"
        );
        formData.append(
          `images[${idx}][order]`,
          img.order ? img.order.toString() : "1"
        );
      });

      await axiosPublicUrl.patch(`/api/updatedblogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success", "Blog post updated!", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update blog post", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            {...register("title")}
            className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded"
            placeholder="Enter blog title"
          />
        </div>

        {/* Author and Blog Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Author</label>
            <select
              {...register("author")}
              className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded"
            >
              <option value="">Select author</option>
              {author?.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Blog Type</label>
            <select
              {...register("blogType")}
              className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded"
            >
              <option value="">Select type</option>
              {blogTypes?.map((type) => (
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
            defaultValue=""
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                // {...field}
                value={field.value}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: "link image code lists",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
                }}
                onEditorChange={(content) => field.onChange(content)}
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
                className={`px-3 py-1 rounded text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-teal-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
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
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
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
                    alt={`Preview ${idx + 1}`}
                    className="mt-2 h-24 object-cover rounded"
                  />
                )}

                <div className="mt-3 space-y-2">
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
