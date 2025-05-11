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
  console.log(id);

  const axiosPublicUrl = useAxiospublic();
  const { data: authors = [] } = useDataQuery(["authors"], "/api/authors");
  const { data: blogTypes = [] } = useDataQuery(
    ["blogTypes"],
    "/api/blog-types"
  );

  const { data: blog = [] } = useDataQuery(["blogView"], `/api/blogs/${id}`);
  console.log(blog);

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

  useEffect(() => {
    if (existingBlog) {
      setValue("title", existingBlog.title);
      setValue("author", existingBlog.author);
      setValue("blogType", existingBlog.blogType);
      setValue("content", existingBlog.content);
      setSelectedTags(existingBlog.tags || []);
      setValue("tags", existingBlog.tags || []);
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

      await axiosPublicUrl.patch(`/api/blogs/${id}`, formData, {
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register("title", { required: true })}
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <select
            {...register("author", { required: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="">Select an author</option>
            {authors?.author?.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Blog Type
          </label>
          <select
            {...register("blogType", { required: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="">Select a blog type</option>
            {blogTypes?.blogTypes?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Editor
                {...field}
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                init={{
                  height: 300,
                  menubar: false,
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
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  selectedTags.includes(tag)
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-gray-700"
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
                className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700 border border-teal-500"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {images.map((img, index) => (
              <div key={index} className="relative border rounded-md p-2">
                {img.previewUrl && (
                  <img
                    src={img.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageDrop(index)(e.target.files)}
                    className="text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageToggle(index)}
                    className="text-sm text-blue-500"
                  >
                    {img.show ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Order
                  </label>
                  <input
                    type="number"
                    value={img.order}
                    onChange={(e) => handleOrderChange(index, e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

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
