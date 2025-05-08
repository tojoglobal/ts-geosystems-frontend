import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const PopularBrands = () => {
  const brands = [
    {
      id: 1,
      name: "Leica",
      image:
        "https://ts-geosystems.com.bd/assets/images/MrWm6451596f6f2572643b59990f_logo%20(2).png",
      url: "/catalog?brand=Leica",
    },
    {
      id: 2,
      name: "Hi-Target",
      image:
        "https://ts-geosystems.com.bd/assets/images/dWTSHorizontal%20Logo.png",
      url: "/catalog?brand=Hi-Target",
    },
    {
      id: 3,
      name: "Geomax",
      image: "https://ts-geosystems.com.bd/assets/images/bRwcimages%20(1).png",
      url: "/catalog?brand=Geomax",
    },
    {
      id: 4,
      name: "Bosch",
      image:
        "https://ts-geosystems.com.bd/assets/images/kEwvpng-transparent-bosch-logo.png",
      url: "/catalog?brand=Bosch",
    },
    {
      id: 5,
      name: "Bosch",
      image:
        "https://ts-geosystems.com.bd/assets/images/B9l5Pentax-Logo.wine.png",
      url: "/catalog?brand=Bosch",
    },
    {
      id: 6,
      name: "Leica",
      image:
        "https://ts-geosystems.com.bd/assets/images/kEwvpng-transparent-bosch-logo.png",
      url: "/catalog?brand=Leica",
    },
    {
      id: 7,
      name: "Hi-Target",
      image: "https://ts-geosystems.com.bd/assets/images/7w2t5cf8bc5eb6f89.jpg",
      url: "/catalog?brand=Hi-Target",
    },
    {
      id: 8,
      name: "Geomax",
      image: "https://ts-geosystems.com.bd/assets/images/1737370495images.png",
      url: "/catalog?brand=Geomax",
    },
    {
      id: 9,
      name: "Bosch",
      image:
        "https://ts-geosystems.com.bd/assets/images/0oG5kolida-logo-gm.png",
      url: "/catalog?brand=Bosch",
    },
  ];

  return (
    <div className="py-5 md:py-16">
      <div className="max-w-[1370px] mx-auto px-4">
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-5 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            POPULAR BRANDS
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="relative">
          <div className="custom-prev absolute top-1/2 left-0 md:left-4 transform -translate-y-1/2 hover:bg-[#e62245] p-2 rounded-full cursor-pointer z-10">
            <FaChevronLeft size={20} />
          </div>
          <div className="custom-next absolute top-1/2 right-0 md:right-4 transform -translate-y-1/2 hover:bg-[#e62245] p-2 rounded-full cursor-pointer z-10">
            <FaChevronRight size={20} />
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={4}
            breakpoints={{
              0: {
                slidesPerView: 2,
              },
              640: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            className="brands-swiper"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <Link
                  to={brand.url}
                  className="brand-card p-4 transition-all duration-300 hover:border-[#e62245] hover:border-2 rounded-lg h-32 flex items-center justify-center"
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PopularBrands;
