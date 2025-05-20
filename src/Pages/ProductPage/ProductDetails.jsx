import Swal from "sweetalert2";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { FaFacebook, FaLinkedin, FaTwitter, FaPinterest } from "react-icons/fa";
import Recommended from "./Recommended";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
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
    error,
  } = useDataQuery(["productDetails", id], `/api/products/${id}`, !!id);
  
  // Quantity handlers
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parsePrice(product.price),
      quantity: quantity,
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

  // Parse the image URLs from the product data
  const imageUrls = product?.image_urls ? JSON.parse(product.image_urls) : [];
  // Parse video URLs if available
  const videoUrls = product?.video_urls ? product.video_urls.split(",") : [];

  const category = product?.category ? JSON.parse(product.category).cat : null;
  const currentProductId = product?.id;
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product details</div>;
  }

  // Set default selected image if not set
  if (!selectedImage && imageUrls.length > 0) {
    setSelectedImage(imageUrls[0]);
  }

  return (
    <div className="bg-white p-3">
      <div className="max-w-[1370px] mx-auto">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image Gallery */}
          <div className="flex flex-col items-start gap-2 relative">
            {/* Badges */}
            {/* <div className="absolute top-2 left-2 z-10">
              <div className="flex flex-col gap-2">
                <span className="bg-[#ffa000] text-white text-xs px-2 py-1 rounded">
                  Featured
                </span>
                {product.priceShowHide ? (
                  <span className="bg-[#daa520] text-white text-xs px-2 py-1 rounded">
                    -17%
                  </span>
                ) : null}
              </div>
            </div> */}
            <div className="w-[550px] h-[550px] overflow-hidden">
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                modules={[Navigation, Thumbs]}
                className="w-full h-full"
              >
                {imageUrls.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${import.meta.env.VITE_OPEN_APIURL}${img}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {/* Swiper for thumbnails */}
            {imageUrls.length > 1 && (
              <Swiper
                spaceBetween={10}
                slidesPerView={4}
                modules={[Navigation, Thumbs]}
                className="w-80"
              >
                {imageUrls.map((img, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => setSelectedImage(img)}
                  >
                    <div className="border p-1 rounded cursor-pointer hover:ring-2 ring-[#e62245]">
                      <img
                        src={`${import.meta.env.VITE_OPEN_APIURL}${img}`}
                        alt={`Thumb ${index}`}
                        className="w-full h-16 object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
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
            {/* <p className="text-[#8d7f90] text-lg mb-4">
              {product.product_overview &&
                product.product_overview
                  .replace(/<[^>]+>/g, "")
                  .substring(0, 150) + "..."}
              <button
                onClick={handleReadMoreClick}
                className="text-[#e62245] cursor-pointer hover:underline"
              >
                Read more
              </button>
            </p> */}
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
                className="relative cursor-pointer overflow-hidden group text-white px-16 font-semibold py-[5px] rounded-[3px] text-[17px] bg-[#e62245]"
              >
                <span className="absolute left-0 top-0 h-full w-0 bg-black transition-all duration-500 ease-out group-hover:w-full z-0"></span>
                <span className="relative z-10">ADD TO CART</span>
              </button>
            )}
            <div className="mt-6">
              <div className="flex gap-2 text-white">
                <span className="font-medium mr-2 text-[#8d7f90]">Share:</span>
                <button className="bg-[#e62245] p-2 rounded">
                  <FaLinkedin />
                </button>
                <button className="bg-[#e62245] p-2 rounded">
                  <FaFacebook />
                </button>
                <button className="bg-[#e62245] p-2 rounded">
                  <FaTwitter />
                </button>
                <button className="bg-[#e62245] p-2 rounded">
                  <FaPinterest />
                </button>
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
