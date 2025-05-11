import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import Button from "../../Dashboard/Button/Button";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useDataQuery from "../../utils/useDataQuery";

const availableTags = [
  "#GeoBusiness",
  "#GeospatialTech",
  "#SeeYouThere",
  "#ExCeLLondon",
  "#MappingTheFuture",
];

const BlogUpdate = ({ blogId, existingBlog }) => {
  const axiosPublicUrl = useAxiospublic();
  const { data: authors = [] } = useDataQuery(["authors"], "/api/authors");
  const { data: blogTypes = [] } = useDataQuery(
    ["blogTypes"],
    "/api/blog-types"
  );

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

      await axiosPublicUrl.patch(`/api/blogs/${blogId}`, formData, {
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
        {/* All form fields remain the same as BlogCreate, only button changes */}
        {/* Replace the Button component */}
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
