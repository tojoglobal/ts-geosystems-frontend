import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Link } from "react-router-dom";

Modal.setAppElement("#root"); // Important for accessibility

const ProductTable = () => {
  const axiosPublicUrl = useAxiospublic();
  const [products, setProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/products/${id}`, { data: { imageUrls } }); // 🔥 Pass image URLs for unlink
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
        fetchProducts(); // Refresh after delete
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

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Products List
      </h1>
      <div className="overflow-x-auto">
        <div className="flex justify-end mb-3">
          <Link to="/dashboard/add-product">
            <button className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-200">
              Add Product
            </button>
          </Link>
        </div>

        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-3 px-6">Product Name</th>
              <th className="py-3 px-6">Category</th>
              <th className="py-3 px-6">Sub Category</th>
              <th className="py-3 px-6">SKU</th>
              <th className="py-3 px-6">Condition</th>
              <th className="py-3 px-6">Brand</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="py-4 px-6">{product.product_name}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">{product.sub_category}</td>
                  <td className="py-4 px-6">{product.sku}</td>
                  <td className="py-4 px-6">{product.product_condition}</td>
                  <td className="py-4 px-6">{product.brand_name}</td>
                  <td className="py-4 px-6 flex justify-center items-center gap-4">
                    <Link to={`/dashboard/update-product/${product.id}`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaEdit size={18} />
                      </button>
                    </Link>
                    {/* <button
                      onClick={() => handleEdit(product.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit size={18} />
                    </button> */}
                    <button
                      onClick={() =>
                        handleDelete(product.id, product.image_urls)
                      }
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash size={18} />
                    </button>
                    <button
                      onClick={() => handleView(product)}
                      className="text-green-500 hover:text-green-700"
                      title="View"
                    >
                      <FaEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="bg-gray-300 dark:bg-gray-50 dark:text-black text-center p-4"
                >
                  No Product found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for View Product */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Product Details"
        className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-lg max-w-2xl mx-auto my-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {viewProduct && (
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              {viewProduct.product_name}
            </h2>
            <p>
              <strong>Category:</strong> {viewProduct.category}
            </p>
            <p>
              <strong>Sub Category:</strong> {viewProduct.sub_category}
            </p>
            <p>
              <strong>SKU:</strong> {viewProduct.sku}
            </p>
            <p>
              <strong>Condition:</strong> {viewProduct.product_condition}
            </p>
            <p>
              <strong>Brand:</strong> {viewProduct.brand_name}
            </p>
            <p>
              <strong>Overview:</strong> {viewProduct.product_overview}
            </p>
            <p>
              <strong>Warranty Info:</strong> {viewProduct.warranty_info}
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
            {/* Images */}
            <div className="grid grid-cols-2 gap-4 mt-4">
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
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
