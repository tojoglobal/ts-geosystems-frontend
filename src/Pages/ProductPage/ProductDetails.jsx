import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import Recommended from "./Recommended";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { addToCart } from "../../features/AddToCart/AddToCart";
import { parsePrice } from "../../utils/parsePrice";
import useDataQuery from "../../utils/useDataQuery";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const overviewRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const {
    data: product = {},
    isLoading,
    isError,
    error,
  } = useDataQuery(["productDetails", id], `/api/products/${id}`, !!id);

  // Parse the image URLs from the product data
  const imageUrls = product?.image_urls ? JSON.parse(product.image_urls) : [];
  // Parse video URLs if available
  const videoUrls = product?.video_urls ? product.video_urls.split(",") : [];
  const category = product?.category ? JSON.parse(product.category).cat : null;
  const currentProductId = product?.id;

  // Set default selected image if not set, only on initial load or when product changes
  useEffect(() => {
    if (!selectedImage && imageUrls.length > 0) {
      setSelectedImage(imageUrls[0]);
    }
    // If product changes, ensure selectedImage resets
    // eslint-disable-next-line
  }, [product]);

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
    Swal.fire({
      title: "Added to Cart",
      text: `${product.product_name} has been added to your cart.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (isLoading) return null;
  if (isError)
    return <div>{error.message} ||Error loading product details</div>;

  return (
    <div className="bg-white p-3">
      <div className="max-w-[1370px] mx-auto">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image Gallery */}
          <div className="flex flex-col items-start gap-2 relative">
            {/* Main Image */}
            <div className="w-[550px] h-[550px] overflow-hidden border rounded">
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
              <div className="flex justify-center gap-2 mt-2 w-[550px]">
                {imageUrls.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`border p-1 rounded cursor-pointer hover:ring ring-black ${
                      selectedImage === img ? "ring ring-black" : ""
                    }`}
                    style={{ width: "70px", height: "70px" }}
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
          <div className="flex-1">
            <h1 className="text-[28px] font-semibold text-[#333] mb-4">
              {product.product_name}
            </h1>
            <p className="text-[#d71a28] text-sm mb-2 capitalize">
              {product.brand_name || "Brand"}
            </p>
            <div className="mb-2">
              <div className="text-[24px] font-semibold text-[#222]">
                Price:{" "}
                <span className="text-[#111]">
                  ৳{parsePrice(product.price)}.00{" "}
                  <span className="text-sm text-gray-500">(Ex. VAT)</span>
                </span>
              </div>
              <div className="text-[24px] font-semibold text-[#999] line-through">
                Price:{" "}
                <span className="text-[#999]">
                  ৳{(parsePrice(product.price) * 1.2).toFixed(2)}{" "}
                  <span className="text-sm text-gray-400">(Inc. VAT)</span>
                </span>
              </div>
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
                  className="px-[5px] py-[2px] text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <MdOutlineKeyboardArrowDown />
                </button>
                <span className="px-[5px] py-[2px] border-x border-gray-300 text-gray-600">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-[5px] py-[2px] text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <MdOutlineKeyboardArrowUp />
                </button>
              </div>
            </div>
            {product?.isStock === 1 && (
              <button
                onClick={handleAddToCart}
                className="cursor-pointer overflow-hidden group text-white px-18 font-semibold py-[4px] rounded-[3px] text-[17px] bg-[#e62245] hover:bg-red-800"
              >
                {/* <span className="absolute left-0 top-0 h-full w-0 bg-black transition-all duration-500 ease-out group-hover:w-full z-0"></span> */}
                <span className="relative z-10">ADD TO CART</span>
              </button>
            )}
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#8d7f90]">Share:</span>
                <div className="flex gap-1">
                  {/* Facebook */}
                  <button
                    className="flex justify-center items-center w-10 h-[29px] bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
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
                    className="flex justify-center items-center w-10 h-[29px] bg-[#0077B5] hover:bg-[#006097] transition-colors"
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
                    className="flex justify-center items-center w-10 h-[29px] bg-[#000000] hover:bg-[#333333] transition-colors"
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
                    className="flex justify-center items-center w-10 h-[29px] bg-[#25D366] hover:bg-[#1DA851] transition-colors"
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
        <div className="mt-12" ref={overviewRef}>
          <div className="flex gap-2 border-t border-l border-r border-gray-300 rounded-[4px] overflow-hidden">
            {["OVERVIEW", "SPECIFICATIONS", "PRODUCT VIDEOS"].map(
              (tab, idx) => (
                <div
                  key={tab}
                  className={`relative group px-4 py-2 cursor-pointer ${
                    idx === 1 ? "border-x border-gray-300" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span
                    className={`text-[20px] font-semibold transition-colors duration-200 ${
                      activeTab === tab
                        ? "text-[#e62245]"
                        : "text-gray-600 group-hover:text-[#e62245]"
                    }`}
                  >
                    {tab}
                  </span>
                  <span
                    className={`absolute ${
                      idx === 2 ? "-left-2" : "left-0"
                    } -bottom-[3px] h-[6px] bg-[#e62245] transition-all duration-300 w-0 group-hover:w-full`}
                  />
                </div>
              )
            )}
          </div>
          <div className="border-2 border-[#e5e5e5] rounded-[3px] p-4">
            {activeTab === "OVERVIEW" && (
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.product_overview }}
              />
            )}
            {activeTab === "SPECIFICATIONS" && (
              <div className="border rounded-lg overflow-hidden m-4">
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
              <div className="flex justify-center">
                {!isVideoPlaying ? (
                  <div
                    className="w-[640px] h-[360px] bg-gray-100 rounded-lg flex items-center justify-center"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center cursor-pointer">
                      <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[30px] border-l-white border-b-[20px] border-b-transparent ml-2"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-[640px] h-[360px] rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={videoUrls[0]}
                      title="Product video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
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
