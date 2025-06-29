import { Link } from "react-router-dom";
import useDataQuery from "../../../utils/useDataQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const CategoryBanner = () => {
  const { data = {}, isLoading } = useDataQuery(
    ["top-categories"],
    "/api/top-categories"
  );
  if (isLoading) return null;

  const categories = data?.categories || [];

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mt-5 md:mt-10 px-3 md:px-0 mx-auto">
      <div className="block sm:hidden">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          centeredSlides={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="category-swiper-mobile"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link
                to={`/${category.slug_name}`}
                className="group text-center cursor-pointer block"
              >
                <div className="overflow-hidden border border-gray-200 rounded-sm">
                  <img
                    src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                      category.photo
                    }`}
                    alt={category.category_name}
                    className="w-full mx-auto h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <p className="mt-1 uppercase text-base font-semibold transition-colors duration-300 group-hover:text-[#e62446]">
                  {category.category_name}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="hidden sm:grid sm:grid-cols-5 sm:gap-2 md:gap-5">
        {categories.map((category) => (
          <Link
            to={`/${category.slug_name}`}
            key={category.id}
            className="group text-center cursor-pointer"
          >
            <div className="overflow-hidden border border-gray-200 rounded-sm">
              <img
                src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                  category.photo
                }`}
                alt={category.category_name}
                className="w-full mx-auto h-28 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="mt-1 md:mt-2 uppercase text-xs md:text-sm font-semibold transition-colors duration-300 group-hover:text-[#e62446]">
              {category.category_name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryBanner;
