import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const TopClients = () => {
    const brands = [
        {
            id: 1,
            name: "Sinohydro",
            image: "https://ts-geosystems.com.bd/assets/images/xG2F4380367e82c88e06edd079ee71c925d4.jpeg",
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
            image: "https://ts-geosystems.com.bd/assets/images/IPfMLOGO%20ITALIAN-THAI1.png",
            url: "/catalog?brand=Italian-Thai",
        },
        {
            id: 4,
            name: "RHD",
            image: "https://ts-geosystems.com.bd/assets/images/HzEball-client-logo_07.jpg",
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
            image: "https://ts-geosystems.com.bd/assets/images/sYTHbrand-rothbucher-systeme-ezgif.com-webp-to-jpg-converter.jpg",
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
        <div className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="flex-1 h-0.5 bg-[#e62245]"></div>
                    <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
                        TOP CLIENTS
                    </h2>
                    <div className="flex-1 h-0.5 bg-[#e62245]"></div>
                </div>

                <div className="relative">
                    <div className="custom-prev absolute top-1/2 left-4 transform -translate-y-1/2 hover:bg-[#e62245] p-2 rounded-full cursor-pointer z-10">
                        <FaChevronLeft size={20} />
                    </div>
                    <div className="custom-next absolute top-1/2 right-4 transform -translate-y-1/2 hover:bg-[#e62245] p-2 rounded-full cursor-pointer z-10">
                        <FaChevronRight size={20} />
                    </div>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={30}
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
                            nextEl: ".custom-next",
                            prevEl: ".custom-prev",
                        }}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        className="brands-swiper"
                    >
                        {brands.map((brand) => (
                            <SwiperSlide key={brand.id}>
                                <Link
                                    to={brand.url}
                                    className="brand-card p-4 transition-all duration-300 hover:border-[#e62245] hover:border-2 rounded-lg h-32 flex items-center justify-center"
                                >
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default TopClients;
