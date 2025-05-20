import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useDataQuery from "../../utils/useDataQuery";
// import Categor from "./redux";

const generateSlug = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const Categories = () => {
  const axiosPublicurl = useAxiospublic();
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviewSubCatergory, setImagePreviewSubCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  // Using the useDataQuery hook for categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useDataQuery(["categories"], "/api/category");

  // Using the useDataQuery hook for subcategories
  const {
    data: subCategoriesData = [],
    isLoading: isLoadingSubCategories,
    error: subCategoriesError,
    refetch: refetchSubCategories,
  } = useDataQuery(["subcategories"], "/api/subcategory");

  const subCategories = subCategoriesData?.subcategories || [];
  const mainCategories = categories?.categories || [];

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

  const addCategory = async (data) => {
    console.log(data);
    console.log("Submitted photo field:", data.photo);

    const duplicateOrder = mainCategories.some(
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
      } else {
        await axiosPublicurl.post("/api/category", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setImagePreview(null);
      resetCategory();
      document.querySelector('input[type="file"]').value = null;
      refetchCategories(); // Refetch categories after update
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
        setEditingSubCategory(null);
      } else {
        await axiosPublicurl.post("/api/subcategory", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      resetSubCategory();
      setImagePreviewSubCategory(null);
      refetchSubCategories(); // Refetch subcategories after update
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

  // const confirmDelete = (type, id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       if (type === "category") {
  //         await axiosPublicurl.delete(`/api/category/${id}`);
  //         Swal.fire("Deleted!", "Your category has been deleted.", "success");
  //         setCategories(categories.filter((c) => c.id !== id));
  //       } else {
  //         await axiosPublicurl.delete(`/api/subcategory/${id}`);
  //         Swal.fire(
  //           "Deleted!",
  //           "Your subcategory has been deleted.",
  //           "success"
  //         );
  //         setSubCategories(subCategories.filter((sc) => sc.id !== id));
  //       }
  //       Swal.fire("Deleted!", "Your item has been deleted.", "success");
  //     }
  //   });
  // };

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

  if (isLoadingCategories || isLoadingSubCategories) return null;
  
  if (categoriesError || subCategoriesError) {
    return <div>Error loading data</div>;
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Add Categories & Subcategories
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <form
            onSubmit={handleSubmitCategory(addCategory)}
            className="flex flex-col space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                {...registerCategory("category_name", { required: true })}
                placeholder="Category Name"
                className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
              />
              <input
                value={generateSlug(watchCategoryName)}
                readOnly
                placeholder="Slug"
                className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                {...registerCategory("serialNumber", { required: true })}
                type="number"
                placeholder="Order"
                className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setValueCategory("photo", [file]);
                }}
              />
            </div>
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
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
            />
            <textarea
              {...registerCategory("meta_description")}
              placeholder="Meta Description"
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2 min-h-[100px]"
            ></textarea>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...registerCategory("is_feature")} />
              <span>Is Feature</span>
            </label>
            <input type="hidden" value={1} {...registerCategory("status")} />
            <button
              type="submit"
              className="bg-teal-600 text-white cursor-pointer px-4 py-2 rounded hover:bg-teal-700 w-full sm:w-auto"
            >
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
          </form>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-600 rounded-lg">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-2 sm:p-3 text-left text-sm font-semibold">
                        Category
                      </th>
                      <th className="p-2 sm:p-3 text-left text-sm font-semibold">
                        Order
                      </th>
                      <th className="p-2 sm:p-3 text-left text-sm font-semibold">
                        Image
                      </th>
                      <th className="p-2 sm:p-3 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {mainCategories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="p-2 sm:p-3 whitespace-nowrap text-sm">
                          {cat.category_name}
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap text-sm">
                          {cat.serialNumber}
                        </td>
                        <td className="p-2 sm:p-3">
                          <img
                            src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                              cat.photo
                            }`}
                            alt={cat.category_name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-2 sm:p-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditCategory(cat)}
                              className="text-blue-600 cursor-pointer hover:text-blue-800 p-1"
                            >
                              <FaEdit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Categories Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-2">Sub Categories</h2>
          <form
            onSubmit={handleSubmitSubCategory(addSubCategory)}
            className="flex flex-col space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                {...registerSubCategory("name", { required: true })}
                placeholder="Subcategory Name"
                className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
              />
              <input
                value={generateSlug(watchSubCategoryName || "")}
                readOnly
                placeholder="Slug"
                className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
              />
            </div>
            <select
              {...registerSubCategory("main_category_id", { required: true })}
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
            >
              <option value="">Select Category</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              className="w-full input border border-gray-600 focus:outline-none focus:border-teal-500 focus:ring-teal-500 p-2"
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
            <button
              type="submit"
              className="bg-teal-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-teal-700 w-full sm:w-auto"
            >
              {editingSubCategory ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </form>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-600 rounded-lg">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-2 sm:p-3 text-left text-sm font-semibold">
                        Subcategory
                      </th>
                      <th className="p-2 sm:p-3 text-left text-sm font-semibold">
                        Category
                      </th>
                      <th className="p-2 sm:p-3 text-left text-sm font-semibold">
                        Image
                      </th>
                      <th className="p-2 sm:p-3 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {subCategories.map((sub) => (
                      <tr key={sub.id}>
                        <td className="p-2 sm:p-3 whitespace-nowrap text-sm">
                          {sub.name}
                        </td>
                        <td className="p-2 sm:p-3 whitespace-nowrap text-sm">
                          {mainCategories.find(
                            (cat) => cat.id === sub.main_category_id
                          )?.category_name || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3">
                          <img
                            src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                              sub.photo
                            }`}
                            alt={sub.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-2 sm:p-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditSubCategory(sub)}
                              className="text-blue-600 cursor-pointer hover:text-blue-800 p-1"
                            >
                              <FaEdit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
