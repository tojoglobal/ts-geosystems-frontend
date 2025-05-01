/* eslint-disable no-useless-escape */
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/AddToCart/AddToCart";

const sortOptions = [
  "FEATURED ITEMS",
  "NEWEST ITEMS",
  "BEST SELLING",
  "A TO Z",
  "Z TO A",
  "BY REVIEW",
  "PRICE: ASCENDING",
  "PRICE: DESCENDING",
];

const CategoryProduct = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("FEATURED ITEMS");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  // console.log(hoveredProductId);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareItems, setCompareItems] = useState([]);
  const navigate = useNavigate();
  const { category, subcategory } = useParams();
  const productsPerPage = 8;

  const { data: productsData = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/products");
      return res?.data?.products;
    },
  });

  const handleAddToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parseFloat(product.price),
      quantity: 1,
      // image: product.image_urls, /
      // optional, if you want to display it in cart
    };
    dispatch(addToCart(itemToAdd));
    Swal.fire({
      title: "Added to Cart",
      text: `${product.product_name} has been added to your cart.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Filter products based on category and subcategory
  const filteredProducts = productsData.filter((product) => {
    try {
      const productCategory = JSON.parse(product.category);
      const productSubCategory = JSON.parse(product.sub_category);

      if (subcategory) {
        return (
          productCategory.cat === category &&
          productSubCategory.slug === subcategory
        );
      } else {
        return productCategory.cat === category;
      }
    } catch (error) {
      console.error("Error parsing category/subcategory:", error);
      return false;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const toggleCompare = (productId) => {
    setCompareItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCompareSelected = () => {
    if (compareItems.length < 2) {
      Swal.fire({
        title: "Comparison Error",
        text: "You must select at least two products to compare",
        icon: "error",
        confirmButtonColor: "#e62245",
        confirmButtonText: "OK",
      });
    } else {
      const sortedIds = [...compareItems].sort((a, b) => a - b);
      navigate(`/compare/${sortedIds.join(",")}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span>{category}</span>
        {subcategory && (
          <>
            <span>/</span>
            <span className="text-[#e62245]">{subcategory}</span>
          </>
        )}
      </div>
      <h1 className="text-4xl font-bold mb-6">
        {subcategory ? subcategory.toUpperCase() : category.toUpperCase()}
      </h1>
      <section>
        <div className="flex items-center justify-between md:justify-normal md:gap-52 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 ${
                viewMode === "grid"
                  ? "bg-[#e62245] text-white rounded-sm"
                  : "text-gray-600 border"
              }`}
            >
              <BsGrid3X3GapFill size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 ${
                viewMode === "list"
                  ? "bg-[#e62245] text-white rounded-sm"
                  : "text-black border"
              }`}
            >
              <FaThList size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-1 rounded-sm pr-16 appearance-none bg-white cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          } gap-6`}
        >
          {currentProducts.map((product) => {
            // Parse image URLs
            let imageUrl = "";
            try {
              const images = JSON.parse(product.image_urls);
              const firstImage = images[0] || "";
              const cleanImagePath = firstImage.replace(/^["\[]+|["\]]+$/g, "");
              imageUrl = `${import.meta.env.VITE_OPEN_APIURL}${cleanImagePath}`;
            } catch (error) {
              console.log("Error parsing image URLs:", error);
              const cleanImagePath = (product.image_urls || "").replace(
                /^["\[]+|["\]]+$/g,
                ""
              );
              imageUrl = `${import.meta.env.VITE_OPEN_APIURL}${cleanImagePath}`;
            }

            return (
              <div
                key={product.id}
                className={`${
                  viewMode === "list" ? "flex gap-6 p-4" : "p-4"
                } relative`}
              >
                <div
                  className={`absolute ${
                    viewMode === "list" ? "top-5 left-52" : "top-4 right-4"
                  } bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm`}
                >
                  SALE
                </div>
                <Link to={`/products/${product.id}`}>
                  <div
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    <img
                      src={imageUrl}
                      alt={product.product_name}
                      className="w-full h-72 object-contain transition-all duration-300 ease-in-out"
                    />
                  </div>
                </Link>
                <div
                  className={`${
                    viewMode === "list"
                      ? "w-3/4 flex flex-col justify-between"
                      : "space-y-2 border-t pt-2"
                  }`}
                >
                  <div>
                    <div className="text-xs text-gray-600">
                      {product.brand_name} | Sku: {product.sku}
                    </div>
                    <Link to={`/products/${product.id}`}>
                      <h3
                        className={`${
                          viewMode === "list"
                            ? "text-2xl text-[#545454]"
                            : "text-[#54546f] text-lg"
                        } font-medium hover:text-[#e62245] cursor-pointer`}
                      >
                        {product.product_name}
                    </h3>
                    </Link>
                    {viewMode === "list" && (
                      <p className="text-sm text-[#2f2f2b] mt-2 line-clamp-4">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: product.product_overview,
                          }}
                        />
                      </p>
                    )}
                  </div>
                  <div className="mt-auto">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-lg">
                          {viewMode === "list" && "Price"} £
                          {parseFloat(product.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 underline">
                          (Ex. VAT)
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                        {viewMode === "list" && (
                          <p className="text-[#2f2f2b] text-lg font-semibold">
                            Price:
                          </p>
                        )}
                        £{(parseFloat(product.price) * 1.2).toFixed(2)}
                        <span className="underline">(Inc. VAT)</span>
                      </div>
                    </div>
                    <div
                      className={`flex gap-4 mt-4 ${
                        viewMode === "list" ? "flex-row" : "flex-col"
                      }`}
                    >
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#e62245] uppercase text-white px-6 py-2 hover:bg-[#d41d3f] transition-colors duration-200 text-sm font-semibold rounded-sm"
                      >
                        Add to Cart
                      </button>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`compare-${product.id}`}
                          className="accent-[#0075ff]"
                          checked={compareItems.includes(product.id)}
                          onChange={() => toggleCompare(product.id)}
                        />
                        <label
                          htmlFor={`compare-${product.id}`}
                          className="text-sm cursor-pointer"
                        >
                          COMPARE
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
            >
              ← Previous
            </button>
          )}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`border px-3 py-1 rounded text-sm ${
                  currentPage === idx + 1 ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
          >
            Next →
          </button>
        )}
      </div>
      {/* Compare Selected Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCompareSelected}
          className={`${
            compareItems.length >= 2
              ? "bg-[#e62245] hover:bg-[#d41d3f] text-white"
              : "bg-gray-200 hover:bg-gray-300"
          } text-xs font-semibold px-6 py-2 rounded transition-colors`}
        >
          COMPARE SELECTED
        </button>
      </div>
    </div>
  );
};

export default CategoryProduct;
