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
import useToastSwal from "../Hooks/useToastSwal";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import CompareCheckbox from "./NavComponents/CompareCheckbox";
import { useVatEnabled } from "../Hooks/useVatEnabled";
import { formatBDT } from "../utils/formatBDT";

const sortOptions = [
  { label: "NEWEST ITEMS", value: "newest" },
  { label: "PRICE: ASCENDING", value: "price_asc" },
  { label: "PRICE: DESCENDING", value: "price_desc" },
  { label: "A TO Z", value: "name_asc" },
  { label: "Z TO A", value: "name_desc" },
];

// Utility to strip HTML tags (including <p>)
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

const CategoryProduct = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const { trackProductView } = useTrackProductView();
  const showToast = useToastSwal();
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [viewMode, setViewMode] = useState("grid");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareItems, setCompareItems] = useState([]);
  const navigate = useNavigate();
  const { data: vatEnabled = true, isLoading: vatLoading } = useVatEnabled();
  const { category, subcategory, brand } = useParams();
  const productsPerPage = 8;

  const { data: productsData = {}, isLoading } = useQuery({
    queryKey: ["products", category, subcategory, brand, currentPage, sortBy],
    queryFn: async () => {
      let endpoint;
      if (brand) {
        endpoint = `/api/brand-products/${brand}`;
      } else if (category === "shop-all") {
        endpoint = "/api/shop-all/product";
      } else if (subcategory) {
        endpoint = `/api/category-products/${category}/${subcategory}`;
      } else {
        endpoint = `/api/category-products/${category}`;
      }

      const res = await axiosPublicUrl.get(endpoint, {
        params: {
          page: currentPage,
          limit: productsPerPage,
          sortBy: sortBy.value,
        },
      });
      return res?.data;
    },
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when sort changes
  }, [sortBy]);

  const { products = [], total = 0, totalPages = 1 } = productsData;

  const handleAddToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parsePrice(product.price),
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));

    showToast(
      "success",
      "Added to Cart!",
      `<b style="color:#333">${product.product_name}</b> has been added to your cart.`,
      { timer: 2000 }
    );
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

  if (isLoading || vatLoading) return null;

  const showNoProduct =
    !products ||
    !Array.isArray(products) ||
    products.length === 0 ||
    !productsData.success;

  if (showNoProduct) {
    return (
      <div className="flex justify-center items-center min-h-[250px] text-center text-lg text-gray-500">
        No product found in this{" "}
        {brand
          ? "brand"
          : subcategory
          ? "subcategory"
          : category
          ? "category"
          : "section"}
        .
      </div>
    );
  }

  return (
    <div className="p-1 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        {brand ? (
          <Link to={`/brand/${brand}`} className="text-[#e62245] capitalize">
            {brand.replace(/-/g, " ")}
          </Link>
        ) : (
          <>
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
          </>
        )}
      </div>
      <h1 className="text-xl md:text-3xl font-bold mb-4">
        {subcategory || category || brand
          ? (subcategory || category || brand).replace(/-/g, " ").toUpperCase()
          : ""}
      </h1>
      {/* product part  */}
      <section>
        {/* product category list  */}
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
          className={`grid mx-1 md:mx-5 ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-4 items-stretch"
              : "grid-cols-1 gap-7"
          } gap-3 md:gap-4`}
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

            // vat part
            let vat = 0;
            try {
              vat = product?.tax ? JSON.parse(product.tax).value : 0;
            } catch {
              vat = 0;
            }
            const basePrice = parsePrice(product.price) || 0;
            const vatAmount = basePrice * (vat / 100);
            const priceIncVat = basePrice + vatAmount;

            // Strip <p> and other tags from description and slice
            const desc = stripHtml(product?.product_overview || "").slice(
              0,
              400
            );

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
                  <div className="w-full md:w-2/3 flex flex-col gap-2">
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
                      {/* Description, plain text, no <p> tags, compact */}
                      <div className="text-sm text-[#2f2f2b] mt-1">
                        {desc}
                        {product.product_overview &&
                        product.product_overview.length > 400
                          ? "..."
                          : ""}
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col">
                        {vatEnabled ? (
                          <>
                            <div className="flex items-center gap-1">
                              <p className="font-bold">
                                Price ৳{" "}
                                {product?.priceShowHide
                                  ? ""
                                  : formatBDT(basePrice)}
                              </p>
                              <p className="text-sm text-gray-500 underline">
                                (Ex. VAT)
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                              <p className="text-[#2f2f2b] font-semibold">
                                Price:
                              </p>
                              ৳{" "}
                              {product?.priceShowHide
                                ? ""
                                : formatBDT(priceIncVat)}
                              <span className="underline">(Inc. VAT)</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-1">
                            <p className="font-bold">
                              Price ৳{" "}
                              {product?.priceShowHide
                                ? ""
                                : formatBDT(basePrice)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 mt-2 flex-row">
                        {product?.isStock === 1 && (
                          <div>
                            {isSimpleProduct ? (
                              <>
                                {Number(product?.priceShowHide) === 1 ? (
                                  <Link
                                    onClick={() => trackProductView(product.id)}
                                    to={`/products/${product.id}/${slugify(
                                      product.product_name || ""
                                    )}`}
                                  >
                                    <button className="w-full bg-[#e62245] cursor-pointer text-[14px] sm:text-[11px] md:text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                      GET QUOTATION
                                    </button>
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-[#e62245] cursor-pointer text-[14px] sm:text-[11px] md:text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                                  >
                                    ADD TO CART
                                  </button>
                                )}
                              </>
                            ) : (
                              <Link
                                onClick={() => trackProductView(product.id)}
                                to={`/products/${product.id}/${slugify(
                                  product.product_name || ""
                                )}`}
                              >
                                <button className="w-full bg-[#e62245] cursor-pointer text-[14px] sm:text-[11px] md:text-[14px] text-white px-3 md:px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                  CHOOSE OPTION
                                </button>
                              </Link>
                            )}
                          </div>
                        )}
                        <CompareCheckbox
                          id={product.id}
                          checked={compareItems.includes(product.id)}
                          onChange={() => toggleCompare(product.id)}
                        />
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
                      {vatEnabled ? (
                        <>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-bold">
                              ৳{" "}
                              {product?.priceShowHide
                                ? ""
                                : formatBDT(basePrice)}
                            </p>
                            <p className="text-sm text-gray-500 underline">
                              (Ex. VAT)
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[#b3b3b5] mt-1">
                            ৳{" "}
                            {product?.priceShowHide
                              ? ""
                              : formatBDT(priceIncVat)}
                            <span className="underline">(Inc. VAT)</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-bold">
                            ৳{" "}
                            {product?.priceShowHide ? "" : formatBDT(basePrice)}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-2 mt-2">
                        {product?.isStock === 1 && (
                          <div>
                            {isSimpleProduct ? (
                              <>
                                {Number(product?.priceShowHide) === 1 ? (
                                  // Case 2: GET QUOTATION
                                  <Link
                                    onClick={() => trackProductView(product.id)}
                                    to={`/products/${product.id}/${slugify(
                                      product.product_name || ""
                                    )}`}
                                  >
                                    <button className="w-full bg-[#e62245] cursor-pointer text-[14px] sm:text-[11px] md:text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                      GET QUOTATION
                                    </button>
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-[#e62245] cursor-pointer text-[14px] sm:text-[11px] md:text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                                  >
                                    ADD TO CART
                                  </button>
                                )}
                              </>
                            ) : (
                              <Link
                                onClick={() => trackProductView(product.id)}
                                to={`/products/${product.id}/${slugify(
                                  product.product_name || ""
                                )}`}
                              >
                                <button className="w-full bg-[#e62245] cursor-pointer text-[14px] sm:text-[11px] md:text-[14px] text-white px-3 md:px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                  CHOOSE OPTION
                                </button>
                              </Link>
                            )}
                          </div>
                        )}
                        <CompareCheckbox
                          id={product.id}
                          checked={compareItems.includes(product.id)}
                          onChange={() => toggleCompare(product.id)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      {/* Pagination part */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          {/* Previous button (only show if not on page 1) */}
          {currentPage > 1 ? (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border flex items-center gap-1 px-1.5 p-1 rounded hover:bg-gray-100 transition text-sm"
            >
              <MdKeyboardArrowLeft /> Previous
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
                className={`border px-2 py-1.5 rounded text-sm ${
                  currentPage === idx + 1
                    ? "border border-gray-300 bg-[#ebebeb] hover:text-red-500"
                    : "hover:text-red-500 cursor-pointer"
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
            className="border flex items-center gap-1 px-1.5 p-1 rounded hover:bg-gray-100 transition text-sm"
          >
            Next <MdKeyboardArrowRight />
          </button>
        ) : (
          <div></div>
        )}
      </div>
      {/* compare part  */}
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
