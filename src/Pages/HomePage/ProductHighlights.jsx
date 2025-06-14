import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";
import { useTrackProductView } from "../../Hooks/useTrackProductView";
import { parsePrice } from "../../utils/parsePrice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { addToCart } from "../../features/AddToCart/AddToCart";
import { slugify } from "../../utils/slugify";
import { getProductType } from "../../utils/productOption";
import { ComponentLoader } from "../../utils/Loader/ComponentLoader";
import useToastSwal from "../../Hooks/useToastSwal";
import { useVatEnabled } from "../../Hooks/useVatEnabled";

const tabOptions = [
  { name: "Featured Products", key: "featured" },
  { name: "Top Sellers", key: "top" },
  { name: "New Products", key: "new" },
];

const ProductHighlights = () => {
  const dispatch = useDispatch();
  const { trackProductView } = useTrackProductView();
  const [activeTab, setActiveTab] = useState("featured");
  const [items, setItems] = useState([]);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const showToast = useToastSwal();
  const [isEnd, setIsEnd] = useState(false);
  const { data: vatEnabled = true, isLoading: vatLoading } = useVatEnabled();
  const {
    data = {},
    isLoading,
    error,
  } = useDataQuery(["productHighlights"], "/api/product-highlights");
  const highlightsData = data?.data;

  useEffect(() => {
    if (!isLoading && !error && highlightsData) {
      if (activeTab === "featured") setItems(highlightsData.featured || []);
      else if (activeTab === "top") setItems(highlightsData.top || []);
      else if (activeTab === "new") setItems(highlightsData.new || []);
    }
  }, [activeTab, highlightsData, isLoading, error]);

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

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  if (isLoading || vatLoading)
    return <ComponentLoader componentName="ProductHighlights" />;

  if (error) {
    return (
      <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto py-12">
        Error loading product highlights
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto rounded-md px-3 md:px-0 py-6 md:py-12 bg-white relative">
      {/* Tab Header */}
      <div className="flex flex-row justify-between md:items-center md:justify-between border border-gray-200 rounded-l-[4px] relative">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 px-3 py-[2px]">
          {tabOptions.map((tab, idx) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative group cursor-pointer"
            >
              <h2
                className={`text-base py-1 uppercase md:text-[20px] font-semibold w-fit pr-4 border-r border-gray-200 ${
                  activeTab === tab.key ? "text-[#e62245]" : "text-black"
                }`}
              >
                {tab.name}
              </h2>
              <span
                className={`${
                  idx !== 0 ? "-left-4" : "-left-3"
                } absolute -left-3 -bottom-[4px] h-[3px] bg-[#e62245] transition-all duration-300 w-0 group-hover:w-full`}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 lg:pt-0 pr-4">
          <div
            className={`swiper-button-prev-custom cursor-pointer ${
              isBeginning
                ? "text-gray-200 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <IoIosArrowBack size={22} />
          </div>
          <div
            className={`swiper-button-next-custom cursor-pointer ${
              isEnd
                ? "text-gray-200 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <IoIosArrowForward size={22} />
          </div>
        </div>
      </div>
      {/* Swiper */}
      <div className="mt-4">
        <Swiper
          modules={[Navigation]}
          spaceBetween={9}
          slidesPerView={4}
          slidesPerGroup={4}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            640: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            1536: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
          }}
        >
          {items.map((item, idx) => {
            const { isSimpleProduct } = getProductType(item);
            const taxData = item.tax ? JSON.parse(item.tax) : null;
            const price = parseFloat(item.price) || 0;
            const priceExVat = price * (1 + (taxData?.value || 0) / 100);

            return (
              <SwiperSlide key={idx}>
                <div className="relative flex flex-col items-center bg-white h-full">
                  {item?.sale === 1 && (
                    <p className="absolute top-1 right-3 px-2 py-[1px] font-bold rounded-[4px] text-white text-[14px] bg-[#e62245] z-50">
                      SALE
                    </p>
                  )}
                  <Link
                    to={`/products/${item.id}/${slugify(
                      item.product_name || ""
                    )}`}
                  >
                    <div className="relative group w-full max-w-[200px] md:max-w-[260px] mx-auto">
                      {item.image_urls &&
                        JSON.parse(item.image_urls).length > 0 && (
                          <>
                            <img
                              src={`${import.meta.env.VITE_OPEN_APIURL}${
                                JSON.parse(item.image_urls)[0]
                              }`}
                              alt={item.product_name}
                              className="w-full h-44 md:h-[256.19px] transition-opacity duration-300 group-hover:opacity-0"
                            />
                            {JSON.parse(item.image_urls).length > 1 && (
                              <img
                                src={`${import.meta.env.VITE_OPEN_APIURL}${
                                  JSON.parse(item.image_urls)[1]
                                }`}
                                alt={`${item.product_name} hover`}
                                className="w-full h-44 md:h-[256.19px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                              />
                            )}
                          </>
                        )}
                    </div>
                  </Link>
                  <div className="w-full border-t border-gray-200 mt-3 pt-2 flex flex-col flex-grow space-y-1">
                    <p className="text-xs capitalize text-gray-700">
                      {item.category
                        ? JSON.parse(item.category).cat
                        : "Category"}{" "}
                      | Sku: {item.sku || "N/A"}
                    </p>
                    <div className="flex items-start">
                      <Link
                        to={`/products/${item.id}/${slugify(
                          item.product_name || ""
                        )}`}
                        className="font-semibold min-h-10 text-sm text-gray-600 hover:text-[#e62245]"
                      >
                        {item.product_name}
                      </Link>
                    </div>
                    <div className="space-x-2">
                      {vatEnabled ? (
                        <p className="flex items-center gap-2 text-sm font-bold text-[#222]">
                          <span>৳{price}</span>
                          <span className="underline text-gray-400 text-sm">
                            (Ex. VAT)
                          </span>
                        </p>
                      ) : (
                        <p className="flex items-center gap-2 text-sm font-bold text-[#222]">
                          <span>৳{price}</span>
                        </p>
                      )}
                      {item.discountPrice && (
                        <span className="text-xs line-through text-gray-400">
                          ৳{item.discountPrice}
                        </span>
                      )}
                    </div>
                    {vatEnabled && (
                      <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                        ৳{priceExVat.toFixed(2)}{" "}
                        <span className="underline">(Inc. VAT)</span>
                      </div>
                    )}
                    {item?.isStock === 1 && (
                      <div className="w-full">
                        {isSimpleProduct ? (
                          <>
                            {Number(item?.priceShowHide) === 1 ? (
                              // Case 2: GET QUOTATION
                              <Link
                                onClick={() => trackProductView(item.id)}
                                to={`/products/${item.id}/${slugify(
                                  item.product_name || ""
                                )}`}
                              >
                                <button className="w-full bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                  GET QUOTATION
                                </button>
                              </Link>
                            ) : (
                              // Case 3: ADD TO CART
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="w-full bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                              >
                                ADD TO CART
                              </button>
                            )}
                          </>
                        ) : (
                          // Case 1: CHOOSE OPTION
                          <Link
                            onClick={() => trackProductView(item.id)}
                            to={`/products/${item.id}/${slugify(
                              item.product_name || ""
                            )}`}
                          >
                            <button className="w-full bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                              CHOOSE OPTION
                            </button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductHighlights;
