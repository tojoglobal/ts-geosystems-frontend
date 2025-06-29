import React, { useState, useEffect } from "react";
import {
  Edit,
  Eye,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Dialog, Transition } from "@headlessui/react";
import PremiumProductViewModal from "./ProductViewModal";
import PremiumProductTable from "./PremiumProductTable";

const ProductTable = () => {
  const axiosPublicUrl = useAxiospublic();
  const [viewProduct, setViewProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const {
    data: productData = {},
    isLoading: productsLoading,
    refetch,
  } = useDataQuery(
    ["products", currentPage, itemsPerPage, search],
    `/api/products-table?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(
      search
    )}`,
    true
  );

  const { products = [], total = 0, totalPages = 1 } = productData;

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
          timer: 4000,
        });
        refetch();
      } catch (err) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: err.message || "Something went wrong.",
          timer: 4000,
        });
      }
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
    setIsModalOpen(true);
  };

  // Modal helpers
  const getCategoryName = (id) => {
    try {
      const converparse = JSON.parse(id);
      return converparse.cat || "N/A";
    } catch {
      return "N/A";
    }
  };

  const getSubCategoryName = (id) => {
    try {
      const converparse = JSON.parse(id);
      return converparse.slug || "N/A";
    } catch {
      return "N/A";
    }
  };

  const getBrandName = (id) => id || "N/A";

  // Pagination helpers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 cursor-pointer py-1 rounded ${
            1 === currentPage
              ? "bg-teal-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 cursor-pointer py-1 rounded ${
            i === currentPage
              ? "bg-teal-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded ${
            totalPages === currentPage
              ? "bg-teal-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text-xl md:text-2xl font-bold">Products List</h1>
        <div className="flex items-center gap-4">
          <div className="text-gray-300 text-md font-semibold">
            Total Products:{" "}
            <span className="text-teal-400 font-bold">{total}</span>
          </div>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-500 px-3 py-1 focus:outline-none rounded text-gray-900 w-72"
          />
          <Link
            to="/dashboard/add-product"
            className="bg-teal-600 text-white py-1.5 px-4 rounded-sm hover:bg-teal-700 transition duration-200 text-center w-full sm:w-auto"
          >
            Add Product
          </Link>
        </div>
      </div>
      <PremiumProductTable
        products={products}
        productsLoading={productsLoading}
        getCategoryName={getCategoryName}
        getSubCategoryName={getSubCategoryName}
        getBrandName={getBrandName}
        handleDelete={handleDelete}
        handleView={handleView}
      />
      {/* <div className="overflow-x-auto border border-gray-700">
        <table className="w-full text-sm text-left text-white min-w-[800px]">
          <thead className="text-sm uppercase bg-gray-800 text-gray-200">
            <tr>
              <th className="px-3 md:px-4 py-2">Product Name</th>
              <th className="px-3 md:px-4 py-2">Price ৳</th>
              <th className="px-3 md:px-4 py-2">Category</th>
              <th className="px-3 md:px-4 py-2">Sub Category</th>
              <th className="px-3 md:px-4 py-2">SKU</th>
              <th className="px-3 md:px-4 py-2">Condition</th>
              <th className="px-3 md:px-4 py-2">Brand</th>
              <th className="px-3 md:px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsLoading ? (
              <tr>
                <td
                  colSpan="8"
                  className="bg-gray-800 text-center p-4 text-white"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
                </td>
              </tr>
            ) : products && products.length > 0 ? (
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
                  <td className="py-4 px-4 flex justify-center items-center gap-2 md:flex-row">
                    <Link to={`/dashboard/update-product/${product.id}`}>
                      <button className="text-green-400 cursor-pointer bg-green-900 p-1 rounded hover:bg-green-800">
                        <Edit size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 cursor-pointer bg-red-900 p-1 rounded hover:bg-red-800"
                    >
                      <Trash size={16} />
                    </button>
                    <button
                      onClick={() => handleView(product)}
                      title="View"
                      className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                    >
                      <Eye size={16} />
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
      </div> */}
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, total)} of {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">{renderPageNumbers()}</div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
      {/* View Modal */}
      <PremiumProductViewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        viewProduct={viewProduct}
        getCategoryName={getCategoryName}
        getSubCategoryName={getSubCategoryName}
        getBrandName={getBrandName}
      />
    </div>
  );
};

export default ProductTable;
