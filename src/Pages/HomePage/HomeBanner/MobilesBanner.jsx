import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "https://ts-geosystems.com.bd/assets/images/17441130261726590713img2.jpg",
  "https://ts-geosystems.com.bd/assets/images/1726590513img1.jpg",
];

const MobilesBanner = () => {
  return (
    <div className="md:w-full md:relative my-3 md:my-5 mx-3 md:max-w-[1300px] md:mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full h-[150px] md:h-[410px] rounded-lg relative"
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
      <div className="custom-pagination absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10"></div>
    </div>
  );
};

export default MobilesBanner;
