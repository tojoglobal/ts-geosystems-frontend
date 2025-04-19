import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';

const PopularBrands = () => {
    const brands = [
        {
            id: 1,
            name: "Leica",
            image: "https://ts-geosystems.com.bd/assets/images/MrWm6451596f6f2572643b59990f_logo%20(2).png",
        },
        {
            id: 2,
            name: "Hi-Target",
            image: "https://ts-geosystems.com.bd/assets/images/dWTSHorizontal%20Logo.png",
        },
        {
            id: 3,
            name: "Geomax",
            image: "https://ts-geosystems.com.bd/assets/images/bRwcimages%20(1).png",
        },
        {
            id: 4,
            name: "Bosch",
            image: "https://ts-geosystems.com.bd/assets/images/kEwvpng-transparent-bosch-logo.png",
        },
        {
            id: 5,
            name: "Bosch",
            image: "https://ts-geosystems.com.bd/assets/images/B9l5Pentax-Logo.wine.png",
        },
        {
            id: 6,
            name: "Leica",
            image: "https://ts-geosystems.com.bd/assets/images/kEwvpng-transparent-bosch-logo.png",
        },
        {
            id: 7,
            name: "Hi-Target",
            image: "https://ts-geosystems.com.bd/assets/images/7w2t5cf8bc5eb6f89.jpg",
        },
        {
            id: 8,
            name: "Geomax",
            image: "https://ts-geosystems.com.bd/assets/images/1737370495images.png",
        },
        {
            id: 9,
            name: "Bosch",
            image: "https://ts-geosystems.com.bd/assets/images/0oG5kolida-logo-gm.png",
        },
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="flex-1 h-0.5 bg-[#e62245]"></div>
                    <h2 className="text-center text-4xl font-bold text-[#e62245]">
                        POPULAR BRANDS
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
                                <div className="brand-card p-4 transition-all duration-300 hover:border-[#e62245] hover:border-2 rounded-lg h-32 flex items-center justify-center">
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default PopularBrands;