import { useState, useEffect, useMemo } from "react";
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
import useDataQuery from "../../utils/useDataQuery";

const validateYouTubeUrls = (value) => {
  if (!value || value.trim() === "") return true;
  const urls = value.split(",").map((v) => v.trim());
  const ytPattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(embed\/|watch\?v=)?[A-Za-z0-9\-_]{11,}/;
  return urls.every((url) => url === "" || ytPattern.test(url));
};

const MetaKeywordsInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState(value || []);

  useEffect(() => {
    setKeywords(value || []);
  }, [value]);

  const addKeyword = () => {
    if (inputValue.trim()) {
      const newKeywords = [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      onChange(newKeywords);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      e.preventDefault();
      const newKeywords = keywords.slice(0, -1);
      setKeywords(newKeywords);
      onChange(newKeywords);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(",")) {
      setInputValue(value.slice(0, -1));
      addKeyword();
    } else {
      setInputValue(value);
    }
  };

  const removeKeyword = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
    onChange(newKeywords);
  };

  return (
    <div className="border border-gray-600 rounded-md p-2 focus-within:border-teal-500 transition relative">
      <div className="flex flex-wrap gap-2 items-center pr-14">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="flex items-center bg-teal-100 text-teal-800 px-3 py-1.5 rounded-full text-sm shadow-sm"
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              className="ml-2 cursor-pointer text-teal-600 hover:text-teal-800 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            keywords.length === 0
              ? "Type a keyword and press Enter"
              : "Add another keyword"
          }
          className="flex-1 min-w-[150px] bg-white rounded-sm text-gray-800 placeholder-gray-400 px-3 py-2 border-none focus:outline-none"
        />
      </div>
      <div className="flex justify-between mt-2">
        <button
          type="button"
          onClick={addKeyword}
          className="px-3 py-1 cursor-pointer bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
        >
          Add Keyword
        </button>
        {keywords.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setKeywords([]);
              onChange([]);
            }}
            className="px-3 py-1 cursor-pointer bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

const ProductAddForm = () => {
  const axiosPublicUrl = useAxiospublic();
  const [images, setImages] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const { data: vatEnabled } = useVatEnabled();
  const navigate = useNavigate();

  // Tanstack Query for categories, subcategories, brands, taxes
  const { data: categoriesData } = useDataQuery(
    ["categories"],
    "/api/category"
  );
  const { data: subcategoriesData } = useDataQuery(
    ["subcategories"],
    "/api/subcategory"
  );
  const { data: brandsData } = useDataQuery(["brands"], "/api/brands");
  const { data: taxesData } = useDataQuery(["taxes"], "/api/taxes");

  const Categories = useMemo(
    () => categoriesData?.categories || [],
    [categoriesData]
  );
  const SubCategoriesAll = useMemo(
    () => subcategoriesData?.subcategories || [],
    [subcategoriesData]
  );
  const Brands = useMemo(() => brandsData || [], [brandsData]);
  const Taxes = useMemo(() => taxesData || [], [taxesData]);

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

  const watchCategoryRaw = watch("category");
  const watchCategory = watchCategoryRaw ? JSON.parse(watchCategoryRaw) : null;

  const SubCategories = useMemo(
    () =>
      SubCategoriesAll.filter(
        (sub) => sub.main_category_id === watchCategory?.id
      ),
    [SubCategoriesAll, watchCategory]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosPublicUrl.get("/api/products");
        const mappedProducts =
          response.data?.products?.map((prod) => ({
            value: prod.id,
            label: prod.product_name,
            price: prod.price,
            tax: prod.tax,
            image_urls: prod.image_urls,
          })) || [];
        setProductOptions(mappedProducts);
      } catch (err) {
        console.log(err);}
    };
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
        console.log(err);
      }
    };
    fetchProducts();
    fetchSoftware();
  }, [axiosPublicUrl]);

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
    try {
      const formData = new FormData();
      images.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("productName", data.productName);
      formData.append("price", data.price);
      formData.append("priceShowHide", data.priceShowHide);
      formData.append("category", data.category);
      formData.append(
        "subCategory",
        data.subCategory &&
          data.subCategory !== "" &&
          data.subCategory !== "null"
          ? data.subCategory
          : null
      );
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

      reset();
      setImages([]);
      setValue("productOptions", []);
      setValue("softwareOptions", []);

      Swal.fire({
        title: "Success",
        text: "Product added successfully!",
        icon: "success",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
      navigate("/dashboard/product");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.message || "Failed to upload product. Please try again.",
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
              {Brands.map((br) => (
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
            {/* subCategory */}
            <select
              {...register("subCategory")}
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="">
                No Sub Category (add under category only)
              </option>
              {SubCategories.map((sub) => (
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

            {/*SKU / Unique Code */}
            <input
              {...register("sku", { required: "SKU is required" })}
              placeholder="SKU / Unique Code"
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}

            {/*videoUrls */}
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
                {...register("tax")}
                className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="">Select Tax</option>
                {Taxes.map((tax) => (
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
          <div className="col-span-1 md:col-span-2 space-y-4">
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
                    className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
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
                className="w-full border border-gray-600 bg-white text-black rounded-md shadow-sm focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2 text-sm h-24"
              />
              <p className="text-xs text-gray-500 mt-1">
                Keep it under 160 characters for best results
              </p>
            </div>
          </div>
          {/* productOverview*/}
          <div className="col-span-1 md:col-span-2 space-y-4">
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
                    height: 280,
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
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Button text={"Submit Product"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductAddForm;

// Tailwind input class
const inputClass = `block w-full rounded-md border border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 text-sm`;
const style = document.createElement("style");
style.innerHTML = `.input { ${inputClass} }`;
document.head.appendChild(style);
