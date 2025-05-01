import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import banner1 from "../../../assets/banner/g21.webp";
import banner2 from "../../../assets/banner/g22.webp";
import banner3 from "../../../assets/banner/g23.webp";
import banner4 from "../../../assets/banner/g24.webp";
import banner5 from "../../../assets/banner/g25.webp";
import banner6 from "../../../assets/banner/g26.webp";

const slides = [
  {
    img: banner1,
    layout: "center",
    title: "Welcome to G2 Survey",
    subtitle: "Your trusted partner for precision surveying solutions",
    helpText: "How can we help you today?",
    links: [
      { label: "SALES", href: "/sales" },
      { label: "HIRE", href: "/hire" },
      { label: "SERVICE", href: "/service" },
      { label: "SUPPORT", href: "/support" },
    ],
  },
  {
    img: banner2,
    layout: "left",
    status: "IN STOCK",
    title: "Leica BLK360 Laser Scanner",
    subtitle:
      "Next Generation Imaging Laser Scanner – Ultra Fast, VIS Scan, Immersive HDR Imaging – From G2 – IN STOCK NOW!!",
    button: { label: "SHOP NOW", href: "/products/blk360" },
  },
  {
    img: banner3,
    layout: "center",
    title: "Radiodetection Authorized Dealer",
    subtitle:
      "Cable avoidance Tool (CAT), Genny & Precition Locator sales, Hire & calibration service",
    button: { label: "SHOP NOW", href: "/products/blk360" },
  },
  {
    img: banner4,
    layout: "left",
    status: "IN STOCK",
    title: "Refurbished TS16 Robotic Total Stations",
    subtitle: "Stock of 5' & 1' instruments - Next Day Delivery",
    button: { label: "SHOP NOW", href: "/products/x7" },
  },
  {
    img: banner5,
    layout: "left",
    status: "NEXT DAY DELIVERY",
    title: "G2 Survey Equipment Hire",
    subtitle:
      "3D Laser Scanners, Ronotic Total Stations, GNSS GPS Systems, Rotating Lasers, Digital Levels & More...",
    button: { label: "HIRE RATES - OPEN ACCCOUNT", href: "/hire" },
  },
  {
    img: banner6,
    layout: "left",
    title: "Your Leica Geosystems Fully Authorized Service Centre",
    subtitle:
      "For All Your Total Station, GNSS, Laser Level & Level Calibration, Servicing & Repairs",
    button: { label: "CONTACT US", href: "/support" },
  },
];

const Banner = () => {
  useEffect(() => {
    const prev = document.querySelector(".custom-prev");
    const next = document.querySelector(".custom-next");
    if (prev && next) {
      prev.style.zIndex = 10;
      next.style.zIndex = 10;
    }
  }, []);

  return (
    <div className="relative w-full">
      <div className="custom-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#e62245] text-white p-2 rounded-full cursor-pointer z-10">
        <FaChevronLeft />
      </div>
      <div className="custom-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#e62245] text-white p-2 rounded-full cursor-pointer z-10">
        <FaChevronRight />
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 10000 }}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-[500px] swiper-fade custom-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[500px]">
              <img
                src={slide.img}
                alt={`Banner ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 text-white px-4 flex ${
                  slide.layout === "center"
                    ? "justify-center items-center text-center"
                    : "justify-start items-center"
                }`}
              >
                <div
                  className={`space-y-4 max-w-2xl ${
                    slide.layout === "left" ? "ml-12" : ""
                  }`}
                >
                  {slide.status && (
                    <span
                      className={`${
                        slide === slides[1] ||
                        slide === slides[3] ||
                        slide === slides[4]
                          ? "border-2 border-[#e62245] text-[#e62245]"
                          : "bg-[#e62245] text-white"
                      }  px-3 py-1 text-sm font-semibold rounded`}
                    >
                      {slide.status}
                    </span>
                  )}
                  {slide.title && (
                    <h2
                      className={`mt-3 ${
                        slide === slides[0]
                          ? "text-2xl md:text-4xl"
                          : "text-xl md:text-3xl"
                      } font-bold text-[#e62245]`}
                    >
                      {slide.title}
                    </h2>
                  )}
                  {slide.subtitle && (
                    <p
                      className={`${
                        slide === slides[0]
                          ? "text-lg md:text-xl"
                          : "text-md md:text-lg"
                      } ${
                        slide === slides[4] ? "text-[#e62245]" : "text-white"
                      }`}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.helpText && (
                    <p className="text-lg">{slide.helpText}</p>
                  )}
                  {slide.links && (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {slide.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href}
                          className="underline text-xl text-[#e62245] transition"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                  {slide.button && (
                    <a
                      href={slide.button.href}
                      className={`${
                        slide === slides[4] ||
                        slide === slides[1] ||
                        slide === slides[2] ||
                        slide === slides[3]
                          ? "text-[#e62245]"
                          : "text-white hover:bg-[#e62245]"
                      } inline-block border-2 border-[#e62245] px-5 py-2 transition rounded`}
                    >
                      {slide.button.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
