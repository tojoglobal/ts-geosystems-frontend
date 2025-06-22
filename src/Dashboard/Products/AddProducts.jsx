/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Button from "../Button/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useVatEnabled } from "../../Hooks/useVatEnabled";
import AdminVatSwitch from "./AdminVatSwitch";

// Helper to validate only YouTube URLs (returns true if empty or valid YouTube URL)
const validateYouTubeUrls = (value) => {
  if (!value || value.trim() === "") return true;
  const urls = value.split(",").map((v) => v.trim());
  const ytPattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(embed\/|watch\?v=)?[A-Za-z0-9\-_]{11,}/;
  return urls.every((url) => url === "" || ytPattern.test(url));
};

// MetaKeywordsInput component
const MetaKeywordsInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState(value || []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newKeywords = [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      onChange(newKeywords);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      e.preventDefault();
      const newKeywords = keywords.slice(0, -1);
      setKeywords(newKeywords);
      onChange(newKeywords);
    }
  };

  const removeKeyword = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
    onChange(newKeywords);
  };

  return (
    <div className="border border-gray-600 rounded-md p-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
      <div className="flex flex-wrap gap-2 mb-2">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="bg-teal-100 text-teal-800 px-2 py-1 rounded-md flex items-center"
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="ml-1 text-teal-600 hover:text-teal-800"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a keyword and press Enter"
          className="flex-1 min-w-[150px] outline-none bg-transparent"
        />
      </div>
    </div>
  );
};

