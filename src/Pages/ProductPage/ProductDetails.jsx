import Swal from "sweetalert2";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { FaFacebook, FaLinkedin, FaTwitter, FaPinterest } from "react-icons/fa";
import Recommended from "./Recommended";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/AddToCart/AddToCart";
import { parsePrice } from "../../utils/parsePrice";

const ProductDetails = () => {
  const { id } = useParams();
  const axiosPublicUrl = useAxiospublic();
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
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosPublicUrl.get(`/api/products/${id}`);
      return res.data;
    },
  });

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
  // Parse product options if available
  const productOptions = product?.product_options
    ? JSON.parse(product.product_options)
    : [];

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

  const handleReadMoreClick = () => {
    setActiveTab("OVERVIEW");
    overviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white p-3">
      <div className="max-w-[1370px] mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Gallery */}
          <div className="flex flex-col items-start gap-4 relative">
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10">
              <div className="flex flex-col gap-2">
                <span className="bg-[#ffa000] text-white text-xs px-2 py-1 rounded">
                  Featured
                </span>
                {product.priceShowHide && (
                  <span className="bg-[#daa520] text-white text-xs px-2 py-1 rounded">
                    -17%
                  </span>
                )}
              </div>
            </div>
            <div className="w-[550px] h-[550px] border rounded-xl overflow-hidden">
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
            <h1 className="text-3xl text-black font-semibold mb-4">
              {product.product_name}
            </h1>
            <div className="flex items-center gap-2">
              {!!product.priceShowHide && (
                <div className="mb-2 text-xl line-through text-gray-400">
                  ৳{parsePrice(product.price)}.00
                </div>
              )}
              <div className="mb-4 text-3xl text-[#e62245] font-bold">
                ৳{parsePrice(product.price)}.00
              </div>
            </div>
            <p className="text-[#8d7f90] text-lg mb-4">
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
            </p>
            <div className="mb-2 text-[#8d7f90] border-t border-[#d3d3d3]">
              <strong>SKU:</strong>{" "}
              <span className="text-[#e62245]">{product.sku || "N/A"}</span>
            </div>
            <div className="mb-1 text-[#8d7f90]">
              <strong>Brand:</strong>{" "}
              <span className="text-[#e62245] capitalize">
                {product.brand_name || "N/A"}
              </span>
            </div>
            <div className="mb-1 text-[#8d7f90]">
              <strong>Categories:</strong>
              <span className="text-[#e62245] capitalize">
                {" "}
                {product.category ? JSON.parse(product.category).cat : "N/A"}
                {product.sub_category
                  ? JSON.parse(product.sub_category).cat
                  : "N/A"}
              </span>
            </div>
            <div className="mb-1 text-[#8d7f90]">
              <strong>Condition:</strong>
              <span className="text-[#e62245] capitalize">
                {product.product_condition || "New"}
              </span>
            </div>
            {/* Product Options */}
            {productOptions.length > 0 && (
              <div className="mb-6 text-[#8d7f90] flex gap-4">
                <div className="space-y-6">
                  {productOptions.map((option, index) => (
                    <div key={index} className="w-40">
                      <label className="block mb-2 text-gray-600 font-medium">
                        {option.label}
                      </label>
                      <select className="w-full appearance-none border border-gray-300 rounded py-[6px] px-3 text-gray-600 focus:outline-none focus:border-[#e62245]">
                        <option>{option.value}</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-600 font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 text-gray-600">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="relative overflow-hidden group text-white px-12 font-semibold py-[11px] rounded bg-[#e62245]"
            >
              <span className="absolute left-0 top-0 h-full w-0 bg-black transition-all duration-500 ease-out group-hover:w-full z-0"></span>
              <span className="relative z-10">ADD TO CART</span>
            </button>
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
          <div className="flex gap-2 border border-gray-300 rounded-md overflow-hidden">
            {["OVERVIEW", "SPECIFICATIONS", "PRODUCT VIDEOS"].map(
              (tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-base sm:text-2xl font-semibold px-4 py-3 transition-colors duration-200 ${
                    activeTab === tab
                      ? "text-[#e62245]"
                      : "text-gray-600 hover:text-[#e62245]"
                  } ${idx === 1 ? "border-x border-gray-300" : ""}`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
          <div className="border-2 border-[#e5e5e5] p-4">
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
      <Recommended />
    </div>
  );
};

export default ProductDetails;
