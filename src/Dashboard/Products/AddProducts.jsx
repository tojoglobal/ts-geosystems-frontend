/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Button from "../Button/Button";

const ProductAddForm = () => {
  const axiosPublicUrl = useAxiospublic();
  const [images, setImages] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [productOptions, setProductOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);

  const { register, handleSubmit, setValue, control, watch } = useForm({
    defaultValues: {
      priceShowHide: 0,
      productOptionShowHide: 0,
    },
  });

  const watchCategoryRaw = watch("category");
  const watchCategory = watchCategoryRaw ? JSON.parse(watchCategoryRaw) : null;

  // Fetch All Products and Softwar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, softwarRes] = await Promise.all([
          axiosPublicUrl.get("/api/products"),
          axiosPublicUrl.get("/api/softwar"),
        ]);

        const mappedProducts =
          productsRes.data?.products?.map((prod) => ({
            value: prod.slug,
            label: prod.product_name,
          })) || [];

        const mappedSoftware =
          softwarRes.data?.map((soft) => ({
            value: soft.slug,
            label: soft.softwar_name,
          })) || [];

        setProductOptions(mappedProducts);
        setSoftwareOptions(mappedSoftware);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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
    console.log(data);

    const parsedData = {
      ...data,
      category: data.category ? JSON.parse(data.category) : null,
      subCategory: data.subCategory ? JSON.parse(data.subCategory) : null,
    };

    console.log({ ...parsedData, images });

    try {
      const formData = new FormData();

      images.forEach((file) => {
        formData.append("images", file);
      });

      Object.entries(parsedData).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : value
        );
      });

      const response = await axiosPublicUrl.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4ff] dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Image Upload Column */}
        <div className="col-span-1">
          <label className="block mb-2 font-medium">Upload Images</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-teal-500"
          >
            <input {...getInputProps()} />
            <p>
              Drag & drop or{" "}
              <span className="underline text-teal-500">Browse</span> images
              (max 20)
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {images.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-20 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>
        {/* Second Column */}
        <div className="col-span-2 text-white space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 space-y-4">
            <input
              {...register("productName", { required: true })}
              placeholder="Product Name"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <select
              {...register("brandName", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
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
            <select
              {...register("category", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
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

            <select
              {...register("subCategory", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
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

            <input
              {...register("sku", { required: true })}
              placeholder="SKU / Unique Code"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <input
              {...register("videoUrls")}
              placeholder="YouTube Video URLs (comma separated)"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
          </div>
          {/* Third Column */}
          <div className="col-span-1 space-y-4">
            <input
              {...register("price", { required: true })}
              placeholder="price"
              className="w-full input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />

            {/* NEW FIELD: Price Show/Hide */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                // {...register("priceShowHide")}
                checked={watch("priceShowHide") === 1}
                onChange={(e) =>
                  setValue("priceShowHide", e.target.checked ? 1 : 0)
                }
                // value="1"
                className="w-5 h-5 accent-teal-600"
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
                      backgroundColor: "rgb(255, 255, 255)", // Tailwind: dark:bg-gray-800
                      borderColor: state.isFocused
                        ? "#14b8a6"
                        : "rgb(75 85 99)", // Tailwind: focus:border-teal-500, dark:border-gray-600
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
            {/* NEW FIELD: Product Option Show/Hide */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                // {...register("productOptionShowHide")}
                // value="1"
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
                      backgroundColor: "rgb(255, 255, 255)", // Tailwind: dark:bg-gray-800
                      borderColor: state.isFocused
                        ? "#14b8a6"
                        : "rgb(75 85 99)", // Tailwind: focus:border-teal-500, dark:border-gray-600
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

            <select
              {...register("condition", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            >
              <option value="">Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="old">Old</option>
            </select>
          </div>
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
                    height: 200,
                    menubar: false,
                    plugins: "link image code",
                    toolbar:
                      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
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
                    height: 200,
                    menubar: false,
                    plugins: "link image code",
                    toolbar:
                      "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                />
              )}
            />

            {/* <textarea
              {...register("warrantyInfo")}
              placeholder="Warranty Information"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            /> */}
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
const inputClass = `block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 text-sm bg-white dark:bg-gray-800 dark:text-white`;
const style = document.createElement("style");
style.innerHTML = `.input { ${inputClass} }`;
document.head.appendChild(style);
