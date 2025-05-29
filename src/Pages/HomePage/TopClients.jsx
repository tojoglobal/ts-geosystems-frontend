import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";

const TopClients = () => {
  const brands = [
    {
      id: 1,
      name: "Sinohydro",
      image:
        "https://ts-geosystems.com.bd/assets/images/xG2F4380367e82c88e06edd079ee71c925d4.jpeg",
      url: "/catalog?brand=SinoHydro",
    },
    {
      id: 2,
      name: "Corporation",
      image: "https://ts-geosystems.com.bd/assets/images/VQ4k1624769132308.jpg",
      url: "/catalog?brand=Corporation",
    },
    {
      id: 3,
      name: "Italian-Thai",
      image:
        "https://ts-geosystems.com.bd/assets/images/IPfMLOGO%20ITALIAN-THAI1.png",
      url: "/catalog?brand=Italian-Thai",
    },
    {
      id: 4,
      name: "RHD",
      image:
        "https://ts-geosystems.com.bd/assets/images/HzEball-client-logo_07.jpg",
      url: "/catalog?brand=RHD",
    },
    {
      id: 5,
      name: "CCCC",
      image: "https://ts-geosystems.com.bd/assets/images/fKo7cccc.png",
      url: "/catalog?brand=CCCC",
    },
    {
      id: 6,
      name: "OSJI",
      image: "https://ts-geosystems.com.bd/assets/images/0VhA1-OSJI-Logo.jpg",
      url: "/catalog?brand=OSJI",
    },
    {
      id: 7,
      name: "DORREN",
      image: "https://ts-geosystems.com.bd/assets/images/iQwZ1580296185.png",
      url: "/catalog?brand=DORREN",
    },
    {
      id: 8,
      name: "Tss",
      image:
        "https://ts-geosystems.com.bd/assets/images/sYTHbrand-rothbucher-systeme-ezgif.com-webp-to-jpg-converter.jpg",
      url: "/catalog?brand=Tss",
    },
    {
      id: 9,
      name: "Posco",
      image: "https://ts-geosystems.com.bd/assets/images/bguq0.jpg",
      url: "/catalog?brand=Posco",
    },
  ];

  return (
    <div className="py-5 md:py-16">
      <div className="max-w-[1370px] mx-auto px-3">
        <div className="flex items-center justify-center gap-4 mb-5 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            TOP CLIENTS
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
                  to={brand.url}
                  className="brand-card p-4 transition-all duration-300 rounded-lg h-32 flex items-center justify-center"
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="cursor-pointer swiper-button-prev-custom hidden group-hover:block absolute -left-1 md:-left-5 top-[50%] -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
            <IoIosArrowBack size={18} className="text-white" />
          </button>
          <button className="cursor-pointer swiper-button-next-custom hidden group-hover:block absolute -right-1 md:-right-5 top-[50%] -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
            <IoIosArrowForward size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopClients;
