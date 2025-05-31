import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import useDataQuery from "../../../utils/useDataQuery";

const PromoProductBanner = () => {
  const { data = [], isLoading } = useDataQuery(
    ["promoProductBanner"],
    "/api/getupload-images"
  );

  if (isLoading) return null;

  return (
    <div className="md:w-full md:relative my-3 md:my-5 mx-3 md:max-w-[1370px] md:mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full h-[150px] md:h-[425px] rounded-md relative"
      >
        {data?.data?.map((img, index) => (
          <SwiperSlide key={img.id || index}>
            <img
              src={`${import.meta.env.VITE_OPEN_APIURL}${img.photourl}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-pagination absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"></div>
    </div>
  );
};

export default PromoProductBanner;
