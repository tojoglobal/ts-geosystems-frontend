/* eslint-disable no-useless-escape */
import { useState, useRef, useEffect } from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import Recommended from "./Recommended";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { addToCart } from "../../features/AddToCart/AddToCart";
import { parsePrice } from "../../utils/parsePrice";
import useDataQuery from "../../utils/useDataQuery";
import { setBreadcrumb } from "../../features/breadcrumb/breadcrumbSlice";
import useToastSwal from "../../Hooks/useToastSwal";
import { useVatEnabled } from "../../Hooks/useVatEnabled";

// Helper function to extract YouTube video ID from url
function getYouTubeId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) return match[1];
  return null;
}

const ProductDetails = () => {
  const { id } = useParams();
  const showToast = useToastSwal();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const overviewRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const { data: vatEnabled = true } = useVatEnabled();
  const [playingVideoIdx, setPlayingVideoIdx] = useState(-1);

  const {
    data: product = {},
    isLoading,
    isError,
    error,
  } = useDataQuery(["productDetails", id], `/api/products/${id}`, !!id);
  // Parse the image URLs from the product data
  const imageUrls = product?.image_urls ? JSON.parse(product.image_urls) : [];
  // Parse and clean video URLs if available
  const videoUrls = product?.video_urls
    ? product.video_urls
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
    : [];
  const category = product?.category ? JSON.parse(product.category).cat : null;
  const currentProductId = product?.id;
  const priceOption = product?.priceShowHide;
  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    if (product.flash_sale && product.flash_sale_end) {
      const interval = setInterval(() => {
        const end = new Date(product.flash_sale_end).getTime();
        const now = Date.now();
        const diff = end - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft({});
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [product.flash_sale, product.flash_sale_end]);

  // Set default selected image if not set, only on initial load or when product changes
  useEffect(() => {
    if (!selectedImage && imageUrls.length > 0) {
      setSelectedImage(imageUrls[0]);
    }
    // If product changes, ensure selectedImage resets
    // eslint-disable-next-line
  }, [product]);

  // After product loads, set the breadcrumb
  useEffect(() => {
    if (product && product.product_name) {
      let catData = product.category ? JSON.parse(product.category) : null;
      let subcatData = product.sub_category
        ? JSON.parse(product.sub_category)
        : null;
      dispatch(
        setBreadcrumb({
          category: catData
            ? { slug: catData.cat, name: catData.cat.replace(/-/g, " ") }
            : null,
          subcategory: subcatData
            ? {
                slug: subcatData.slug,
                name: subcatData.slug.replace(/-/g, " "),
              }
            : null,
          product: { id: product.id, name: product.product_name },
        })
      );
    }
  }, [product, dispatch]);

  // Quantity handlers
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);

  // Add to cart handler
  const handleAddToCart = () => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parsePrice(product.price),
      quantity,
    };
    dispatch(addToCart(itemToAdd));

    showToast(
      "success",
      "Added to Cart!",
      `<b style="color:#333">${product.product_name}</b> has been added to your cart.`,
      { timer: 2000 }
    );
  };

  if (isLoading) return null;
  if (isError)
    return <div>{error.message} || Error loading product details</div>;

  return (
    <div className="bg-white p-2 sm:p-3">
      <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image Gallery */}
          <div className="flex flex-col items-start gap-2 relative w-full md:w-[550px]">
            {/* Main Image */}
            <div className="w-full h-[300px] sm:h-[400px] md:w-[550px] md:h-[550px] overflow-hidden rounded bg-white">
              {selectedImage ? (
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${selectedImage}`}
                  alt="Selected Product"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex justify-center gap-2 mt-2 w-full">
                {imageUrls.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`p-1 rounded cursor-pointer hover:ring ring-black ${
                      selectedImage === img ? "ring ring-black" : ""
                    }`}
                    style={{ width: "60px", height: "60px" }}
                  >
                    <img
                      src={`${import.meta.env.VITE_OPEN_APIURL}${img}`}
                      alt={`Thumb ${index}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Product Info */}
          <div className="flex-1 w-full">
            <h1 className="text-[22px] sm:text-[28px] font-semibold text-[#333] mb-4 break-words">
              {product.product_name}
            </h1>
            {product.flash_sale === 1 &&
              product.flash_sale_end &&
              timeLeft &&
              typeof timeLeft.seconds !== "undefined" && (
                <div className="w-full flex mb-4">
                  <div className="flex flex-col items-center">
                    <div className="grid grid-flow-col gap-3 text-center auto-cols-max">
                      <div className="flex flex-col border-x border-b">
                        <span className="countdown font-mono py-1 px-3 text-2xl bg-crimson-red text-white rounded-t-sm">
                          <span
                            style={{ "--value": timeLeft.days || 0 }}
                            aria-live="polite"
                            aria-label="days"
                          >
                            {timeLeft.days || 0}
                          </span>
                        </span>
                        <span className="uppercase text-xs py-[2px] px-3 tracking-wide mt-1">
                          days
                        </span>
                      </div>
                      <div className="flex flex-col border-x border-b">
                        <span className="countdown font-mono py-1 px-3 text-2xl bg-crimson-red text-white rounded-t-sm">
                          <span
                            style={{ "--value": timeLeft.hours || 0 }}
                            aria-live="polite"
                            aria-label="hours"
                          >
                            {timeLeft.hours || 0}
                          </span>
                        </span>
                        <span className="uppercase text-xs py-[2px] px-3 tracking-wide mt-1">
                          hrs
                        </span>
                      </div>
                      <div className="flex flex-col border-x border-b">
                        <span className="countdown font-mono py-1 px-3 text-2xl bg-crimson-red text-white rounded-t-sm">
                          <span
                            style={{ "--value": timeLeft.minutes || 0 }}
                            aria-live="polite"
                            aria-label="minutes"
                          >
                            {timeLeft.minutes || 0}
                          </span>
                        </span>
                        <span className="uppercase text-xs py-[2px] px-3 tracking-wide mt-1">
                          min
                        </span>
                      </div>
                      <div className="flex flex-col border-x border-b">
                        <span className="countdown font-mono py-1 px-3 text-2xl bg-crimson-red text-white rounded-t-sm">
                          <span
                            style={{ "--value": timeLeft.seconds || 0 }}
                            aria-live="polite"
                            aria-label="seconds"
                          >
                            {timeLeft.seconds || 0}
                          </span>
                        </span>
                        <span className="uppercase text-xs py-[2px] px-3 tracking-wide mt-1">
                          sec
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            <p className="text-[#d71a28] text-sm mb-2 capitalize">
              {product.brand_name || "Brand"}
            </p>
            <div className="mb-2">
              <div className="text-[20px] sm:text-[24px] font-semibold text-[#222]">
                Price:{" "}
                <span className="text-[#111]">
                  ৳{parsePrice(product.price)}.00{" "}
                  {vatEnabled && (
                    <span className="text-sm text-gray-500">(Ex. VAT)</span>
                  )}
                </span>
              </div>
              {vatEnabled && (
                <div className="text-[18px] sm:text-[24px] font-semibold text-[#999] line-through">
                  Price:{" "}
                  <span className="text-[#999]">
                    ৳{(parsePrice(product.price) * 1.2).toFixed(2)}{" "}
                    <span className="text-sm text-gray-400">(Inc. VAT)</span>
                  </span>
                </div>
              )}
            </div>
            <hr className="border-t border-gray-300 my-3" />
            <div className="text-sm text-[#222] mb-1">
              <strong>SKU:</strong>{" "}
              <span className="text-[#e62245]">{product.sku || "N/A"}</span>
            </div>
            <div className="text-sm text-[#222] mb-1">
              <strong>Condition:</strong>{" "}
              <span className="text-[#e62245]">
                {product.product_condition || "New"}
              </span>
            </div>
            <div className="text-sm text-[#222] mb-1">
              <strong>Shipping:</strong>{" "}
              <span className="text-[#e62245]">Calculated at Checkout</span>
            </div>
            <div className="text-sm text-[#222] mb-1">
              <strong>Brand:</strong>{" "}
              <span className="text-[#e62245]">
                {product.brand_name || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-4 my-5">
              <label className="text-sm text-[#111] font-medium">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={decrementQuantity}
                  className="px-[5px] cursor-pointer py-[2px] text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <MdOutlineKeyboardArrowDown />
                </button>
                <span className="px-[5px] py-[2px] border-x border-gray-300 text-gray-600">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-[5px] cursor-pointer py-[2px] text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <MdOutlineKeyboardArrowUp />
                </button>
              </div>
            </div>
            {product?.isStock === 1 &&
              (priceOption === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="cursor-pointer overflow-hidden group text-white px-16 font-semibold py-[5px] rounded-[3px] text-[16px] bg-[#e62245] hover:bg-red-800 w-full sm:w-auto"
                >
                  <span className="relative z-10">ADD TO CART</span>
                </button>
              ) : (
                <Link to="/contact-us">
                  <button className="cursor-pointer overflow-hidden group text-white px-16 font-semibold py-[5px] rounded-[3px] text-[16px] bg-[#e62245] hover:bg-red-800 w-full sm:w-auto">
                    <span className="relative z-10">GET QUOTATION</span>
                  </button>
                </Link>
              ))}
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-[#8d7f90]">Share:</span>
                <div className="flex items-center gap-[6px]">
                  {/* Facebook */}
                  <button
                    className="flex cursor-pointer justify-center items-center w-10 h-[29px] bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
                    style={{ transform: "skewX(-15deg)" }}
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                        "_blank"
                      )
                    }
                  >
                    <div style={{ transform: "skewX(15deg)" }}>
                      <FaFacebookF className="text-white text-sm" />
                    </div>
                  </button>

                  {/* LinkedIn */}
                  <button
                    className="flex cursor-pointer justify-center items-center w-10 h-[29px] bg-[#0077B5] hover:bg-[#006097] transition-colors"
                    style={{ transform: "skewX(-15deg)" }}
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
                        "_blank"
                      )
                    }
                  >
                    <div style={{ transform: "skewX(15deg)" }}>
                      <FaLinkedinIn className="text-white text-sm" />
                    </div>
                  </button>

                  {/* Twitter */}
                  <button
                    className="flex cursor-pointer justify-center items-center w-10 h-[29px] bg-[#000000] hover:bg-[#333333] transition-colors"
                    style={{ transform: "skewX(-15deg)" }}
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${window.location.href}`,
                        "_blank"
                      )
                    }
                  >
                    <div style={{ transform: "skewX(15deg)" }}>
                      <FaXTwitter className="text-white text-sm" />
                    </div>
                  </button>

                  {/* WhatsApp */}
                  <button
                    className="flex cursor-pointer justify-center items-center w-10 h-[29px] bg-[#25D366] hover:bg-[#1DA851] transition-colors"
                    style={{ transform: "skewX(-15deg)" }}
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=Check%20this%20out:%20${window.location.href}`,
                        "_blank"
                      )
                    }
                  >
                    <div style={{ transform: "skewX(15deg)" }}>
                      <FaWhatsapp className="text-white text-sm" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mt-8 sm:mt-12" ref={overviewRef}>
          <div className="flex gap-2 border-t border-l border-r border-gray-200 rounded-[4px] overflow-hidden text-sm sm:text-base">
            {["OVERVIEW", "SPECIFICATIONS", "PRODUCT VIDEOS"].map(
              (tab, idx) => (
                <div
                  key={tab}
                  className={`relative group px-2 sm:px-4 py-2 cursor-pointer ${
                    idx === 1 ? "border-x border-gray-300" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span
                    className={`font-semibold transition-colors duration-200 ${
                      activeTab === tab
                        ? "text-[#e62245]"
                        : "text-gray-600 group-hover:text-[#e62245]"
                    }`}
                  >
                    {tab}
                  </span>
                </div>
              )
            )}
          </div>
          <div className="border-2 border-[#e5e5e5] rounded-[3px] p-2 sm:p-4">
            {activeTab === "OVERVIEW" && (
              <div
                className="text-gray-700 leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: product.product_overview }}
              />
            )}
            {activeTab === "SPECIFICATIONS" && (
              <div className="border rounded-lg overflow-x-auto m-2 sm:m-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left text-gray-700 p-4">
                        SPECIFICATIONS
                      </th>
                      <th className="text-left p-4 text-gray-700">
                        Descriptions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="capitalize">
                    <tr className="border-t">
                      <td className="p-4 text-gray-700">Product Name:</td>
                      <td className="p-4 text-gray-700">
                        {product.product_name}
                      </td>
                    </tr>

                    <tr className="border-t">
                      <td className="p-4 text-gray-700">Brand:</td>
                      <td className="p-4 text-gray-700">
                        {product.brand_name}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 text-gray-700">Category:</td>
                      <td className="p-4 text-gray-700">
                        {product.category
                          ? JSON.parse(product.category).cat
                          : "N/A"}{" "}
                        {product.sub_category
                          ? JSON.parse(product.sub_category).cat
                          : "N/A"}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 text-gray-700">Condition:</td>
                      <td className="p-4 text-gray-700">
                        {product.product_condition || "New"}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-4 text-gray-700">Warranty:</td>
                      <td
                        className="p-4 text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: product?.warranty_info,
                        }}
                      />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "PRODUCT VIDEOS" && videoUrls.length > 0 && (
              <div className="flex flex-col items-center justify-center">
                {videoUrls.map((url, idx) => {
                  const youtubeId = getYouTubeId(url);
                  const thumbnail = youtubeId
                    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                    : null;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center my-2 w-full"
                      style={{
                        minWidth: 0,
                        maxWidth: "640px",
                        width: "100%",
                      }}
                    >
                      <div className="flex justify-center w-full">
                        <div className="relative w-full aspect-video rounded-md bg-gray-100 border border-gray-300 overflow-hidden shadow flex justify-center items-center max-w-[640px]">
                          {playingVideoIdx === idx ? (
                            youtubeId ? (
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                                title={`Product video ${idx + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <video
                                width="100%"
                                height="100%"
                                controls
                                autoPlay
                                onEnded={() => setPlayingVideoIdx(-1)}
                              >
                                <source src={url} />
                                Your browser does not support the video tag.
                              </video>
                            )
                          ) : (
                            <div
                              className="group relative w-full h-full cursor-pointer flex items-center justify-center"
                              onClick={() => setPlayingVideoIdx(idx)}
                              title="Play video"
                            >
                              {youtubeId ? (
                                <img
                                  src={thumbnail}
                                  alt={`Video thumbnail ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-500">Video</span>
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg">
                                  <div className="w-0 h-0 border-t-[12px] sm:border-t-[16px] border-t-transparent border-l-[18px] sm:border-l-[24px] border-l-white border-b-[12px] sm:border-b-[16px] border-b-transparent ml-2"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        {playingVideoIdx === idx && (
                          <button
                            className="block cursor-pointer text-xs text-red-600 mt-1 underline"
                            onClick={() => setPlayingVideoIdx(-1)}
                            type="button"
                          >
                            Close Video
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Recommended category={category} currentProductId={currentProductId} />
    </div>
  );
};

export default ProductDetails;
