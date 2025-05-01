import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "https://ts-geosystems.com.bd/assets/images/17441130261726590713img2.jpg",
  "https://ts-geosystems.com.bd/assets/images/1726590513img1.jpg",
];

const BannerSlider = () => {
  return (
    <div className="md:w-full md:relative my-3 md:my-5 mx-3 md:container md:mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        className="w-full h-[150px] md:h-[400px] rounded-lg"
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
      <div className="custom-pagination absolute bottom-3 left-40 flex gap-2 z-10"></div>
      <style jsx>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: white;
          opacity: 0.6;
          border-radius: 50%;
          transition: opacity 0.3s;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          opacity: 1;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;
