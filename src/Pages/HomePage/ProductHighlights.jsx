import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";

const tabOptions = [
  { name: "Featured Products", key: "featured" },
  { name: "Top Sellers", key: "top" },
  { name: "New Products", key: "new" },
];

const ProductHighlights = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [items, setItems] = useState([]);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const {
    data = {},
    isLoading,
    error,
  } = useDataQuery(["productHighlights"], "/api/product-highlights");
  const highlightsData = data?.data;
  console.log(highlightsData);

  useEffect(() => {
    if (!isLoading && !error) {
      if (activeTab === "featured") setItems(highlightsData.featured || []);
      else if (activeTab === "top") setItems(highlightsData.top || []);
      else if (activeTab === "new") setItems(highlightsData.new || []);
    }
  }, [activeTab, highlightsData, isLoading, error]);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  if (isLoading) {
    return <div className="max-w-[1370px] mx-auto py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-[1370px] mx-auto py-12">
        Error loading product highlights
      </div>
    );
  }

  return (
    <div className="max-w-[1370px] mx-auto rounded-md px-3 md:px-0 py-6 md:py-12 bg-white relative">
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
                className={`text-base py-1 uppercase text-[20px] font-semibold w-fit pr-4 border-r border-gray-200 ${
                  activeTab === tab.key ? "text-[#e62245]" : "text-black"
                }`}
              >
                {tab.name}
              </h2>
              <span
                className={`${
                  idx !== 0 ? "-left-4" : "-left-3"
                } absolute -left-3 -bottom-[3px] h-[3px] bg-[#e62245] transition-all duration-300 w-0 group-hover:w-full`}
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
          {items.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative flex flex-col items-center bg-white h-full">
                {item?.sale === 1 && (
                  <p className="absolute top-1 right-3 px-2 py-[1px] font-bold rounded-[4px] text-white text-[14px] bg-[#e62245] z-50">
                    SALE
                  </p>
                )}
                <Link
                  to={`/product/${item.product_name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
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
                            className="w-full h-[256.19px] transition-opacity duration-300 group-hover:opacity-0"
                          />
                          {JSON.parse(item.image_urls).length > 1 && (
                            <img
                              src={`${import.meta.env.VITE_OPEN_APIURL}${
                                JSON.parse(item.image_urls)[1]
                              }`}
                              alt={`${item.product_name} hover`}
                              className="w-full h-[256.19px] absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            />
                          )}
                        </>
                      )}
                  </div>
                </Link>
                <div className="w-full border-t border-gray-200 mt-3 pt-2 flex flex-col flex-grow space-y-1">
                  <p className="text-xs text-gray-700">
                    {item.category ? JSON.parse(item.category).cat : "Category"}{" "}
                    | Sku: {item.sku || "N/A"}
                  </p>
                  <div className="flex items-start">
                    <Link
                      to={`/product/${item.product_name
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                      className="font-semibold text-sm text-gray-600 hover:text-[#e62245]"
                    >
                      {item.product_name}
                    </Link>
                  </div>
                  <div className="space-x-2">
                    <p className="flex items-center gap-2 text-sm font-bold text-[#222]">
                      <span> ৳{item.price}</span>
                      <span className="underline text-gray-400 text-sm">
                        (Ex. VAT)
                      </span>
                    </p>
                    {item.discountPrice && (
                      <span className="text-xs line-through text-gray-400">
                        ৳{item.discountPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                    ৳{item.price} <span className="underline">(Inc. VAT)</span>
                  </div>
                  <button className="mt-1 cursor-pointer bg-[#e62245] hover:bg-[#c91d3a] text-white text-sm font-semibold py-1.5 px-4 rounded w-full transition-colors duration-200">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductHighlights;
