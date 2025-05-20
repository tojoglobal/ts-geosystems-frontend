import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import useDataQuery from "../../../utils/useDataQuery";

const GadgetBanner = () => {
  const { data = {}, isLoading } = useDataQuery(
    ["feature_highlight_banner_03_left"],
    "/api/feature-getupload-images"
  );
  const { data: banner = [], isLoading: loading } = useDataQuery(
    ["homepageSingleImages"],
    "/api/get-homepage-single-images"
  );

  if (isLoading || loading) return null;

  return (
    <div className="md:w-full my-3 md:my-5 mx-3 md:max-w-[1370px] md:mx-auto">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        {/* Left: Swiper */}
        <div className="w-full md:w-[67%] md:relative group overflow-hidden rounded-lg">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            pagination={{ clickable: true }}
            className="w-full h-[150px] md:h-[320px] rounded-lg"
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
        <div className="w-full md:w-[33%] overflow-hidden rounded-lg group">
          <img
            src={`${import.meta.env.VITE_OPEN_APIURL}${
              banner?.data[0]?.imageUrl
            }`}
            alt="Right Side"
            className="w-auto h-[150px] md:h-[320px] object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default GadgetBanner;
