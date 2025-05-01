import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "https://ts-geosystems.com.bd/assets/images/1727116478Acer_Nitro_V15.jpg",
  "https://ts-geosystems.com.bd/assets/images/1727116649Pixel_9_Series_Available.jpg",
];

const GadSlide = () => {
  return (
    <div className="w-full container mx-auto relative my-5">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          el: ".gad-pagination",
        }}
        className="w-full h-[400px] rounded-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Unique Pagination Container */}
      <div className="gad-pagination absolute bottom-3 left-44 flex gap-2 z-10"></div>
      <style jsx>{`
        .gad-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: white;
          opacity: 0.6;
          border-radius: 50%;
          transition: opacity 0.3s;
        }
        .gad-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
};

export default GadSlide;
