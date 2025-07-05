import { Link, useParams, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState, useMemo } from "react";
import useDataQuery from "../../utils/useDataQuery";
import { parsePrice } from "../../utils/parsePrice";
import { useTrackProductView } from "../../Hooks/useTrackProductView";
import { formatBDT } from "../../utils/formatBDT";
import AddToCartButton from "../../Components/AddToCartButton";
import { useVatEnabled } from "../../Hooks/useVatEnabled";

// Get array of image URLs, can be stringified JSON or array
const getImages = (img) => {
  if (!img) return [];
  if (Array.isArray(img)) return img;
  try {
    const arr = JSON.parse(img);
    return Array.isArray(arr) ? arr : [arr];
  } catch {
    return [img];
  }
};
const getImageFullUrl = (url) =>
  !url
    ? ""
    : url.startsWith("http")
    ? url
    : `${import.meta.env.VITE_OPEN_APIURL || ""}${url}`;

// Remove all HTML tags and undefined
const stripHTMLTags = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/<[^>]*>/g, "") // This regex will remove any HTML tag
    .replace(/undefined/gi, "")
    .trim();
};

const normalizeProducts = (raw) => raw?.products || [];

const Compare = () => {
  const { ids } = useParams();
  const navigate = useNavigate();
  const [compareIds, setCompareIds] = useState(() =>
    ids
      ? ids
          .replaceAll("/", ",")
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : []
  );
  const idString = compareIds.join(",");
  const queryUrl = useMemo(
    () => `/api/productsids/?ids=${idString}`,
    [idString]
  );
  const { data, isLoading, error, refetch } = useDataQuery(
    ["compare-products", idString],
    queryUrl,
    !!idString,
    normalizeProducts
  );
  // Use the useVatEnabled hook to get the global VAT status
  const { data: vatEnabled = true, isLoading: vatLoading } = useVatEnabled();
  const [viewMode, setViewMode] = useState("grid");
  const [hovered, setHovered] = useState(null);
  const products = data || [];
  const { trackProductView } = useTrackProductView();

  // Remove product from compare
  const handleRemoveFromCompare = (removeId) => {
    const newIds = compareIds.filter((id) => String(id) !== String(removeId));
    setCompareIds(newIds);
    if (newIds.length === 0) {
      navigate("/compare/");
    } else {
      navigate(`/compare/${newIds.join(",")}`, { replace: true });
    }
  };

  if (!idString) {
    return (
      <div className="p-3">
        <h1 className="text-2xl text-center mt-10 text-red-600">
          No product IDs specified in URL.
        </h1>
      </div>
    );
  }

  // Handle loading states for both products and VAT status
  if (isLoading || vatLoading) {
    return (
      <div className="p-3">
        <h1 className="text-xl">Loading products...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <h1 className="text-xl text-red-600">
          Error loading products. Please try again.
        </h1>
        <button
          className="bg-[#e62245] text-white px-4 py-2 rounded"
          onClick={refetch}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-3">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Compare Products</span>
      </div>
      <h1 className="text-3xl mb-3">
        Comparing {products.length} Product{products.length !== 1 && "s"}
      </h1>
      <div className="flex items-center gap-2 mb-4">
        <button
          className={`p-2 cursor-pointer rounded-sm ${
            viewMode === "grid"
              ? "bg-[#e62245] text-white rounded-sm"
              : "text-gray-600 border"
          }`}
          onClick={() => setViewMode("grid")}
        >
          <BsGrid3X3GapFill size={20} />
        </button>
        <button
          className={`p-2 cursor-pointer rounded-sm ${
            viewMode === "list"
              ? "bg-[#e62245] text-white rounded-sm"
              : "text-gray-600 border"
          }`}
          onClick={() => setViewMode("list")}
        >
          <FaThList size={20} />
        </button>
      </div>
      <div
        className={`grid mx-1 md:mx-5 ${
          viewMode === "grid"
            ? "grid-cols-2 sm:grid-cols-4 items-stretch"
            : "grid-cols-1 gap-7"
        } gap-1 md:gap-3`}
      >
        {products.map((product) => {
          const images = getImages(product.image_urls);
          const mainImage = getImageFullUrl(images[0]);
          const secondImage = images[1]
            ? getImageFullUrl(images[1])
            : mainImage;
          const link =
            "/products/" +
            product.id +
            "/" +
            encodeURIComponent(
              (product.product_name || product.name || "")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
            );

          // vat part from product data
          let vat = 0;
          try {
            vat = product?.tax ? JSON.parse(product.tax).value : 0;
          } catch {
            vat = 0;
          }
          const basePrice = parsePrice(product.price) || 0;
          const vatAmount = basePrice * (vat / 100);
          const priceIncVat = basePrice + vatAmount;

          // Process category and sub_category
          let categoryName = "N/A";
          try {
            const categoryObj = product?.category
              ? JSON.parse(product.category)
              : null;
            categoryName = categoryObj?.cat || "N/A";
          } catch (e) {
            console.error("Error parsing category:", e);
          }

          let subCategorySlug = "N/A";
          try {
            const subCategoryObj = product?.sub_category
              ? JSON.parse(product.sub_category)
              : null;
            subCategorySlug = subCategoryObj?.slug || "N/A";
          } catch (e) {
            console.error("Error parsing sub_category:", e);
          }

          // Strip all HTML tags from overview/description
          const desc = stripHTMLTags(
            product.product_overview || product.description || ""
          ).slice(0, 300);

          // Strip HTML tags from warranty info
          const warranty = stripHTMLTags(product.warranty_info || "");

          return (
            <div key={product.id} className="relative group">
              <button
                className="absolute cursor-pointer right-0 top-0 p-2 text-gray-500 hover:text-[#e62245] z-10"
                onClick={() => handleRemoveFromCompare(product.id)}
              >
                <IoClose size={24} />
              </button>
              <Link
                to={link}
                onClick={() => trackProductView(product.id)}
                className="w-full h-48 flex justify-center items-center mb-4 bg-white"
                onMouseEnter={() => setHovered(product.id)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={-1}
              >
                <img
                  src={hovered === product.id ? secondImage : mainImage}
                  alt={product.name || product.product_name}
                  className="w-auto max-h-full object-contain transition-all duration-300 ease-in-out"
                  loading="lazy"
                  onError={(e) => {
                    const fallback = "/image/no-image1.jpg";
                    if (e.target.src !== window.location.origin + fallback) {
                      e.target.src = fallback;
                    }
                  }}
                />
              </Link>
              <div className="flex flex-col flex-grow lg:px-4 pb-4">
                <div className="flex-grow flex flex-col space-y-4">
                  <h3 className="font-medium leading-tight min-h-[2.5em]">
                    <Link to={link} className="hover:text-[#e62245] transition">
                      {product.name || product.product_name}
                    </Link>
                  </h3>
                  <div>
                    {/* Display prices based on global vatEnabled setting */}
                    <div className="flex items-center gap-1">
                      <p className="font-bold">
                        ৳{product?.priceShowHide ? "" : formatBDT(basePrice)}
                        &nbsp;(Ex. VAT)
                      </p>
                    </div>

                    {vatEnabled && ( // Only show "Inc. VAT" if VAT is globally enabled
                      <p className="text-gray-500">
                        ৳{product?.priceShowHide ? "" : formatBDT(priceIncVat)}
                        &nbsp;(Inc. VAT)
                      </p>
                    )}
                  </div>
                  {product?.isStock === 1 && (
                    <div>
                      <>
                        {Number(product?.priceShowHide) === 1 ? (
                          <Link
                            onClick={() => trackProductView(product.id)}
                            to={`/product/${product.slug}`}
                          >
                            <button className="w-full bg-[#e62245] cursor-pointer text-sm sm:text-[11px] md:text-sm text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors whitespace-nowrap">
                              <span className="relative z-10">
                                GET QUOTATION
                              </span>
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
                </div>
                <div className="p-1">
                  <div className="w-full space-y-3 text-sm text-gray-800">
                    <div>
                      <h4 className="font-bold">Brand:</h4>
                      <p className="text-[#e62245] underline">
                        {product.brand || product.brand_name}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold">Category:</h4>
                      <p className="text-gray-600 capitalize">{categoryName}</p>
                    </div>
                    <div>
                      <h4 className="font-bold">Sub Category:</h4>
                      <p className="text-gray-600 capitalize">
                        {subCategorySlug}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold">SKU:</h4>
                      <p className="text-gray-600">{product.sku || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="font-bold">Description:</h4>
                      <p className="text-gray-600">
                        {desc}
                        {desc.length === 300 ? "..." : ""}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {product.reviews || "No Reviews"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold">Availability:</h4>
                      <p className="text-gray-600">
                        {product.isStock === 1 ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                    {(product.condition || product.product_condition) && (
                      <div>
                        <h4 className="font-bold">Condition:</h4>
                        <p className="text-gray-600 capitalize">
                          {product.condition || product.product_condition}
                        </p>
                      </div>
                    )}
                    {warranty && (
                      <div>
                        <h4 className="font-bold">Warranty Info:</h4>
                        <p className="text-gray-600">{warranty}</p>
                      </div>
                    )}
                    {/* Display "VAT Enabled" based on the product's individual tax value, not the global setting */}
                    <div>
                      <h4 className="font-bold">VAT Applied to Product:</h4>
                      <p className="text-gray-600">{vat > 0 ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Compare;
