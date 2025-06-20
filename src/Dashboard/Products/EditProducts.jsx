/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../Button/Button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useVatEnabled } from "../../Hooks/useVatEnabled";
const MySwal = withReactContent(Swal);

// Helper to validate only YouTube URLs (returns true if empty or valid YouTube URL)
const validateYouTubeUrls = (value) => {
  if (!value || value.trim() === "") return true; // not required
  const urls = value.split(",").map((v) => v.trim());
  // YouTube patterns: youtu.be/xxxx  youtube.com/watch?v=xxxx  youtube.com/embed/xxxx
  const ytPattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(embed\/|watch\?v=)?[A-Za-z0-9\-_]{11,}/;
  return urls.every((url) => url === "" || ytPattern.test(url));
};

const UpdateProductForm = () => {
  const { id } = useParams();
  const axiosPublicUrl = useAxiospublic();
  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const { data: vatEnabled } = useVatEnabled();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priceShowHide: 0,
      productOptionShowHide: 0,
    },
  });

  const watchCategoryRaw = watch("category");
  const watchCategory = watchCategoryRaw ? JSON.parse(watchCategoryRaw) : null;

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosPublicUrl.get("/api/products");
        const mappedProducts =
          response.data?.products?.map((prod) => ({
            value: prod.id,
            label: prod.product_name,
          })) || [];
        setProductOptions(mappedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch Software
  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const response = await axiosPublicUrl.get("/api/software");
        const mappedSoftware =
          response.data?.map((soft) => ({
            value: soft.slug,
            label: soft.softwar_name,
          })) || [];
        setSoftwareOptions(mappedSoftware);
      } catch (err) {
        console.error("Error fetching software:", err);
      }
    };
    fetchSoftware();
  }, []);

  // fetch the brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosPublicUrl.get("/api/brands");
        setBrands(res.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, [axiosPublicUrl]);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPublicUrl.get("/api/category");
        setCategories(response.data?.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [axiosPublicUrl]);

  // Fetch Subcategories based on selected category
  useEffect(() => {
    if (watchCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await axiosPublicUrl.get("/api/subcategory");
          setSubCategories(response.data?.subcategories);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategories();
    }
  }, [watchCategory, axiosPublicUrl]);

  // Fetch taxes
  useEffect(() => {
    axiosPublicUrl
      .get("/api/taxes")
      .then((res) => setTaxes(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Fetch product details for updating
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
  }, []);

  useEffect(() => {
    if (productData && productData.sub_category && subCategories.length > 0) {
      // The current subcategory value as string
      const subCatValue =
        typeof productData.sub_category === "string"
          ? productData.sub_category
          : JSON.stringify({
              id: productData.sub_category.id,
              slug: productData.sub_category.slug,
            });

      setValue("subCategory", subCatValue);
    }
  }, [productData, subCategories, setValue]);

  useEffect(() => {
    if (productData) {
      reset({
        productName: productData.product_name || "",
        brandName: productData.brand_name || "",
        category: productData.category
          ? typeof productData.category === "string"
            ? productData.category
            : JSON.stringify({
                id: productData.category.id,
                cat: productData.category.slug_name,
              })
          : "",
        subCategory: productData.sub_category
          ? typeof productData.sub_category === "string"
            ? productData.sub_category
            : JSON.stringify({
                id: productData.sub_category.id,
                slug: productData.sub_category.slug,
              })
          : "",
        sku: productData.sku || "",
        videoUrls: productData.video_urls || "",
        price: productData.price || "",
        condition: productData.product_condition || "",
        productOverview: productData.product_overview || "",
        warrantyInfo: productData.warranty_info || "",
        productOptions: productData.product_options
          ? typeof productData.product_options === "string"
            ? JSON.parse(productData.product_options)
            : productData.product_options
          : [],
        softwareOptions: productData.software_options
          ? typeof productData.software_options === "string"
            ? JSON.parse(productData.software_options)
            : productData.software_options
          : [],
        priceShowHide: productData.priceShowHide || 0,
        productOptionShowHide: productData.productOptionShowHide || 0,
        tax: productData.tax || null,
        isStock: productData.isStock !== undefined ? productData.isStock : true,
        sale: productData.sale !== undefined ? productData.sale : false,
        clearance:
          productData.clearance === 1 || productData.clearance === true,
        flashSale:
          productData.flash_sale === 1 || productData.flash_sale === true,
        flashSaleEnd: productData.flash_sale_end
          ? new Date(productData.flash_sale_end).toISOString().slice(0, 16)
          : "",
      });

      setImages(
        productData.image_urls
          ? typeof productData.image_urls === "string"
            ? JSON.parse(productData.image_urls)
            : productData.image_urls
          : []
      );
    }
  }, [productData, reset]);

  const handleRemoveImage = async (file, index) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "#1f2937"
        : "#fff",
      color: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "#fff"
        : "#000",
    });

    if (result.isConfirmed) {
      try {
        // If it's an old image (URL string)
        if (typeof file === "string") {
          const response = await axiosPublicUrl.post(
            "/api/products/delete-image",
            { imageUrl: file, id }
          );
          if (response.data.success) {
            MySwal.fire("Deleted!", "Your image has been deleted.", "success");
            setImages((prev) => prev.filter((_, i) => i !== index));
          } else {
            MySwal.fire("Error!", "Failed to delete the image.", "error");
          }
        } else {
          // If it's a newly added file, just remove it from the preview
          setImages((prev) => prev.filter((_, i) => i !== index));
          MySwal.fire(
            "Removed!",
            "The image has been removed from the upload list.",
            "success"
          );
        }
      } catch (error) {
        console.error("Failed to delete image", error);
        MySwal.fire("Error!", "Failed to delete the image.", "error");
      }
    }
  };

  // Dropzone for image upload
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.slice(0, 20);
    setImages((prev) => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 20,
  });

  const onSubmit = async (data) => {
    const parsedData = {
      ...data,
      category: data.category ? JSON.parse(data.category) : null,
      subCategory: data.subCategory ? JSON.parse(data.subCategory) : null,
      productOptions: data.productOptions || [],
      softwareOptions: data.softwareOptions || [],
      priceShowHide: parseInt(data.priceShowHide),
      productOptionShowHide: parseInt(data.productOptionShowHide),
      tax: data.tax ? JSON.parse(data.tax) : productData.tax || null,
      clearance:
        data.clearance === true ||
        data.clearance === "true" ||
        data.clearance === 1,
      isStock:
        data.isStock === true || data.isStock === "true" || data.isStock === 1,
      sale: data.sale === true || data.sale === "true" || data.sale === 1,
      flashSale:
        data.flashSale === true ||
        data.flashSale === "true" ||
        data.flashSale === 1,
    };

    const formData = new FormData();

    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      } else if (typeof file === "string") {
        formData.append("existingImages", file);
      }
    });

    Object.entries(parsedData).forEach(([key, value]) => {
      // Convert boolean values to 1/0 for MySQL
      if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await axiosPublicUrl.put(`/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Product update successfully!",
          confirmButtonColor: "#14b8a6",
        });
        navigate("/dashboard/product");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        icon: "error",
        text: "Failed to update product.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Image Upload Column */}
      <div className="col-span-1">
        <label className="block mb-2 font-medium">Update Images</label>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-teal-500"
        >
          <input {...getInputProps()} />
          <p>
            Drag & drop or{" "}
            <span className="underline text-teal-500">Browse</span> images (max
            20)
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {images?.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={
                  file instanceof File
                    ? URL.createObjectURL(file)
                    : `${import.meta.env.VITE_OPEN_APIURL}${file}`
                }
                alt="preview"
                className="h-20 w-full object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(file, index)}
                className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Second Column */}
      <div className="col-span-2 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 space-y-4">
          {/* productName */}
          <input
            {...register("productName", {
              required: "Product Name is required",
            })}
            placeholder="Product Name"
            className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.productName && (
            <p className="text-red-500">{errors.productName.message}</p>
          )}

          {/*  brandName*/}
          <select
            {...register("brandName", { required: "Brand is required" })}
            className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="" className="hover:bg-amber-200">
              Select Brand
            </option>
            {brands.map((br) => (
              <option key={br.id} value={br.slug}>
                {br.brands_name}
              </option>
            ))}
          </select>
          {errors.brandName && (
            <p className="text-red-500">{errors.brandName.message}</p>
          )}

          {/*category  */}
          <select
            {...register("category", { required: "Category is required" })}
            className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="" className="hover:bg-amber-200">
              Select Category
            </option>
            {Categories.map((cat) => (
              <option
                key={cat.id}
                value={JSON.stringify({ id: cat.id, cat: cat.slug_name })}
              >
                {cat.category_name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}

          {/* subCategory */}
          <select
            {...register("subCategory", {
              required: "Sub Category is required",
            })}
            className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="">Select Sub Category</option>
            {subCategories
              .filter((sub) => sub.main_category_id === watchCategory?.id)
              .map((sub) => (
                <option
                  key={sub.id}
                  value={JSON.stringify({ id: sub.id, slug: sub.slug })}
                >
                  {sub.name}
                </option>
              ))}
          </select>
          {errors.subCategory && (
            <p className="text-red-500">{errors.subCategory.message}</p>
          )}

          {/* SKU / Unique Code */}
          <input
            {...register("sku", { required: "SKU is required" })}
            placeholder="SKU / Unique Code"
            className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}

          {/* videoUrls */}
          <input
            {...register("videoUrls", {
              validate: (value) =>
                validateYouTubeUrls(value) ||
                "Only YouTube URLs are allowed (comma separated)",
            })}
            placeholder="YouTube Video URLs (comma separated)"
            className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.videoUrls && (
            <p className="text-red-500">{errors.videoUrls.message}</p>
          )}

          <select
            {...register("condition", { required: "Condition is required" })}
            className="input"
          >
            <option value="">Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
          {errors.condition && (
            <p className="text-red-500">{errors.condition.message}</p>
          )}

          {/* Tax selection */}
          {vatEnabled && (
            <select
              {...register("tax", { required: "Tax is required" })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            >
              <option value="">Select Tax</option>
              {taxes.map((tax) => (
                <option
                  key={tax.id}
                  value={JSON.stringify({ id: tax.id, value: tax.value })}
                >
                  {tax.name} ({tax.value}%)
                </option>
              ))}
            </select>
          )}
          {!vatEnabled && (
            <input type="hidden" {...register("tax")} value={""} />
          )}
          {errors.tax && <p className="text-red-500">{errors.tax.message}</p>}
        </div>
        {/* Third Column */}
        <div className="col-span-1 space-y-4">
          {/* Clearance */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("clearance")}
              defaultChecked={
                productData.clearance === 1 || productData.clearance === true
              }
              className="w-5 h-5 cursor-pointer accent-teal-600"
            />
            <label>Clearance Item</label>
          </div>
          {/* In Stock */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isStock")}
              defaultChecked={
                productData.isStock === undefined
                  ? true
                  : productData.isStock === 1 || productData.isStock === true
              }
              className="w-5 h-5 cursor-pointer accent-teal-600"
            />
            <label>In Stock</label>
          </div>
          {/* On Sale */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("sale")}
              defaultChecked={
                productData.sale === 1 || productData.sale === true
              }
              className="w-5 h-5 cursor-pointer accent-teal-600"
            />
            <label>On Sale</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("flashSale")}
              defaultChecked={
                productData.flash_sale === 1 || productData.flash_sale === true
              }
              className="w-5 h-5 cursor-pointer accent-teal-600"
            />
            <label>Flash Sale</label>
          </div>
          <input
            type="datetime-local"
            {...register("flashSaleEnd")}
            defaultValue={
              productData.flash_sale_end
                ? new Date(productData.flash_sale_end)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            min={new Date().toISOString().slice(0, 16)}
          />
          {/* price */}
          <input
            {...register("price", { required: "Price is required" })}
            placeholder="Price"
            className="w-full input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
          {/* NEW FIELD: Price Show/Hide */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={watch("priceShowHide") === 1}
              onChange={(e) =>
                setValue("priceShowHide", e.target.checked ? 1 : 0)
              }
              className="w-5 h-5 accent-teal-600 cursor-pointer"
            />
            <label>Hide Price</label>
          </div>
          {/* product option */}
          <Controller
            name="productOptions"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                isSearchable={true}
                options={productOptions}
                placeholder="Product Options"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "rgb(255, 255, 255)",
                    borderColor: state.isFocused ? "#14b8a6" : "rgb(75 85 99)",
                    color: "black",
                    boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "rgb(255,255,255)",
                    color: "black",
                    zIndex: 10,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#0f766e"
                      : state.isFocused
                      ? "#115e59"
                      : "rgb(209, 213, 219)",
                    color: state.isFocused ? "white" : "black",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#363636",
                    color: "white",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "white",
                    ":hover": {
                      backgroundColor: "#0f766e",
                      color: "white",
                    },
                  }),
                }}
              />
            )}
          />
          {/* NEW FIELD: Product Option Show/Hide */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={watch("productOptionShowHide") === 1}
              onChange={(e) =>
                setValue("productOptionShowHide", e.target.checked ? 1 : 0)
              }
              className="w-5 h-5 accent-teal-600"
            />
            <label>Hide Product Options</label>
          </div>
          {/* softaware option */}
          <Controller
            name="softwareOptions"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                isSearchable={true}
                options={softwareOptions}
                placeholder="Software Options"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "rgb(255, 255, 255)",
                    borderColor: state.isFocused ? "#14b8a6" : "rgb(75 85 99)",
                    color: "black",
                    boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "rgb(255,255,255)",
                    color: "black",
                    zIndex: 10,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#0f766e"
                      : state.isFocused
                      ? "#115e59"
                      : "rgb(209, 213, 219)",
                    color: state.isFocused ? "white" : "black",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#363636",
                    color: "white",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "white",
                    ":hover": {
                      backgroundColor: "#0f766e",
                      color: "white",
                    },
                  }),
                }}
              />
            )}
          />
        </div>
        {/* productOverview */}
        <div className="col-span-2 space-y-4">
          <label className="ml-1">Product Overview</label>
          <Controller
            name="productOverview"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                value={field.value}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | fontselect fontsizeselect | " +
                    "bold italic underline removeformat | forecolor backcolor | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | link image media table | " +
                    "preview fullscreen | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                onEditorChange={(content) => field.onChange(content)}
              />
            )}
          />
          <label className="ml-1">Warranty Info</label>
          <Controller
            name="warrantyInfo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Editor
                apiKey={import.meta.env.VITE_TINY_APIKEY}
                value={field.value}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | fontselect fontsizeselect | " +
                    "bold italic underline removeformat | forecolor backcolor | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | link image media table | " +
                    "preview fullscreen | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
                onEditorChange={(content) => field.onChange(content)}
              />
            )}
          />
        </div>
        <div className="col-span-1 space-y-4">
          <Button text={"Update Product"} />
        </div>
      </div>
    </form>
  );
};

export default UpdateProductForm;

// Tailwind common input class
const inputClass = `block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 text-sm bg-white dark:bg-gray-800 dark:text-white`;
const style = document.createElement("style");
style.innerHTML = `.input { ${inputClass} }`;
document.head.appendChild(style);
