import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Button from "../Button/Button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const UpdateProductForm = () => {
  const { id } = useParams();
  const axiosPublicUrl = useAxiospublic();
  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const watchCategory = watch("category");

  // Fetch product details
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axiosPublicUrl.get(`/api/products/${id}`);
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProductData();
  }, [id, axiosPublicUrl]);

  // Reset form when productData changes
  useEffect(() => {
    reset({
      productName: productData.product_name || "",
      category: productData.category || "",
      subCategory: productData.sub_category || "",
      sku: productData.sku || "",
      videoUrls: productData.video_urls || "",
      price: productData.price || "",
      brandName: productData.brand_name || "",
      condition: productData.condition || "",
      productOverview: productData.product_overview || "",
      warrantyInfo: productData.warranty_info || "",
      productOptions: productData.product_options || [],
      softwareOptions: productData.software_options || [],
    });
    setImages(productData.image_urls || []);
  }, [productData, reset]);

  useEffect(() => {
    if (productData.image_urls) {
      const imageUrlsArray = JSON.parse(productData.image_urls); // Parse JSON
      setImages(imageUrlsArray);
      console.log(imageUrlsArray); // Output: ["url1", "url2", "url3"]
    }
  }, [productData]);

  const handleRemoveImage = async (file, index) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // light blue
      cancelButtonColor: "#d33", // red
      confirmButtonText: "Yes, delete it!",
      background: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "#1f2937"
        : "#fff", // dark mode support
      color: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "#fff"
        : "#000",
    });

    if (result.isConfirmed) {
      console.log(file);

      try {
        // If it's an old image (not a new uploaded File)
        if (typeof file === "string") {
          await axiosPublicUrl.post("/api/products/delete-image", {
            imageUrl: file,
            id,
          });
        }

        setImages((prev) => prev.filter((_, i) => i !== index));

        MySwal.fire({
          title: "Deleted!",
          text: "Your image has been deleted.",
          icon: "success",
          background: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "#1f2937"
            : "#fff",
          color: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "#fff"
            : "#000",
        });
      } catch (error) {
        console.error("Failed to delete image", error);
        MySwal.fire({
          title: "Error!",
          text: "Failed to delete the image.",
          icon: "error",
          background: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "#1f2937"
            : "#fff",
          color: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "#fff"
            : "#000",
        });
      }
    }
  };

  // Fetch subcategories dynamically
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axiosPublicUrl.get(
          `/api/subcategories?category=${watchCategory}`
        );
        setSubCategories(
          response.data.map((sub) => ({
            value: sub.id,
            label: sub.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    if (watchCategory) {
      fetchSubcategories();
    }
  }, [watchCategory, axiosPublicUrl]);

  const onDrop = (acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 20,
  });

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const formData = new FormData();

      images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        } else {
          formData.append("existingImages", file);
        }
      });

      Object.entries(data).forEach(([key, value]) => {
        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : value
        );
      });

      const response = await axiosPublicUrl.put(
        `/api/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Image Upload Column */}
      <div className="col-span-1">
        <label className="block mb-2 font-medium">Product Images</label>
        <div {...getRootProps()} className="border-2 border-dashed p-4">
          <input {...getInputProps()} />
          <p>Drag & drop or click to upload</p>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {images?.map((file, idx) => (
            <div key={idx} className="relative">
              <img
                src={
                  file instanceof File
                    ? URL.createObjectURL(file)
                    : `${import.meta.env.VITE_OPEN_APIURL}${file}`
                }
                alt="Preview"
                className="h-20 w-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(file, idx)}
                className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Other Input Fields */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          {...register("productName")}
          placeholder="Product Name"
          className="input"
        />
        {errors.productName && (
          <p className="text-red-500">{errors.productName.message}</p>
        )}

        <select {...register("category")} className="input">
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="cameras">Cameras</option>
        </select>
        {errors.category && (
          <p className="text-red-500">{errors.category.message}</p>
        )}

        <select {...register("subCategory")} className="input">
          <option value="">Select Sub Category</option>
          {subCategories.map((sub) => (
            <option key={sub.value} value={sub.value}>
              {sub.label}
            </option>
          ))}
        </select>
        {errors.subCategory && (
          <p className="text-red-500">{errors.subCategory.message}</p>
        )}

        <input
          {...register("sku")}
          placeholder="SKU / Unique Code"
          className="input"
        />
        {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}

        <input
          {...register("videoUrls")}
          placeholder="YouTube Video URLs (comma separated)"
          className="input"
        />

        <input {...register("price")} placeholder="Price" className="input" />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <Controller
          name="productOptions"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={[
                { value: "wifi", label: "WiFi" },
                { value: "bluetooth", label: "Bluetooth" },
              ]}
              placeholder="Product Options"
              className="react-select-container"
            />
          )}
        />

        <Controller
          name="softwareOptions"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={[
                { value: "photoshop", label: "Photoshop" },
                { value: "lightroom", label: "Lightroom" },
              ]}
              placeholder="Software Options"
              className="react-select-container"
            />
          )}
        />

        <input
          {...register("brandName")}
          placeholder="Brand Name"
          className="input"
        />
        {errors.brandName && (
          <p className="text-red-500">{errors.brandName.message}</p>
        )}

        <select {...register("condition")} className="input">
          <option value="">Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        {errors.condition && (
          <p className="text-red-500">{errors.condition.message}</p>
        )}

        <Controller
          name="productOverview"
          control={control}
          render={({ field }) => (
            <Editor
              apiKey={import.meta.env.VITE_TINY_APIKEY}
              value={field.value}
              init={{ height: 200 }}
              onEditorChange={field.onChange}
            />
          )}
        />

        <Controller
          name="warrantyInfo"
          control={control}
          render={({ field }) => (
            <Editor
              apiKey={import.meta.env.VITE_TINY_APIKEY}
              value={field.value}
              init={{ height: 200 }}
              onEditorChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="col-span-3">
        <Button text={"Update Product"} />
      </div>
    </form>
  );
};

export default UpdateProductForm;
