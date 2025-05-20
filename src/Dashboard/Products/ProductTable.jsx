import React, { useState } from "react";
import Swal from "sweetalert2";
import { Dialog, Transition } from "@headlessui/react";
import { FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ProductTable = () => {
  const axiosPublicUrl = useAxiospublic();
  const [viewProduct, setViewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products
  const {
    data,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useDataQuery(["products"], "/api/products");
  const products = data?.products || [];

  // Fetch categories
  const { data: categoryData, isLoading: categoriesLoading } = useDataQuery(
    ["categories"],
    "/api/category"
  );
  const productCategory = categoryData?.categories || [];

  // Fetch subcategories
  const { data: subcategoryData, isLoading: subcategoriesLoading } =
    useDataQuery(["subcategories"], "/api/subcategory");
  const productSubCategory = subcategoryData?.subcategories || [];

  // Fetch brands
  const { data: brandsData, isLoading: brandsLoading } = useDataQuery(
    ["brands"],
    "/api/brands"
  );
  const productBrands = brandsData || [];

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosPublicUrl.delete(`/api/products/${id}`);
        Swal.fire({
          title: "Deleted",
          text: "Your product has been deleted.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
        });
        refetchProducts();
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
    setIsModalOpen(true);
  };

  const getCategoryName = (id) => {
    try {
      const converparse = JSON.parse(id);
      return (
        productCategory.find((cat) => cat.id === converparse.id)
          ?.category_name || "N/A"
      );
    } catch {
      return "N/A";
    }
  };

  const getSubCategoryName = (id) => {
    try {
      const converparse = JSON.parse(id);
      return (
        productSubCategory.find((sub) => sub.id === converparse.id)?.name ||
        "N/A"
      );
    } catch {
      return "N/A";
    }
  };

  const getBrandName = (id) => {
    return (
      productBrands.find((brand) => brand.slug === id)?.brands_name || "N/A"
    );
  };

  if (
    productsLoading ||
    categoriesLoading ||
    subcategoriesLoading ||
    brandsLoading
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Products List</h1>
        <Link
          to="/dashboard/add-product"
          className="bg-teal-600 text-white py-1.5 px-4 rounded-sm hover:bg-teal-700 transition duration-200 text-center w-full sm:w-auto"
        >
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto border border-gray-700">
        <table className="w-full text-sm text-left text-white min-w-[800px]">
          <thead className="text-xs uppercase bg-gray-800 text-gray-200">
            <tr>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Price ৳</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Sub Category</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Condition</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-gray-900 border-b border-gray-700"
                >
                  <td className="py-4 px-4 sm:px-6">{product.product_name}</td>
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    ৳ {product.price}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    {getCategoryName(product.category)}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    {getSubCategoryName(product.sub_category)}
                  </td>
                  <td className="py-4 px-4 sm:px-6">{product.sku}</td>
                  <td className="py-4 px-4 sm:px-6">
                    {product.product_condition}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    {getBrandName(product.brand_name)}
                  </td>
                  <td className="py-4 px-4 sm:px-6 flex justify-center items-center gap-3 md:flex-row">
                    <Link to={`/dashboard/update-product/${product.id}`}>
                      <button className="text-blue-400 cursor-pointer hover:text-blue-600">
                        <FaEdit size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(product.id, product.image_urls)
                      }
                      className="text-red-400 cursor-pointer hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                    <button
                      onClick={() => handleView(product)}
                      className="text-green-400 cursor-pointer hover:text-green-600"
                      title="View"
                    >
                      <FaEye size={19} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="bg-gray-800 text-center p-4 text-white"
                >
                  No Product found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Improved Modal using Headless UI */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-start">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white"
                    >
                      {viewProduct?.product_name}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 cursor-pointer hover:text-white"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>
                  {viewProduct && (
                    <div className="mt-4 space-y-4 text-sm text-gray-200">
                      <p>
                        <strong className="text-gray-300">Price:</strong> ৳{" "}
                        {viewProduct.price}
                      </p>
                      <p>
                        <strong className="text-gray-300">Category:</strong>{" "}
                        {getCategoryName(viewProduct.category)}
                      </p>
                      <p>
                        <strong className="text-gray-300">Sub Category:</strong>{" "}
                        {getSubCategoryName(viewProduct.sub_category)}
                      </p>
                      <p>
                        <strong className="text-gray-300">SKU:</strong>{" "}
                        {viewProduct.sku}
                      </p>
                      <p>
                        <strong className="text-gray-300">Condition:</strong>{" "}
                        {viewProduct.product_condition}
                      </p>
                      <p>
                        <strong className="text-gray-300">Brand:</strong>{" "}
                        {getBrandName(viewProduct.brand_name)}
                      </p>
                      <div>
                        <strong className="text-gray-300">Overview:</strong>
                        <article
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              viewProduct.product_overview
                            ),
                          }}
                          className="prose max-w-none prose-sm sm:prose-base leading-relaxed bg-gray-700 text-white p-3 rounded mt-2"
                        />
                      </div>
                      <div>
                        <strong className="text-gray-300">
                          Warranty Info:
                        </strong>
                        <article
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              viewProduct.warranty_info
                            ),
                          }}
                          className="prose max-w-none prose-sm sm:prose-base leading-relaxed bg-gray-700 text-white p-3 rounded mt-2"
                        />
                      </div>
                      {viewProduct.video_urls && (
                        <p>
                          <strong className="text-gray-300">Video:</strong>{" "}
                          <a
                            href={viewProduct.video_urls}
                            className="text-blue-400 hover:text-blue-300"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Watch Video
                          </a>
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
                        {Array.isArray(viewProduct.image_urls) &&
                          viewProduct.image_urls.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Product"
                              className="rounded-md object-cover h-32 w-full border border-gray-600"
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductTable;
