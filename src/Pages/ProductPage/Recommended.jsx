import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../HomePage/TotalStation.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const items = [
  {
    name: "Kolida CTS-662R10 Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-632R10M Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-662R10 Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-632R10M Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-662R10 Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-632R10M Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-662R10 Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-632R10M Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-662R10 Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
  {
    name: "Kolida CTS-632R10M Total Station",
    img: "https://ts-geosystems.com.bd/assets/images/f6ID2zYF.png",
    link: "https://ts-geosystems.com.bd/product/Kolida-KTS470-Windows-Total-Station",
    price: "162,174.39",
    discountPrice: "225,297.94",
  },
];

const Recommended = () => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, []);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="max-w-[1370px] mx-auto rounded-md py-6 relative">
      {/* Tab Header */}
      <div className="flex items-center justify-between border border-gray-200">
        <div className="relative group px-3 py-1">
          <div className="relative">
            <h2 className="text-[#e62245] text-base py-1 uppercase text-[20px] font-semibold w-fit pr-3 border-r border-gray-200">
              RECOMMENDED
            </h2>
            <span className="absolute -left-3 -bottom-[6px] h-[4px] w-0 bg-[#e62245] transition-all duration-300 group-hover:w-full"></span>
          </div>
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
          spaceBetween={10}
          slidesPerView={3}
          slidesPerGroup={3}
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
          }}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative flex flex-col items-center bg-white h-full">
                {/* <p className="absolute top-2 right-2 px-2 py-[2px] rounded-md text-white bg-[#e62245]">
                  SALE
                </p> */}
                <Link to={item?.link}>
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
                <div className="w-full border-t border-gray-200 pt-2 flex flex-col flex-grow">
                  <p className="text-xs text-gray-500">
                    Total Station | Sku: 65dVv8Jr8fe
                  </p>
                  <div className="min-h-[48px] flex items-start">
                    <Link
                      to={item?.link}
                      className="font-semibold text-sm text-gray-800"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="space-x-2">
                    <span className="text-sm font-bold text-[#222]">
                      ৳{item.price}
                    </span>
                    <span className="text-xs line-through text-gray-400">
                      ৳{item.discountPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                    ৳11994.00 <span className="underline">(Inc. VAT)</span>
                  </div>
                  <button className="mt-1 cursor-pointer bg-[#e62245] hover:bg-[#c91d3a] text-white text-sm font-semibold py-[6px] px-4 rounded w-full">
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

export default Recommended;
