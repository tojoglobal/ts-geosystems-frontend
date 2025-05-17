/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

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

const UsedEquipment = () => {
  const axiosPublicUrl = useAxiospublic();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("FEATURED ITEMS");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareItems, setCompareItems] = useState([]);
  const navigate = useNavigate();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["usedProducts"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get(
        "/api/category-with-subcategories/2"
      );
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

  // Helper function to parse JSON fields
  const parseField = (field) => {
    try {
      return typeof field === "string" ? JSON.parse(field) : field;
    } catch {
      return field;
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-b pb-10">
        {subcategories.map((category) => {
          const categorySlug = parseField(category.slug)?.slug || category.slug;
          return (
            <Link
              key={category.id}
              to={`/used-surveying-equipment/${categorySlug}`}
              className="group relative rounded-lg overflow-hidden transition-shadow"
            >
              <div className="relative w-52 border border-gray-300 rounded-md mx-auto bg-[#f5f5f5]">
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                    category.photo
                  }`}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <h2 className="text-base mt-1 font-medium group-hover:text-[#e62245] transition-colors">
                  {category.name}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
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
                  <option key={option} value={option}>
                    {option}
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
          {currentProducts.map((product) => {
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
            const taxData = parseField(product.tax);
            const price = parseFloat(product.price) || 0;
            const priceExVat = price * (1 + (taxData?.value || 0) / 100);

            return (
              <div
                key={product.id}
                className={`relative ${
                  viewMode === "list"
                    ? "flex flex-col md:flex-row gap-8"
                    : "flex flex-col h-full"
                }`}
              >
                {/* SALE badge */}
                {product.clearance && (
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
                  <Link
                    to={`/product/${product.id}`}
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
                      to={`/product/${product.id}`}
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
                          className="w-auto h-56 object-contain transition-all duration-300 ease-in-out"
                        />
                      </div>
                    </Link>
                  </div>
                )}
                {/* Product Details */}
                {viewMode === "list" ? (
                  <div className="w-full md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-gray-600">
                        {product.brand_name} | Sku: {product.sku}
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-xl text-gray-800 font-medium hover:text-[#e62245] cursor-pointer">
                          {product.product_name}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#2f2f2b] mt-2">
                        {product.product_overview || "No description available"}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-lg">
                            Price ৳{price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 underline">
                            (Ex. VAT)
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                          <p className="text-[#2f2f2b] text-lg font-semibold">
                            Price:
                          </p>
                          ৳{priceExVat.toFixed(2)}{" "}
                          <span className="underline">(Inc. VAT)</span>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 flex-row">
                        <button className="bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[3px] hover:bg-[#d41d3f] font-bold transition-colors">
                          ADD TO CART
                        </button>
                        <div className="flex items-center gap-2">
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
                  <div className="flex flex-col flex-grow border-t pt-3">
                    <div className="flex-grow">
                      <div className="border-t border-gray-300 pt-2 text-xs text-gray-600 mb-1">
                        {product.brand_name} | Sku: {product.sku}
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-gray-800 font-medium hover:text-[#e62245] cursor-pointer leading-tight">
                          {product.product_name}
                        </h3>
                      </Link>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center gap-1">
                        <p className="font-bold">৳{price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 underline">
                          (Ex. VAT)
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#b3b3b5] mt-1">
                        ৳{priceExVat.toFixed(2)}{" "}
                        <span className="underline">(Inc. VAT)</span>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <button className="bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[3px] hover:bg-[#d41d3f] font-bold transition-colors">
                          ADD TO CART
                        </button>
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
        {/* Pagination */}
        {products.length > 0 && (
          <>
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
                        currentPage === idx + 1
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
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
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCompareSelected}
                className={`${
                  compareItems.length >= 2
                    ? "bg-[#e62245] cursor-pointer hover:bg-[#d41d3f] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } text-xs font-semibold px-6 py-2 rounded transition-colors`}
              >
                COMPARE SELECTED
              </button>
            </div>
          </>
        )}
      </section>
      <section className="mt-12">
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-used-equipment.jpg"
          alt="Used Equipment Banner"
        />
        <div className="space-y-6 text-center mt-5">
          <p>
            G2 Survey offer a wide range of reconditioned and used surveying
            equipment at very competitive prices, providing excellent value for
            money.
          </p>
          <p>
            All of our pre-owned used Total Stations, GNSS/GPS Systems, 3D Laser
            Scanners, Laser Levels, Levels, and other used surveying equipment
            are fully serviced, certified and come with a minimum 3 month
            warranty for both parts and labour.
          </p>
          <p>
            With an extensive range of used Total Stations, used 3D Laser
            Scanners and used GNSS/GPS Systems and more, we're guaranteed to
            find the right equipment for you, whatever the budget.
          </p>
          {/* Highlighted box */}
          <div className="bg-gray-100 p-8 rounded-lg space-y-6">
            <h2 className="text-xl text-[#e62245] uppercase">
              Used Surveying Equipment Benefits
            </h2>
            <p>
              Cost Effective - Substantial Savings Over Buying New Equipment
            </p>
            <p>Serviced / Calibrated by Leica Trained Technicians</p>
            <p>6 Month Extended Warranty Available on Many Instruments</p>
            <p>
              Leading Brands - Whether it be a Used{" "}
              <a href="#" className="underline">
                Leica TS15
              </a>{" "}
              Total Station or a{" "}
              <a href="#" className="underline">
                Leica BLK360
              </a>{" "}
              Used Laser Scanner you're after, we've got you covered
            </p>
            <p className="italic font-semibold">Worldwide Shipping</p>
            <p className="text-[#e62245] font-semibold">
              DEMAND IS HIGH FOR PRE-OWNED EQUIPMENT, AND OUR STOCK IS
              CONSTANTLY CHANGING.
            </p>
            <p className="text-[#e62245] font-semibold">
              IF YOU CAN'T FIND THE SPECIFIC KIT YOU REQUIRE PLEASE CONTACT US
              AND WE WILL SOURCE IT.
            </p>

            <div className="flex justify-center">
              <button className="bg-[#e62245] text-white px-6 py-2 rounded-md hover:bg-[#c81e3b] transition">
                Contact Us
              </button>
            </div>

            <div>
              <a href="#" className="text-[#e62245] underline text-sm">
                G2 Survey Reconditioned Surveying Equipment Brochure
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsedEquipment;
