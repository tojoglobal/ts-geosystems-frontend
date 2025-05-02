import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "https://ts-geosystems.com.bd/assets/images/1727116478Acer_Nitro_V15.jpg",
  "https://ts-geosystems.com.bd/assets/images/1727116649Pixel_9_Series_Available.jpg",
];

const GadgetBanner = () => {
  return (
    <div className="md:w-full my-3 md:my-5 mx-3 md:max-w-[1300px] md:mx-auto">
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
            className="w-full h-[150px] md:h-[325px] rounded-lg"
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
        {/* Right: Static Image */}
        <div className="w-full md:w-[33%] overflow-hidden rounded-lg group">
          <img
            src="https://ts-geosystems.com.bd/assets/images/RsKp91pyTWS-COLLECTIONS.jpg"
            alt="Right Side"
            className="w-full h-[150px] md:h-[325px] object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default GadgetBanner;
