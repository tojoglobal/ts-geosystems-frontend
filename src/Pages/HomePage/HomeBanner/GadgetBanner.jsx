import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import useDataQuery from "../../../utils/useDataQuery";
import { SkeletonLoader } from "../../../utils/Loader/SkeletonLoader";

const GadgetBanner = () => {
  const { data = {}, isLoading } = useDataQuery(
    ["feature_highlight_banner_03_left"],
    "/api/feature-getupload-images"
  );
  const { data: banner = [], isLoading: loading } = useDataQuery(
    ["homepageSingleImages"],
    "/api/get-homepage-single-images"
  );

  if (isLoading || loading)
    return (
      <div className="md:w-full md:max-w-[95%] 2xl:max-w-[1370px] px-3 md:px-0 md:mx-auto flex flex-col md:flex-row gap-4 h-[150px] md:h-[320px]">
        <SkeletonLoader className="w-full md:w-[67%] h-full" />
        <SkeletonLoader className="w-full md:w-[33%] h-full" />
      </div>
    );

  return (
    <div className="w-full my-3 sm:my-4 md:my-5 px-3 sm:px-4 md:px-0 md:max-w-[95%] 2xl:max-w-[1370px] mx-auto">
      <div className="flex flex-col sm:flex-col md:flex-row gap-3 sm:gap-4 md:gap-4 h-auto md:h-[320px]">
        {/* Left: Swiper */}
        <div className="w-full md:w-[67%] relative group overflow-hidden rounded-lg h-[230px] sm:h-[240px] md:h-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            pagination={{ clickable: true }}
            className="w-full h-full rounded-lg"
          >
            {data.data.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${img?.photourl}`}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-pagination absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"></div>
        </div>
        {/* Right: Static Image */}
        <div className="w-full md:w-[33%] overflow-hidden rounded-lg group h-[180px] sm:h-[230px] md:h-full">
          <img
            src={`${import.meta.env.VITE_OPEN_APIURL}${
              banner?.data[0]?.imageUrl
            }`}
            alt="Right Side"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default GadgetBanner;
