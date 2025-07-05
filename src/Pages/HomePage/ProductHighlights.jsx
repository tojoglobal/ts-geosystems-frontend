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
import { ComponentLoader } from "../../utils/Loader/ComponentLoader";
import { useVatEnabled } from "../../Hooks/useVatEnabled";
import { formatBDT } from "../../utils/formatBDT";
import AddToCartButton from "../../Components/AddToCartButton";

const tabOptions = [
  { name: "Featured Products", key: "featured" },
  { name: "Top Sellers", key: "top" },
  { name: "New Products", key: "new" },
];

const ProductHighlights = () => {
  const { trackProductView } = useTrackProductView();
  const [activeTab, setActiveTab] = useState("featured");
  const [items, setItems] = useState([]);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
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
    // Reset Swiper position when tab changes to ensure correct arrow state
    if (swiperRef.current) {
      swiperRef.current.slideTo(0); // Go to the first slide
    }
  }, [activeTab, highlightsData, isLoading, error]);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const slideNext = () => {
    swiperRef.current?.slideNext();
  };

  const slidePrev = () => {
    swiperRef.current?.slidePrev();
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
        {/* Tab Options - Original desktop design with mobile modifications */}
        <div className="flex flex-col sm:flex-row sm:gap-4 sm:px-3 py-[2px] w-full sm:w-auto">
          {tabOptions.map((tab, idx) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative group cursor-pointer w-full sm:w-auto text-center sm:text-left ${
                tab.key === "new" ? "flex justify-between items-center" : ""
              } ${
                idx < 2
                  ? "sm:border-b-0 border-b border-gray-200 pb-1 sm:pb-0"
                  : ""
              } ${idx === 0 && "py-[2px] sm:py-0"} ${
                idx === 1 && "pt-1 sm:pt-0"
              } ${idx === 2 && "py-[3px] sm:py-0"}`}
            >
              <h2
                className={`text-base py-1 uppercase md:text-[20px] font-semibold w-full sm:w-fit sm:pr-4 ${
                  activeTab === tab.key ? "text-[#e62245]" : "text-black"
                } ${
                  idx < tabOptions.length - 1
                    ? "sm:border-r sm:border-gray-200"
                    : ""
                }`}
              >
                {tab.name}
              </h2>
              {/* Mobile arrows only for "New Products" */}
              {tab.key === "new" && (
                <div className="sm:hidden flex gap-2 ml-2">
                  <div
                    className={`cursor-pointer ${
                      isBeginning
                        ? "text-gray-200 cursor-not-allowed"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      slidePrev();
                    }}
                  >
                    <IoIosArrowBack size={18} />
                  </div>
                  <div
                    className={`cursor-pointer ${
                      isEnd
                        ? "text-gray-200 cursor-not-allowed"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      slideNext();
                    }}
                  >
                    <IoIosArrowForward size={18} />
                  </div>
                </div>
              )}
              <span
                className={`${
                  idx !== 0 ? "-left-4" : "-left-3"
                } absolute -left-3 -bottom-[4px] h-[3px] bg-[#e62245] transition-all duration-300 w-0 group-hover:w-full`}
              />
            </div>
          ))}
        </div>
        {/* Desktop Navigation Arrows (hidden on mobile) */}
        <div className="hidden sm:flex gap-2 pt-2 lg:pt-0 pr-4">
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
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            640: {
              slidesPerView: 4,
              slidesPerGroup: 4,
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
            // vat part
            let vat = 0;
            try {
              vat = item?.tax ? JSON.parse(item.tax).value : 0;
            } catch {
              vat = 0;
            }
            const basePrice = parsePrice(item.price) || 0;
            const vatAmount = basePrice * (vat / 100);
            const priceIncVat = basePrice + vatAmount;

            return (
              <SwiperSlide key={idx}>
                <div className="relative flex flex-col items-center bg-white h-full">
                  {item?.sale === 1 && (
                    <p className="absolute top-1 right-3 px-2 py-[1px] font-bold rounded-[4px] text-white text-[10px] md:text-sm bg-[#e62245] z-50">
                      SALE
                    </p>
                  )}
                  <Link to={`/product/${item.slug}`}>
                    <div className="relative group mb-2 w-full max-w-[200px] md:max-w-[260px] mx-auto">
                      {item.image_urls &&
                        JSON.parse(item.image_urls).length > 0 && (
                          <>
                            <img
                              src={`${import.meta.env.VITE_OPEN_APIURL}${
                                JSON.parse(item.image_urls)[0]
                              }`}
                              alt={item.product_name}
                              className="w-full h-36 sm:h-32 md:h-[256.19px] transition-opacity duration-300 group-hover:opacity-0"
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
                        to={`/product/${item.slug}`}
                        className="font-semibold min-h-10 text-xs md:text-sm text-gray-700 hover:text-[#e62245]"
                      >
                        {item.product_name}
                      </Link>
                    </div>
                    <div className="space-x-2">
                      {vatEnabled ? (
                        <p className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#222]">
                          <span>
                            ৳ {item?.priceShowHide ? "" : formatBDT(basePrice)}
                          </span>
                          <span className="underline text-gray-400 text-xs md:text-sm">
                            (Ex. VAT)
                          </span>
                        </p>
                      ) : (
                        <p className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#222]">
                          <span>
                            ৳ {item?.priceShowHide ? "" : formatBDT(basePrice)}
                          </span>
                        </p>
                      )}
                      {item.discountPrice && (
                        <span className="text-xs line-through text-gray-400">
                          ৳{item?.discountPrice}
                        </span>
                      )}
                    </div>
                    {vatEnabled && (
                      <div className="flex items-center gap-1 text-xs md:text-sm text-[#b3b3b5]">
                        ৳ {item?.priceShowHide ? "" : formatBDT(priceIncVat)}
                        <span className="underline">(Inc. VAT)</span>
                      </div>
                    )}
                    {item?.isStock === 1 && (
                      <div className="w-full">
                        <>
                          {Number(item?.priceShowHide) === 1 ? (
                            // Case 2: GET QUOTATION
                            <Link
                              onClick={() => trackProductView(item.id)}
                              to={`/product/${item.slug}`}
                            >
                              <button className="w-full bg-[#e62245] cursor-pointer text-[10px] md:text-sm text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                GET QUOTATION
                              </button>
                            </Link>
                          ) : (
                            <AddToCartButton
                              product={item}
                              quantity={1}
                              selectedOptions={[]}
                            />
                          )}
                        </>
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
