import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const Categorys = () => {
  const axiosPublicurl = useAxiospublic();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviewSubCatergory, setImagePreviewSubCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    watch: watchCategory,
    reset: resetCategory,
    setValue: setValueCategory,
  } = useForm();

  const {
    register: registerSubCategory,
    handleSubmit: handleSubmitSubCategory,
    watch: watchSubCategory,
    reset: resetSubCategory,
    setValue: setValueSubCategory,
  } = useForm();

  const watchCategoryName = watchCategory("category_name", "");
  //   const watchSerialNumber = watchCategory("serialNumber", "");
  // const watchImage = watchCategory("photo");
  const watchSubCategoryName = watchSubCategory("name", "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPublicurl.get("/api/category");
        setCategories(response.data?.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [axiosPublicurl]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axiosPublicurl.get("/api/subcategory");
        setSubCategories(response.data?.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, [axiosPublicurl]);

  const addCategory = async (data) => {
    console.log(data);
    console.log("Submitted photo field:", data.photo);

    const duplicateOrder = categories.some(
      (cat) =>
        cat.serialNumber === parseInt(data.serialNumber) &&
        cat.id !== (editingCategory?.id ?? -1)
    );
    if (duplicateOrder) {
      Swal.fire("Warning", "This order number is already used.", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category_name", data.category_name);
      formData.append("serialNumber", data.serialNumber);
      formData.append("slug_name", generateSlug(data.category_name));
      formData.append("metaKeyword", data.metaKeyword || "");
      formData.append("meta_description", data.meta_description || "");
      formData.append("status", data.status ?? 1);
      formData.append("is_feature", data.is_feature ? 1 : 0);
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      if (editingCategory) {
        console.log(editingCategory.id);
        await axiosPublicurl.put(
          `/api/category/${editingCategory.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, ...data } : cat
          )
        );
      } else {
        const response = await axiosPublicurl.post("/api/category", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("API Response:", response.data);
        setCategories([...categories, { ...data, id: response.data.id }]);
      }
      setImagePreview(null);
      resetCategory();
      document.querySelector('input[type="file"]').value = null;
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const addSubCategory = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", generateSlug(data.name));
      formData.append("main_category_id", data.main_category_id);
      formData.append("status", data.status ?? 1);
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      if (editingSubCategory) {
        await axiosPublicurl.put(
          `/api/subcategory/${editingSubCategory.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSubCategories((prev) =>
          prev.map((sc) =>
            sc.id === editingSubCategory.id ? { ...sc, ...data } : sc
          )
        );
        setEditingSubCategory(null);
      } else {
        const response = await axiosPublicurl.post(
          "/api/subcategory",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSubCategories([...subCategories, { ...data, id: Date.now() }]);
        console.log("API Response:", response.data);
      }
      resetSubCategory();
      setImagePreviewSubCategory(null);
    } catch (err) {
      console.error("Error saving subcategory:", err);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setValueCategory("category_name", cat.category_name);
    setValueCategory("serialNumber", cat.serialNumber);
    setValueCategory("metaKeyword", cat.metaKeyword);
    setValueCategory("meta_description", cat.meta_description);
    setValueCategory("is_feature", !!cat.is_feature);
  };

  const handleEditSubCategory = (sub) => {
    setEditingSubCategory(sub);
    setValueSubCategory("name", sub.name);
    setValueSubCategory("main_category_id", sub.main_category_id);
  };

  const confirmDelete = (type, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (type === "category") {
          await axiosPublicurl.delete(`/api/category/${id}`);
          Swal.fire("Deleted!", "Your category has been deleted.", "success");
          setCategories(categories.filter((c) => c.id !== id));
        } else {
          await axiosPublicurl.delete(`/api/subcategory/${id}`);
          Swal.fire(
            "Deleted!",
            "Your subcategory has been deleted.",
            "success"
          );
          setSubCategories(subCategories.filter((sc) => sc.id !== id));
        }
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    const subscription = watchCategory((value, { name }) => {
      if (name === "photo" && value.photo && value.photo[0]) {
        const file = value.photo[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    });
    return () => subscription.unsubscribe();
  }, [watchCategory]);

  useEffect(() => {
    const subscription = watchSubCategory((value, { name }) => {
      if (name === "photo" && value.photo && value.photo[0]) {
        const file = value.photo[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewSubCategory(reader.result);
        };
        reader.readAsDataURL(file);
      }
    });
    return () => subscription.unsubscribe();
  }, [watchSubCategory]);

  return (
    <div className="min-h-screen bg-[#f1f4ff] dark:bg-gray-800 p-4 text-gray-900 dark:text-gray-100">
      <h2 className="text-xl font-bold mb-4">Add Categories & Subcategories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-base font-bold mb-2">Categories</h2>
          <form
            onSubmit={handleSubmitCategory(addCategory)}
            className="space-y-4"
          >
            <input
              {...registerCategory("category_name", { required: true })}
              placeholder="Category Name"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <input
              value={generateSlug(watchCategoryName)}
              readOnly
              placeholder="Slug"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <input
              {...registerCategory("serialNumber", { required: true })}
              type="number"
              placeholder="Order"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <input
              type="file"
              accept="image/*"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
              onChange={(e) => {
                const file = e.target.files[0];
                setValueCategory("photo", [file]);
              }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <input
              {...registerCategory("metaKeyword")}
              placeholder="Meta Keywords comma separated"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <textarea
              {...registerCategory("meta_description")}
              placeholder="Meta Description"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            ></textarea>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...registerCategory("is_feature")} />
              <span>Is Feature</span>
            </label>
            <input type="hidden" value={1} {...registerCategory("status")} />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
          </form>

          <table className="w-full mt-6 border dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Image</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t dark:border-gray-600">
                  <td className="p-2">{cat.category_name}</td>
                  <td className="p-2">{cat.serialNumber}</td>
                  <td className="p-2">
                    <img
                      src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                        cat.photo
                      }`}
                      alt={cat.category_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 space-x-2 text-center">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="text-blue-600 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    {/* <button
                      onClick={() => confirmDelete("category", cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      <FaTrash />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* sub category */}
        <div>
          <h2 className="text-base font-bold mb-2">Sub Categories</h2>
          <form
            onSubmit={handleSubmitSubCategory(addSubCategory)}
            className="space-y-4"
          >
            <input
              {...registerSubCategory("name", { required: true })}
              placeholder="Subcategory Name"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <input
              value={generateSlug(watchSubCategoryName || "")}
              readOnly
              placeholder="Slug"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            />
            <select
              {...registerSubCategory("main_category_id", { required: true })}
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              className="input border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-teal-500 focus:dark:border-teal-500"
              onChange={(e) => {
                const file = e.target.files[0];
                setValueSubCategory("photo", [file]);
              }}
            />
            {imagePreviewSubCatergory && (
              <img
                src={imagePreviewSubCatergory}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <input type="hidden" value={1} {...registerSubCategory("status")} />
            <br />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              {editingSubCategory ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </form>

          <table className="w-full mt-6 border dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 text-left">Subcategory</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2">Image</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((sub) => (
                <tr key={sub.id} className="border-t dark:border-gray-600">
                  <td className="p-2">{sub.name}</td>
                  <td className="p-2">
                    {categories.find((cat) => cat.id === sub.main_category_id)
                      ?.category_name || "N/A"}
                  </td>
                  <td className="p-2">
                    <img
                      src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                        sub.photo
                      }`}
                      alt={sub.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 space-x-2 text-center">
                    <button
                      onClick={() => handleEditSubCategory(sub)}
                      className="text-blue-600 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    {/* <button
                      onClick={() => confirmDelete("subcategory", sub.id)}
                      className="text-red-600 hover:underline"
                    >
                      <FaTrash />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categorys;
