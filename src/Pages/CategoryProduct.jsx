/* eslint-disable no-useless-escape */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../Hooks/useAxiospublic";

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
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("FEATURED ITEMS");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  console.log(hoveredProductId);
  const [compareItems, setCompareItems] = useState([]);
  const { category, subcategory } = useParams();

  const { data: productsData = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/products");
      return res?.data?.products;
    },
  });

  // Filter products based on category and subcategory
  const filteredProducts = productsData.filter((product) => {
    try {
      const productCategory = JSON.parse(product.category);
      const productSubCategory = JSON.parse(product.sub_category);

      if (subcategory) {
        // Match both category and subcategory
        return (
          productCategory.cat === category &&
          productSubCategory.slug === subcategory
        );
      } else {
        // Match only category
        return productCategory.cat === category;
      }
    } catch (error) {
      console.error("Error parsing category/subcategory:", error);
      return false;
    }
  });

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
          {filteredProducts.map((product) => {
            // Parse image URLs
            let imageUrl = "";
            try {
              const images = JSON.parse(product.image_urls);
              // Take the first image and construct full URL
              const firstImage = images[0] || "";
              // Remove any surrounding quotes or brackets if present
              const cleanImagePath = firstImage.replace(/^["\[]+|["\]]+$/g, "");
              imageUrl = `${import.meta.env.VITE_OPEN_APIURL}${cleanImagePath}`;
            } catch (error) {
              console.log("Error parsing image URLs:", error);
              // Fallback to direct URL if parsing fails
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
                <Link to={`/product/${product.id}`}>
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
                    <Link to={`/product/${product.id}`}>
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
                      <button className="bg-[#e62245] uppercase text-white px-6 py-2 hover:bg-[#d41d3f] transition-colors duration-200 text-sm font-semibold rounded-sm">
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          setCompareItems((prev) =>
                            prev.includes(product.id)
                              ? prev.filter((id) => id !== product.id)
                              : [...prev, product.id]
                          );
                        }}
                        className="uppercase border border-gray-400 px-6 py-2 text-sm font-semibold rounded-sm hover:bg-gray-100"
                      >
                        {compareItems.includes(product.id)
                          ? "Remove"
                          : "Compare"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default CategoryProduct;
