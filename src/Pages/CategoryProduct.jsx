/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/AddToCart/AddToCart";
import { slugify } from "../utils/slugify";
import { parsePrice } from "../utils/parsePrice";
import { useBreadcrumbLabel } from "../utils/useBreadcrumbLabel";
import { useTrackProductView } from "../Hooks/useTrackProductView";
import { getProductType } from "../utils/productOption";

const sortOptions = [
  { label: "NEWEST ITEMS", value: "newest" },
  { label: "PRICE: ASCENDING", value: "price_asc" },
  { label: "PRICE: DESCENDING", value: "price_desc" },
  { label: "A TO Z", value: "name_asc" },
  { label: "Z TO A", value: "name_desc" },
  // Remove or comment out these until you implement them:
  // { label: "BEST SELLING", value: "best_selling" },
  // { label: "BY REVIEW", value: "by_review" },
];

const CategoryProduct = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const { trackProductView } = useTrackProductView();
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [viewMode, setViewMode] = useState("grid");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareItems, setCompareItems] = useState([]);
  const navigate = useNavigate();
  const { category, subcategory } = useParams();
  const productsPerPage = 8;

  // const isShopAll = category === "shop-all";
  // Replace the current useQuery with this:
  const { data: productsData = {}, isLoading } = useQuery({
    queryKey: ["products", category, subcategory, currentPage, sortBy],
    queryFn: async () => {
      const endpoint =
        category === "shop-all"
          ? "/api/shop-all/product"
          : subcategory
          ? `/api/category-products/${category}/${subcategory}`
          : `/api/category-products/${category}`;

      const res = await axiosPublicUrl.get(endpoint, {
        params: {
          page: currentPage,
          limit: productsPerPage,
          sortBy: sortBy.value, // Use the value from the sortOptions
        },
      });
      return res?.data;
    },
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when sort changes
  }, [sortBy]);

  // Destructure the response
  const { products = [], total = 0, totalPages = 1 } = productsData;

  const handleAddToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parsePrice(product.price),
      quantity: 1,
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

  const label = useBreadcrumbLabel(category);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-1 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/${category}`}
          className={`${
            subcategory ? "hover:text-[#e62245]" : "text-[#e62245]"
          } capitalize`}
        >
          {label}
        </Link>
        {subcategory && (
          <>
            <span>/</span>
            <Link
              to={`/${category}/${subcategory}`}
              className="text-[#e62245] capitalize"
            >
              {subcategory}
            </Link>
          </>
        )}
      </div>
      <h1 className="text-xl md:text-3xl font-bold mb-4">
        {(subcategory || category).replace(/-/g, " ").toUpperCase()}
      </h1>
      <section>
        <div className="flex items-center justify-between md:justify-normal md:gap-52 mb-6">
          {/* View Mode Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#e62245] text-white rounded-sm"
                  : "text-gray-600 border"
              }`}
            >
              <BsGrid3X3GapFill size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#e62245] text-white rounded-sm"
                  : "text-black border"
              }`}
            >
              <FaThList size={20} />
            </button>
          </div>
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs">Sort By:</label>
            <div className="relative">
              <select
                value={sortBy.value}
                onChange={(e) => {
                  const selectedOption = sortOptions.find(
                    (opt) => opt.value === e.target.value
                  );
                  setSortBy(selectedOption);
                }}
                className="border py-1 pl-2 text-xs border-[#e1dcdc] rounded-[3px] md:pr-36 appearance-none bg-white cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Products Grid/List */}
        <div
          className={`grid mx-5 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-stretch"
              : "grid-cols-1 gap-7"
          } gap-4`}
        >
          {products?.map((product) => {
            const { isSimpleProduct } = getProductType(product);
            let images = [];
            try {
              images = JSON.parse(product.image_urls);
            } catch (e) {
              images = [product.image_urls];
            }

            const firstImage = images[0]
              ? `${import.meta.env.VITE_OPEN_APIURL}${images[0].replace(
                  /^["\[]+|["\]]+$/g,
                  ""
                )}`
              : "";
            const secondImage = images[1]
              ? `${import.meta.env.VITE_OPEN_APIURL}${images[1].replace(
                  /^["\[]+|["\]]+$/g,
                  ""
                )}`
              : firstImage;

            const isHovered = hoveredProductId === product.id;
            const displayImage = isHovered ? secondImage : firstImage;
            return (
              <div
                key={product.id}
                className={`relative ${
                  viewMode === "list"
                    ? "flex flex-col lg:flex-row gap-8"
                    : "flex flex-col h-full"
                }`}
              >
                {/* SALE badge */}
                {product?.sale === 1 && (
                  <div
                    className={`absolute ${
                      viewMode === "list"
                        ? "top-3 left-64 md:left-[267px]"
                        : "-top-1 right-4"
                    } bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm`}
                  >
                    SALE
                  </div>
                )}
                {viewMode === "list" ? (
                  <Link
                    onClick={() => trackProductView(product.id)}
                    to={`/products/${product.id}/${slugify(
                      product.product_name || ""
                    )}`}
                    className="w-full md:w-1/3"
                  >
                    <div
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      <img
                        src={displayImage}
                        alt={product.product_name}
                        className="w-full h-64 object-contain transition-all duration-300 ease-in-out"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="w-full h-56 flex items-center justify-center bg-white">
                    <Link
                      onClick={() => trackProductView(product.id)}
                      to={`/products/${product.id}/${slugify(
                        product.product_name || ""
                      )}`}
                      className="w-full h-full"
                    >
                      <div
                        onMouseEnter={() => setHoveredProductId(product.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                        className="w-full h-full flex items-center justify-center transition-opacity duration-500 ease-in-out"
                      >
                        <img
                          src={displayImage}
                          alt={product.product_name}
                          className="w-auto h-56 object-contain transition-opacity duration-500 ease-in-out"
                        />
                      </div>
                    </Link>
                  </div>
                )}
                {/* Product Details - Different structure for list vs grid */}
                {viewMode === "list" ? (
                  <div className="w-full md:w-2/3 flex flex-col justify-between">
                    <div>
                      {/* <div className="text-xs text-gray-600">
                        {product.brand_name} | Sku: {product.sku}
                      </div> */}
                      <Link
                        onClick={() => trackProductView(product.id)}
                        to={`/products/${product.id}/${slugify(
                          product.product_name || ""
                        )}`}
                      >
                        <h3 className="text-xl text-gray-800 font-medium hover:text-[#e62245] cursor-pointer">
                          {product.product_name}
                        </h3>
                      </Link>
                      {/* with image */}
                      {/* <p className="text-sm text-[#2f2f2b] mt-2">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: `${product.product_overview?.slice(
                              0,
                              400
                            )}${
                              product.product_overview?.length > 400
                                ? "..."
                                : ""
                            }`,
                          }}
                        />
                      </p> */}
                      <p className="text-sm text-[#2f2f2b] mt-2">
                        {`${product.product_overview
                          ?.replace(/<\/?[^>]+(>|$)/g, "")
                          .slice(0, 400)}${
                          product.product_overview?.length > 400 ? "..." : ""
                        }`}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <div className="text-[#2f2f2b] font-semibold">
                          Was: ৳{(parseFloat(product.price) * 1.5).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold">
                            Price ৳{parsePrice(product.price).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 underline">
                            (Ex. VAT)
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                          <p className="text-[#2f2f2b] font-semibold">Price:</p>
                          ৳{(parseFloat(product.price) * 1.2).toFixed(2)}{" "}
                          <span className="underline">(Inc. VAT)</span>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 flex-row">
                        {product?.isStock === 1 && (
                          <div>
                            {isSimpleProduct ? (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                              >
                                ADD TO CART
                              </button>
                            ) : (
                              <Link
                                onClick={() => trackProductView(product.id)}
                                to={`/products/${product.id}/${slugify(
                                  product.product_name || ""
                                )}`}
                                className="w-full block text-center cursor-pointer bg-[#e62245] text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                              >
                                CHOOSE OPTION
                              </Link>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="checkbox"
                            id={`compare-${product.id}`}
                            className="accent-[#0075ff] cursor-pointer"
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
                ) : (
                  <div className="flex flex-col flex-grow border-t mt-4 pt-1">
                    <div className="flex-grow">
                      <div className="pt-2 text-xs text-gray-600 mb-1">
                        {product.brand_name} | Sku: {product.sku}
                      </div>
                      <Link
                        onClick={() => trackProductView(product.id)}
                        to={`/products/${product.id}/${slugify(
                          product.product_name || ""
                        )}`}
                      >
                        <h3 className="text-gray-800 font-medium hover:text-[#e62245] cursor-pointer leading-tight">
                          {product.product_name}
                        </h3>
                      </Link>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-bold">
                          ৳{parsePrice(product.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 underline">
                          (Ex. VAT)
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#b3b3b5] mt-1">
                        ৳{(parseFloat(product.price) * 1.2).toFixed(2)}{" "}
                        <span className="underline">(Inc. VAT)</span>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        {product?.isStock === 1 && (
                          <div>
                            {isSimpleProduct ? (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-[#e62245] w-full cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                              >
                                ADD TO CART
                              </button>
                            ) : (
                              <Link
                                onClick={() => trackProductView(product.id)}
                                to={`/products/${product.id}/${slugify(
                                  product.product_name || ""
                                )}`}
                                className="w-full block text-center cursor-pointer bg-[#e62245] text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                              >
                                CHOOSE OPTION
                              </Link>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="checkbox"
                            id={`compare-${product.id}`}
                            className="accent-[#0075ff] cursor-pointer"
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
                )}
              </div>
            );
          })}
        </div>
      </section>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          {/* Previous button (only show if not on page 1) */}
          {currentPage > 1 ? (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border cursor-pointer px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
            >
              ← Previous
            </button>
          ) : (
            <div></div>
          )}
          {/* Page numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`border cursor-pointer px-3 py-1 rounded text-sm ${
                  currentPage === idx + 1 ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        {/* Next button */}
        {currentPage < totalPages ? (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border cursor-pointer px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
          >
            Next →
          </button>
        ) : (
          <div></div>
        )}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCompareSelected}
            className={`${
              compareItems.length >= 2
                ? "cursor-pointer bg-[#e62245] hover:bg-[#d41d3f] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } text-xs font-semibold px-6 py-2 rounded transition-colors`}
          >
            COMPARE SELECTED ({compareItems.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
