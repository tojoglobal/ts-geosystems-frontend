import { Link, useParams, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState, useMemo } from "react";
import useDataQuery from "../../utils/useDataQuery";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/AddToCart/AddToCart";
import { parsePrice } from "../../utils/parsePrice";
import useToastSwal from "../../Hooks/useToastSwal";

// Helper: supports array or JSON string for image URLs, returns full API URL
const getFirstImage = (img) => {
  if (!img) return "";
  let url = "";
  if (Array.isArray(img)) url = img[0];
  else {
    try {
      const arr = JSON.parse(img);
      url = Array.isArray(arr) ? arr[0] : arr;
    } catch {
      url = img;
    }
  }
  if (!url) return "";
  // If already absolute URL (starts with http), just use it
  if (typeof url === "string" && url.startsWith("http")) return url;
  // Otherwise, build with API URL
  return `${import.meta.env.VITE_OPEN_APIURL || ""}${url}`;
};

// Helper: removes all <p> tags and trims
const stripPTags = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/<p>/gi, "")
    .replace(/<\/p>/gi, "")
    .replace(/undefined/gi, "")
    .trim();
};

const normalizeProducts = (raw) => raw?.products || [];

const Compare = () => {
  const { ids } = useParams();
  const navigate = useNavigate();
  // Use local state to track which products are being compared
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
  const showToast = useToastSwal();
  const [viewMode, setViewMode] = useState("grid");
  const products = data || [];
  const dispatch = useDispatch();

  // Add to Cart handler
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

  if (isLoading) {
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
    <div className="p-3">
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
        className={
          viewMode === "grid"
            ? "grid grid-cols-4 gap-6"
            : "grid grid-cols-1 gap-6"
        }
      >
        {products.map((product) => (
          <div key={product.id} className="relative">
            <button
              className="absolute cursor-pointer right-0 top-0 p-2 text-gray-500 hover:text-[#e62245]"
              onClick={() => handleRemoveFromCompare(product.id)}
            >
              <IoClose size={24} />
            </button>
            <div className="w-full h-48 flex justify-center items-center mb-4 bg-white">
              <img
                src={
                  product.image
                    ? product.image
                    : getFirstImage(product.image_urls)
                }
                alt={product.name || product.product_name}
                className="w-auto max-h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">
                {product.name || product.product_name}
              </h3>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-gray-500 line-through">
                    Was: ৳
                    {(product.oldPrice
                      ? Number(product.oldPrice)
                      : product.oldPriceInc
                      ? Number(product.oldPriceInc)
                      : product.old_price
                      ? Number(product.old_price)
                      : ""
                    ).toFixed
                      ? (
                          product.oldPrice ||
                          product.oldPriceInc ||
                          product.old_price ||
                          0
                        ).toFixed(2)
                      : ""}
                  </p>
                  <p className="font-bold">
                    ৳
                    {(product.price ? Number(product.price) : "").toFixed
                      ? Number(product.price).toFixed(2)
                      : ""}{" "}
                    (Ex. VAT)
                  </p>
                </div>
                <p className="font-bold">
                  ৳
                  {(product.price ? Number(product.price) : "").toFixed
                    ? Number(product.price).toFixed(2)
                    : ""}
                </p>
                <p className="text-gray-500">
                  ৳
                  {(product.priceExVat
                    ? Number(product.priceExVat)
                    : product.price_ex_vat
                    ? Number(product.price_ex_vat)
                    : ""
                  ).toFixed
                    ? (
                        product.priceExVat ||
                        product.price_ex_vat ||
                        ""
                      ).toFixed(2)
                    : ""}
                  (Inc. VAT)
                </p>
              </div>
              {product?.isStock === 1 && (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#e62245] w-full cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                >
                  ADD TO CART
                </button>
              )}
              <div className="p-1">
                <div className="w-full space-y-3 text-sm text-gray-800">
                  <div>
                    <h4 className="font-bold">Brand:</h4>
                    <p className="text-[#e62245] underline">
                      {product.brand || product.brand_name}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold">Description</h4>
                    <p className="text-gray-600">
                      {stripPTags(product.description) ||
                        stripPTags(product.product_overview) ||
                        ""}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">
                      {product.reviews || "No Reviews"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold">Availability</h4>
                    <p className="text-gray-600">
                      {product.availability || "Usually ships in 24 hours"}
                    </p>
                  </div>
                  {product.manufactured && (
                    <div>
                      <h4 className="font-medium">Manufactured</h4>
                      <p className="text-gray-600">{product.manufactured}</p>
                    </div>
                  )}
                  {(product.condition || product.product_condition) && (
                    <div>
                      <h4 className="font-medium">Condition</h4>
                      <p className="text-gray-600">
                        {product.condition || product.product_condition}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">Other Details</h4>
                    <p className="text-gray-600 font-bold">
                      {product.otherDetails || product.other_details || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
