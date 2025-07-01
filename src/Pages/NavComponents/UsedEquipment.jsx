/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { slugify } from "../../utils/slugify";
import { useTrackProductView } from "../../Hooks/useTrackProductView";
import { getProductType } from "../../utils/productOption";
import { parsePrice } from "../../utils/parsePrice";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/AddToCart/AddToCart";
import UsedEquipmentBenefits from "./UsedEquipmentBenefits";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import useToastSwal from "../../Hooks/useToastSwal";
import CompareCheckbox from "./CompareCheckbox";
import { useVatEnabled } from "../../Hooks/useVatEnabled";
import { formatBDT } from "../../utils/formatBDT";
import AddToCartButton from "../../Components/AddToCartButton";

// Utility to strip HTML tags (including <p>)
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

const sortOptions = [
  { label: "NEWEST ITEMS", value: "newest" },
  { label: "PRICE: ASCENDING", value: "price_asc" },
  { label: "PRICE: DESCENDING", value: "price_desc" },
  { label: "A TO Z", value: "name_asc" },
  { label: "Z TO A", value: "name_desc" },
];

const UsedEquipment = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const showToast = useToastSwal();
  const { trackProductView } = useTrackProductView();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareItems, setCompareItems] = useState([]);
  const navigate = useNavigate();
  const { data: vatEnabled = true, isLoading: vatLoading } = useVatEnabled();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["usedProducts"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/used-products");
      return res?.data;
    },
  });

  // Extract subcategories and products from API response
  const subcategories = data?.subcategories || [];
  const products = data?.products || [];

  // Pagination logic
  const productsPerPage = 8;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
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

  const handleCompareSelected = () => {
    if (compareItems.length < 2) {
      Swal.fire({
        title: "Comparison Error",
        text: "You must select at least two products to compare",
        icon: "error",
        confirmButtonColor: "#e62245",
        confirmButtonText: "OK",
        timer: 4000,
      });
    } else {
      const sortedIds = [...compareItems].sort((a, b) => a - b);
      navigate(`/compare/${sortedIds.join(",")}`);
    }
  };

  // Helper function to parse JSON fields
  const parseField = (field) => {
    try {
      return typeof field === "string" ? JSON.parse(field) : field;
    } catch {
      return field;
    }
  };

  // Sort products according to sortBy
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price_desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name_asc":
        return (a.product_name || "").localeCompare(b.product_name || "");
      case "name_desc":
        return (b.product_name || "").localeCompare(a.product_name || "");
      case "newest":
      default:
        return (b.created_at || b.id || 0) - (a.created_at || a.id || 0);
    }
  });

  if (isLoading || vatLoading) return null;

  return (
    <div className="p-1 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-4">
        <Link to="/" className="text-gray-500">
          Home
        </Link>
        <span>/</span>
        <Link to="/used" className="text-[#e62245]">
          Used Surveying Equipment
        </Link>
      </div>
      <h1 className="text-xl md:text-[30px] font-semibold mb-6 uppercase">
        Used Surveying Equipment
      </h1>
      <section className="mt-2">
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
          <div className="flex items-center gap-2">
            <label className="text-sm">Sort By:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
          } gap-1 md:gap-3`}
        >
          {sortedProducts.map((product) => {
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
              300
            );

            return (
              <div
                key={product.id}
                className={`mx-1 relative ${
                  viewMode === "list"
                    ? "flex flex-col md:flex-row gap-4 py-4"
                    : "flex flex-col h-full"
                }`}
              >
                {/* SALE badge */}
                {product.sale === 1 && (
                  <div
                    className={`absolute ${
                      viewMode === "list"
                        ? "top-3 left-[267px]"
                        : "-top-1 right-4"
                    } bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm`}
                  >
                    SALE
                  </div>
                )}
                {viewMode === "list" ? (
                  <>
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
                    {/* Product Details */}
                    <div className="w-full md:w-2/3 flex flex-col gap-2">
                      <div>
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
                        {/* Compact, gapless description, no <p> */}
                        <div className="text-sm text-[#2f2f2b] mt-1">
                          {desc}...
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col mt-2">
                          {vatEnabled ? (
                            <>
                              <div className="flex items-center gap-1">
                                <p className="font-bold text-lg">
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
                                <p className="text-[#2f2f2b] text-lg font-semibold">
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
                              <p className="font-bold text-lg">
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
                              <>
                                {Number(product?.priceShowHide) === 1 ? (
                                  // Case 2: GET QUOTATION
                                  <Link
                                    onClick={() => trackProductView(product.id)}
                                    to={`/products/${product.id}/${slugify(
                                      product.product_name || ""
                                    )}`}
                                  >
                                    <button className="w-full bg-[#e62245] cursor-pointer text-sm sm:text-[11px] md:text-sm text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                      GET QUOTATION
                                    </button>
                                  </Link>
                                ) : (
                                  <AddToCartButton
                                    product={product}
                                    quantity={1}
                                    selectedOptions={[]}
                                  />
                                )}
                              </>
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
                  </>
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
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={displayImage}
                          alt={product.product_name}
                          className="w-auto max-h-[265.17px] object-contain transition-all duration-300 ease-in-out"
                        />
                      </div>
                    </Link>
                  </div>
                )}
                {/* Product Details for grid mode */}
                {viewMode !== "list" && (
                  <div className="flex flex-col flex-grow pt-8 mb-4">
                    <div className="flex-grow">
                      <div className="border-t border-gray-300 pt-2 text-xs text-gray-600 mb-1">
                        {product.brand_name} | Sku: {product.sku}
                      </div>
                      <Link
                        onClick={() => trackProductView(product.id)}
                        to={`/products/${product.id}/${slugify(
                          product.product_name || ""
                        )}`}
                      >
                        <h3 className="text-gray-800 text-sm md:text-base font-medium hover:text-[#e62245] cursor-pointer leading-tight">
                          {product.product_name}
                        </h3>
                      </Link>
                    </div>
                    <div className="mt-1">
                      {vatEnabled ? (
                        <>
                          <div className="flex text-xs md:text-base items-center gap-1">
                            <p className="font-bold">
                              ৳{" "}
                              {product?.priceShowHide
                                ? ""
                                : formatBDT(basePrice)}
                            </p>
                            <p className="text-sm text-gray-500 underline">
                              (Ex. VAT)
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs md:text-sm text-[#b3b3b5] mt-1">
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
                            ৳{" "}
                            {product?.priceShowHide ? "" : formatBDT(basePrice)}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-2 mt-2">
                        {product?.isStock === 1 && (
                          <div>
                            <>
                              {Number(product?.priceShowHide) === 1 ? (
                                // Case 2: GET QUOTATION
                                <Link
                                  onClick={() => trackProductView(product.id)}
                                  to={`/products/${product.id}/${slugify(
                                    product.product_name || ""
                                  )}`}
                                >
                                  <button className="w-full bg-[#e62245] cursor-pointer text-sm sm:text-[11px] md:text-sm text-white px-2 lg:px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                    GET QUOTATION
                                  </button>
                                </Link>
                              ) : (
                                <AddToCartButton
                                  product={product}
                                  quantity={1}
                                  selectedOptions={[]}
                                />
                              )}
                            </>
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
        {/* Pagination */}
        {products.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-10">
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="border cursor-pointer flex items-center gap-1 px-1.5 p-1 rounded hover:bg-gray-100 transition text-sm"
                  >
                    <MdKeyboardArrowLeft /> Previous
                  </button>
                )}
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
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="border cursor-pointer flex items-center gap-1 px-1.5 p-1 rounded hover:bg-gray-100 transition text-sm"
                >
                  Next <MdKeyboardArrowRight />
                </button>
              )}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCompareSelected}
                className={`${
                  compareItems.length >= 2
                    ? "bg-[#e62245] cursor-pointer hover:bg-[#d41d3f] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } text-xs font-semibold px-4 py-2 rounded transition-colors`}
              >
                COMPARE SELECTED
              </button>
            </div>
          </>
        )}
      </section>
      <UsedEquipmentBenefits />
    </div>
  );
};

export default UsedEquipment;