const ProductAddForm = () => {
  const axiosPublicUrl = useAxiospublic();
  const [images, setImages] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const { data: vatEnabled } = useVatEnabled();

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
      clearance: false,
      metaKeywords: [],
      metaDescription: "",
    },
  });

  const navigate = useNavigate();

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
  }, []);

  // fetch categories and subcategories
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
  }, []);

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
  }, [watchCategory]);

  // Fetch taxes
  useEffect(() => {
    axiosPublicUrl
      .get("/api/taxes")
      .then((res) => setTaxes(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Dropzone for image upload
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.slice(0, 20);
    setImages((prev) => [...prev, ...newFiles]);
  };

  // Remove image from preview
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 20,
  });

  // onChange handler for file input
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append images
      images.forEach((file) => {
        formData.append("images", file);
      });

      // Append all other fields
      formData.append("productName", data.productName);
      formData.append("price", data.price);
      formData.append("priceShowHide", data.priceShowHide);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("tax", data.tax);
      formData.append("sku", data.sku);
      formData.append("condition", data.condition);
      formData.append("productOptionShowHide", data.productOptionShowHide);
      formData.append("brandName", data.brandName);
      formData.append("productOverview", data.productOverview);
      formData.append("videoUrls", data.videoUrls || "");
      formData.append("warrantyInfo", data.warrantyInfo || "");
      formData.append("clearance", data.clearance ? "1" : "0");
      formData.append("flashSale", data.flashSale ? "1" : "0");
      formData.append("flashSaleEnd", data.flashSaleEnd || "");
      formData.append("metaKeywords", data.metaKeywords?.join(",") || "");
      formData.append("metaDescription", data.metaDescription || "");

      // Handle arrays/objects
      formData.append(
        "productOptions",
        JSON.stringify(data.productOptions || [])
      );
      formData.append(
        "softwareOptions",
        JSON.stringify(data.softwareOptions || [])
      );

      await axiosPublicUrl.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset the form after successful submission
      reset();
      setImages([]); // Clear the images
      setValue("productOptions", []);
      setValue("softwareOptions", []);

      Swal.fire({
        icon: "success",
        title: "Product added successfully!",
        confirmButtonColor: "#14b8a6",
      });
      navigate("/dashboard/product");
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: "error",
        text: "Failed to upload product. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div>
      <AdminVatSwitch />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-2 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
      >
        {/* Image Upload Column */}
        <div className="col-span-1">
          <label className="block mb-2 font-medium">Upload Images</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-md p-4 sm:p-6 text-center cursor-pointer hover:border-teal-500"
          >
            <input {...getInputProps()} />
            <p className="text-sm sm:text-base">
              Drag & drop or{" "}
              <span className="underline text-teal-500">Browse</span> images
              (max 20)
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {images.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-16 sm:h-20 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Second Column */}
        <div className="col-span-1 md:col-span-2 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="col-span-1 space-y-3 sm:space-y-4">
            {/* productName */}
            <input
              {...register("productName", {
                required: "Product Name is required",
              })}
              placeholder="Product Name"
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.productName && (
              <p className="text-red-500">{errors.productName.message}</p>
            )}

            {/* brandName */}
            <select
              {...register("brandName", { required: "Brand is required" })}
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
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

            {/* category */}
            <select
              {...register("category", { required: "Category is required" })}
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
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

            {/*  subCategory*/}
            <select
              {...register("subCategory", {
                required: "Sub Category is required",
              })}
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
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

            {/*SKU / Unique Code  */}
            <input
              {...register("sku", { required: "SKU is required" })}
              placeholder="SKU / Unique Code"
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}

            {/*videoUrls  */}
            <input
              {...register("videoUrls", {
                validate: (value) =>
                  validateYouTubeUrls(value) ||
                  "Only YouTube URLs are allowed (comma separated)",
              })}
              placeholder="YouTube Video URLs (comma separated)"
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.videoUrls && (
              <p className="text-red-500">{errors.videoUrls.message}</p>
            )}

            {/* Condition select */}
            <select
              {...register("condition", { required: "Condition is required" })}
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="">Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            {errors.condition && (
              <p className="text-red-500">{errors.condition.message}</p>
            )}

            {/* Tax select */}
            {vatEnabled && (
              <select
                {...register("tax", { required: "Tax is required" })}
                className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
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
          <div className="col-span-1 space-y-3 sm:space-y-4">
            {/* Clearance, In Stock, On Sale checkboxes remain the same */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("clearance")}
                className="w-5 h-5 cursor-pointer accent-teal-600"
              />
              <label>Clearance Item</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isStock")}
                defaultChecked={true}
                className="w-5 h-5 cursor-pointer accent-teal-600"
              />
              <label>In Stock</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("sale")}
                className="w-5 h-5 cursor-pointer accent-teal-600"
              />
              <label>On Sale</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("flashSale")}
                className="w-5 h-5 cursor-pointer accent-teal-600"
              />
              <label>Flash Sale</label>
            </div>
            <input
              type="datetime-local"
              {...register("flashSaleEnd")}
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              min={new Date().toISOString().slice(0, 16)}
            />
            {/* Price and other fields remain the same */}
            <input
              {...register("price", { required: "Price is required" })}
              placeholder="Price"
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={watch("priceShowHide") === 1}
                onChange={(e) =>
                  setValue("priceShowHide", e.target.checked ? 1 : 0)
                }
                className="w-5 h-5 accent-teal-600"
              />
              <label>Hide Price</label>
            </div>
            {/* Product Options and other fields remain the same */}
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
                      backgroundColor: "rgb(255, 255, 255)", // Tailwind: dark:bg-gray-800
                      borderColor: state.isFocused
                        ? "#14b8a6"
                        : "rgb(75 85 99)",
                      color: "white",
                      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : "none",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "rgb(255,255,255)",
                      color: "white",
                      zIndex: 10,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#0f766e" // Tailwind: bg-teal-700
                        : state.isFocused
                        ? "#115e59" // Tailwind: hover:bg-teal-800
                        : "rgb(209, 213, 219)",
                      color: state.isFocused ? "white" : "black",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#363636", // dark teal
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
            {/* Product Option Show/Hide */}
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
            {/* softwareOptions */}
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
                      backgroundColor: "rgb(255, 255, 255)", // Tailwind: dark:bg-gray-800
                      borderColor: state.isFocused
                        ? "#14b8a6"
                        : "rgb(75 85 99)",
                      color: "white",
                      boxShadow: state.isFocused ? "0 0 0 1px #14b8a6" : "none",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "rgb(255,255,255)",
                      color: "white",
                      zIndex: 10,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#0f766e" // Tailwind: bg-teal-700
                        : state.isFocused
                        ? "#115e59" // Tailwind: hover:bg-teal-800
                        : "rgb(209, 213, 219)",
                      color: state.isFocused ? "white" : "black",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#363636", // dark teal
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
          <div className="col-span-2 ">
              {/* Meta Keywords Field */}
            <div>
              <label className="block mb-1 font-medium">Meta Keywords</label>
              <Controller
                name="metaKeywords"
                control={control}
                render={({ field }) => (
                  <MetaKeywordsInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">
                Add keywords that describe your product
              </p>
            </div>

            {/* Meta Description Field */}
            <div>
              <label className="block mb-1 font-medium">Meta Description</label>
              <textarea
                {...register("metaDescription")}
                placeholder="Enter a brief description for search engines"
                className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 w-full h-24"
              />
              <p className="text-xs text-gray-500 mt-1">
                Keep it under 160 characters for best results
              </p>
            </div>
          </div>
          {/*  productOverview*/}
          <div className="col-span-2 space-y-4">
            <label className="ml-1">Product Overview</label>
            <Controller
              name="productOverview"
              control={control}
              render={({ field }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINY_APIKEY}
                  value={field.value}
                  init={{
                    height: 320,
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
              render={({ field }) => (
                <Editor
                  apiKey={import.meta.env.VITE_TINY_APIKEY}
                  value={field.value}
                  init={{
                    height: 320,
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
            <Button text={"Submit Product"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAddForm;

// Tailwind common input class
const inputClass = `block w-full rounded-md border border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 text-sm`;
const style = document.createElement("style");
style.innerHTML = `.input { ${inputClass} }`;
document.head.appendChild(style);
