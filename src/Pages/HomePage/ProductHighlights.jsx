import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const featured = [
  {
    name: "Featured Product 1",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    price: "100,000",
    discountPrice: "120,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Featured Product 2",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "110,000",
    discountPrice: "130,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Featured Product 3",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    price: "105,000",
    discountPrice: "125,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Featured Product 1",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    price: "100,000",
    discountPrice: "120,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Featured Product 2",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "110,000",
    discountPrice: "130,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Featured Product 3",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    price: "105,000",
    discountPrice: "125,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
];

const topSellers = [
  {
    name: "Top Seller 1",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "95,000",
    discountPrice: "115,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Top Seller 2",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "98,000",
    discountPrice: "118,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Top Seller 3",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "99,500",
    discountPrice: "119,500",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Top Seller 1",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "95,000",
    discountPrice: "115,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Top Seller 2",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "98,000",
    discountPrice: "118,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "Top Seller 3",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    price: "99,500",
    discountPrice: "119,500",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
];

const newProducts = [
  {
    name: "New Product 1",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "102,000",
    discountPrice: "122,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "New Product 2",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "108,000",
    discountPrice: "128,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "New Product 3",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    img2: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "106,000",
    discountPrice: "126,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "New Product 1",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "102,000",
    discountPrice: "122,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "New Product 2",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    price: "108,000",
    discountPrice: "128,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
  {
    name: "New Product 3",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    price: "106,000",
    discountPrice: "126,000",
    productUrl:
      "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
  },
];

const tabOptions = [
  { name: "Featured Products", key: "featured" },
  { name: "Top Sellers", key: "top" },
  { name: "New Products", key: "new" },
];

const ProductHighlights = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [items, setItems] = useState(featured);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (activeTab === "featured") setItems(featured);
    else if (activeTab === "top") setItems(topSellers);
    else if (activeTab === "new") setItems(newProducts);
  }, [activeTab]);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="container mx-auto rounded-md px-3 md:px-0 py-6 md:py-16 bg-white relative">
      {/* Tab Header */}
      <div className="flex items-center justify-between border border-gray-200">
        <div className="flex gap-3 sm:gap-6 px-3 py-1">
          {tabOptions.map((tab) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative group cursor-pointer"
            >
              <h2
                className={`p-2 text-lg uppercase sm:text-xl font-semibold w-fit pr-3 border-r border-gray-200 ${
                  activeTab === tab.key ? "text-[#e62245]" : "text-gray-500"
                }`}
              >
                {tab.name}
              </h2>
              <span className="absolute -left-3 -bottom-[5px] h-[4px] bg-[#e62245] transition-all duration-300 w-0 group-hover:w-full" />
            </div>
          ))}
        </div>
        {/* Custom Arrows */}
        <div className="flex gap-2 pr-4">
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
          spaceBetween={20}
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
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
            1600: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            },
          }}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative flex flex-col items-center p-4 rounded-md shadow-sm bg-white">
                {activeTab !== "featured" && (
                  <p className="absolute top-2 right-2 px-2 py-[2px] rounded-md text-white bg-[#e62245] z-50">
                    SALE
                  </p>
                )}
                <Link to={item?.productUrl}>
                  <div className="relative group w-full max-w-[120px] sm:max-w-[140px] md:max-w-[260px] mx-auto">
                    <img
                      src={item?.img}
                      alt={item.name}
                      className="w-full h-auto transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={item?.img2}
                      alt={`${item?.name} hover`}
                      className="w-full h-auto absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </Link>
                <div className="w-full border-t pt-3">
                  <p className="text-xs text-gray-700">
                    Total Station | Sku: 65dVv8Jr8fe
                  </p>
                  <Link
                    to={item?.productUrl}
                    className="font-semibold text-sm text-gray-600 mt-1"
                  >
                    {item.name}
                  </Link>
                  <div className="mt-2 space-x-2">
                    <span className="text-lg font-bold text-[#222]">
                      ৳{item.price}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      ৳{item.discountPrice}
                    </span>
                  </div>
                  <button className="mt-3 bg-[#e62245] hover:bg-[#c91d3a] text-white text-sm font-semibold py-2 px-4 rounded w-full">
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
