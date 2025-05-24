import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import useDataQuery from "../../utils/useDataQuery";

const PopularBrands = () => {
  const { data = [], isLoading } = useDataQuery(
    ["popularBrand"],
    "/api/brands"
  );

  if (isLoading) return null;
  const brands = data.filter((brand) => brand.home_page_show === 1);

  return (
    <div className="py-5 md:py-16">
      <div className="max-w-[1370px] mx-auto px-3 md:px-4">
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-5 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            POPULAR BRANDS
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="relative group">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={15}
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
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            className="brands-swiper"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <div
                  // to={`/catalog?brand=${brand.slug}`}
                  className="brand-card p-4 transition-all duration-300 hover:border-[#e62245] hover:border-2 rounded-lg h-32 flex items-center justify-center"
                >
                  <img
                    src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                      brand.photo
                    }`}
                    alt={brand.brands_name}
                    className="h-36 object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="cursor-pointer swiper-button-prev-custom hidden group-hover:block absolute -left-1 md:-left-4 top-[50%] -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
            <IoIosArrowBack size={18} className="text-white" />
          </button>
          <button className="cursor-pointer swiper-button-next-custom hidden group-hover:block absolute -right-1 md:-right-4 top-[50%] -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
            <IoIosArrowForward size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularBrands;
