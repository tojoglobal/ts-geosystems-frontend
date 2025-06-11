import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import useDataQuery from "../../utils/useDataQuery";

const TopClients = () => {
  const { data, isLoading, error } = useDataQuery(
    ["top-clients"],
    "/api/get-top-clients",
    true,
    (raw) => raw?.data || []
  );

  return (
    <div className="py-5 md:py-16">
      <div className="w-full max-w-[95%] 2xl:max-w-[1370px] mx-auto px-3">
        <div className="flex items-center justify-center gap-4 mb-5 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            TOP CLIENTS
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0b6d7f]"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-4">
            Failed to load clients
          </p>
        ) : (
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
              {(data || []).map((client) => (
                <SwiperSlide key={client.id}>
                  <div className="brand-card p-4 transition-all duration-300 rounded-lg h-32 flex items-center justify-center">
                    <img
                      src={
                        client.imageUrl?.startsWith("http")
                          ? client.imageUrl
                          : import.meta.env.VITE_OPEN_APIURL + client.imageUrl
                      }
                      alt=""
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
        )}
      </div>
    </div>
  );
};

export default TopClients;
