/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

Modal.setAppElement("#root"); // Important for accessibility

const ProductTable = () => {
  const axiosPublicUrl = useAxiospublic();
  const [products, setProducts] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [productSubCategory, setProductSubCategory] = useState([]);
  const [productBrands, setProductBrans] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // fetch the product category
  useEffect(() => {
    const fetchProductCategory = async () => {
      try {
        const res = await axiosPublicUrl.get("/api/category");
        setProductCategory(res.data?.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductCategory();
  }, []);
  // fetch the product subcategory
  useEffect(() => {
    const fetchProductCategory = async () => {
      try {
        const res = await axiosPublicUrl.get("/api/subcategory");
        setProductSubCategory(res.data?.subcategories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductCategory();
  }, []);

  // fetch the product Brand name
  useEffect(() => {
    const fetchProductCategory = async () => {
      try {
        const res = await axiosPublicUrl.get("/api/brands");
        setProductBrans(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductCategory();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosPublicUrl.get("/api/products");
      setProducts(res.data?.products);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, imageUrls) => {
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
        await axios.delete(`/api/products/${id}`, { data: { imageUrls } }); // 🔥 Pass image URLs for unlink
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
        fetchProducts();
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
  // console.log(products);
  // console.log(viewProduct);

  const getCategoryName = (id) => {
    const converparse = JSON.parse(id);
    return (
      productCategory.find((cat) => cat.id === converparse.id)?.category_name ||
      "N/A"
    );
  };

  const getSubCategoryName = (id) => {
    const converparse = JSON.parse(id);
    return (
      productSubCategory.find((sub) => sub.id === converparse.id)?.name || "N/A"
    );
  };
  const getBrandName = (id) => {
    return (
      productBrands.find((brand) => brand.slug === id)?.brands_name || "N/A"
    );
  };

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
      <div className="overflow-x-auto">
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Product Details"
        className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-md shadow-lg w-[95%] sm:w-full max-w-2xl mx-auto my-10 max-h-[90vh] overflow-y-auto text-white"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
      >
        {viewProduct && (
          <div className="space-y-4 text-sm sm:text-base">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {viewProduct.product_name}
            </h2>
            <p>
              <strong>Price:</strong> ৳ {viewProduct.price}
            </p>
            <p>
              <strong>Category:</strong> {getCategoryName(viewProduct.category)}
            </p>
            <p>
              <strong>Sub Category:</strong>{" "}
              {getSubCategoryName(viewProduct.sub_category)}
            </p>
            <p>
              <strong>SKU:</strong> {viewProduct.sku}
            </p>
            <p>
              <strong>Condition:</strong> {viewProduct.product_condition}
            </p>
            <p>
              <strong>Brand:</strong> {getBrandName(viewProduct.brand_name)}
            </p>
            <div>
              <strong>Overview:</strong>
              <article
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(viewProduct.product_overview),
                }}
                className="prose max-w-none prose-sm sm:prose-base leading-relaxed bg-white text-black p-2"
              ></article>
            </div>
            <p>
              <strong>Warranty Info:</strong>
              <article
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(viewProduct.warranty_info),
                }}
                className="prose max-w-none prose-sm sm:prose-base leading-relaxed text-white"
              ></article>
            </p>
            {viewProduct.video_urls && (
              <p>
                <strong>Video:</strong>{" "}
                <a
                  href={viewProduct.video_urls}
                  className="text-blue-500"
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
                    className="rounded-md object-cover h-32 w-full"
                  />
                ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductTable;
