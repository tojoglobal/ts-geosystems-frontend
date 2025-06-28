import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../Button/Button";
import Swal from "sweetalert2";
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
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      const newKeywords = [...keywords, trimmedValue];
      setKeywords(newKeywords);
      onChange(newKeywords);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
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
    <div className="border border-gray-600 rounded-md p-2 focus-within:border-teal-500 transition">
      <div className="flex flex-wrap gap-2 items-center">
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
              aria-label={`Remove keyword ${keyword}`}
            >
              &times;
            </button>
          </div>
        ))}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              keywords.length === 0
                ? "Type keywords (use comma or Enter)"
                : "Add another keyword"
            }
            className="flex-1 min-w-[100px] bg-white rounded-sm text-gray-800 placeholder-gray-400 px-3 py-2 border-none focus:outline-none"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-2 py-1 cursor-pointer bg-teal-600 text-white rounded text-sm hover:bg-teal-700 whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        {keywords.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setKeywords([]);
              onChange([]);
            }}
            className="text-xs cursor-pointer text-gray-500 hover:text-teal-600 transition-colors"
          >
            Clear all
          </button>
        )}
        <span className="text-xs text-gray-500">
          {keywords.length} keyword(s) added
        </span>
      </div>
    </div>
  );
};

const UpdateProductForm = () => {
  const { id } = useParams();
  const axiosPublicUrl = useAxiospublic();
  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const { data: vatEnabled } = useVatEnabled();
  const navigate = useNavigate();

  // Fetch categories and subcategories
  const { data: categoriesData } = useDataQuery(
    ["categories"],
    "/api/category"
  );
  const { data: subcategoriesData } = useDataQuery(
    ["subcategories"],
    "/api/subcategory"
  );

  const Categories = useMemo(
    () => categoriesData?.categories || [],
    [categoriesData]
  );
  const SubCategories = useMemo(
    () => subcategoriesData?.subcategories || [],
    [subcategoriesData]
  );

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

  // Fetch brands/products/software/taxes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, productsRes, softwareRes, taxesRes] =
          await Promise.all([
            axiosPublicUrl.get("/api/brands"),
            axiosPublicUrl.get("/api/products"),
            axiosPublicUrl.get("/api/software"),
            axiosPublicUrl.get("/api/taxes"),
          ]);

        setBrands(brandsRes.data);

        setProductOptions(
          productsRes.data?.products?.map((prod) => ({
            value: prod.id,
            label: prod.product_name,
            price: prod.price,
            tax: prod.tax,
            image_urls: prod.image_urls,
          })) || []
        );

        setSoftwareOptions(
          softwareRes.data?.map((soft) => ({
            value: soft.slug,
            label: soft.softwar_name,
          })) || []
        );

        setTaxes(taxesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [axiosPublicUrl]);

  // Fetch product data
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

  // Set subcategory default value
  useEffect(() => {
    if (productData?.sub_category && SubCategories.length > 0) {
      try {
        // Parse subcategory
        let subCategory = productData.sub_category;
        if (typeof subCategory === "string" && subCategory !== "") {
          subCategory = JSON.parse(subCategory);
        }
        // Defensive: check subCategory is object and has id
        if (subCategory && typeof subCategory === "object" && subCategory.id) {
          const foundSub = SubCategories.find((sc) => sc.id === subCategory.id);
          if (foundSub) {
            setValue(
              "subCategory",
              JSON.stringify({ id: foundSub.id, slug: foundSub.slug })
            );
          } else {
            setValue("subCategory", "");
          }
        } else {
          setValue("subCategory", "");
        }
      } catch (error) {
        console.log(error);
        setValue("subCategory", "");
      }
    } else {
      setValue("subCategory", "");
    }
  }, [productData, SubCategories, setValue]);
  useEffect(() => {
    if (productData) {
      const parsedMetaKeywords = productData.meta_keywords
        ? productData.meta_keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k)
        : [];

      // Figure out subCategory default value
      let subCatValue = "";
      if (productData.sub_category) {
        try {
          let subCatObj =
            typeof productData.sub_category === "string"
              ? JSON.parse(productData.sub_category)
              : productData.sub_category;
          if (subCatObj && subCatObj.id) {
            subCatValue = JSON.stringify({
              id: subCatObj.id,
              slug: subCatObj.slug,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }

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
        subCategory: subCatValue,
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
        tax: productData.tax
          ? typeof productData.tax === "string"
            ? productData.tax
            : JSON.stringify({
                id: productData.tax.id,
                value: productData.tax.value,
              })
          : "",
        isStock: productData.isStock !== undefined ? productData.isStock : true,
        sale: productData.sale !== undefined ? productData.sale : false,
        clearance:
          productData.clearance === 1 || productData.clearance === true,
        flashSale:
          productData.flash_sale === 1 || productData.flash_sale === true,
        flashSaleEnd: productData.flash_sale_end
          ? new Date(productData.flash_sale_end).toISOString().slice(0, 16)
          : "",
        metaKeywords: parsedMetaKeywords,
        metaDescription: productData.meta_description || "",
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image?",
      icon: "warning",
      showCancelButton: true,
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        if (typeof file === "string") {
          const response = await axiosPublicUrl.post(
            "/api/products/delete-image",
            { imageUrl: file, id }
          );
          if (response?.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your image has been deleted.",
              icon: "success",
              background: "#1e293b",
              color: "#f8fafc",
              confirmButtonColor: "#e11d48",
            });
            setImages((prev) => prev.filter((_, i) => i !== index));
          } else {
            Swal.fire("Error!", "Failed to delete the image.", "error");
          }
        } else {
          setImages((prev) => prev.filter((_, i) => i !== index));
          Swal.fire({
            title: "Removed!",
            text: "The image has been removed from the upload list.",
            icon: "success",
            background: "#1e293b",
            color: "#f8fafc",
            confirmButtonColor: "#e11d48",
          });
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.message || "Failed to delete the image.",
          "error"
        );
      }
    }
  };

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
        if (file instanceof File) {
          formData.append("images", file);
        } else if (typeof file === "string") {
          formData.append("existingImages", file);
        }
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
      formData.append("isStock", data.isStock ? "1" : "0");
      formData.append("sale", data.sale ? "1" : "0");
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
      const res = await axiosPublicUrl.put(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        Swal.fire({
          title: "Success",
          text: "Product updated successfully!",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
        navigate(-1);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.message || "Failed to update product. Please try again.",
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
        <div className="col-span-1">
          <label className="block mb-2 font-medium">Update Images</label>
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
              <div key={index} className="relative">
                <img
                  src={
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : `${import.meta.env.VITE_OPEN_APIURL}${file}`
                  }
                  alt="preview"
                  className="h-16 sm:h-20 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(file, index)}
                  className="absolute cursor-pointer top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

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
              {...register("brandName")}
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
              <option value="">Select Category</option>
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
              <option value="">Select SubCategory</option>
              {SubCategories.filter(
                (sub) => sub.main_category_id === watchCategory?.id
              ).map((sub) => (
                <option
                  key={sub.id}
                  value={JSON.stringify({ id: sub.id, slug: sub.slug })}
                >
                  {sub.name}
                </option>
              ))}
            </select>

            {/* SKU */}
            <input
              {...register("sku", { required: "SKU is required" })}
              placeholder="SKU / Unique Code"
              className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
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
            {/* Clearance, In Stock, On Sale checkboxes */}
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
                defaultChecked={
                  productData.isStock === undefined
                    ? true
                    : productData.isStock === 1 || productData.isStock === true
                }
                className="w-5 h-5 cursor-pointer accent-teal-600"
              />
              <label>In Stock</label>
            </div>
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
                  productData.flash_sale === 1 ||
                  productData.flash_sale === true
                }
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

            {/* Price */}
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
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
              <label>Hide Price</label>
            </div>

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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={watch("productOptionShowHide") === 1}
                onChange={(e) =>
                  setValue("productOptionShowHide", e.target.checked ? 1 : 0)
                }
                className="w-5 h-5 accent-teal-600 cursor-pointer"
              />
              <label>Hide Product Options</label>
            </div>

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

          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Meta Keywords</label>
              <Controller
                name="metaKeywords"
                control={control}
                render={({ field }) => (
                  <MetaKeywordsInput
                    value={field.value || []}
                    onChange={field.onChange}
                    className="input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500"
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">
                Add keywords that describe your product
              </p>
            </div>

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
            <Button text={"Update Product"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;

// Add Tailwind input class
const inputClass = `block w-full rounded-md border border-gray-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 text-sm`;
const style = document.createElement("style");
style.innerHTML = `.input { ${inputClass} }`;
document.head.appendChild(style);
