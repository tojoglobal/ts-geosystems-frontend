import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useDataQuery from "../../../utils/useDataQuery";
const baseURL = import.meta.env.VITE_OPEN_APIURL;

// Static content for first slide
const firstSlideContent = {
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
};

// Layout configuration for slides 2-6 (indexes 1-5 in array)
const slideLayouts = [
  { layout: "left", status: "IN STOCK", buttonText: "SHOP NOW" }, // Slide 2
  { layout: "center", status: null, buttonText: "SHOP NOW" }, // Slide 3
  { layout: "left", status: "IN STOCK", buttonText: "SHOP NOW" }, // Slide 4
  {
    layout: "left",
    status: "NEXT DAY DELIVERY",
    buttonText: "HIRE RATES - OPEN ACCOUNT",
  }, // Slide 5
  { layout: "left", status: null, buttonText: "CONTACT US" }, // Slide 6
];

const MainBanner = () => {
  const {
    data = [],
    isLoading,
    error,
  } = useDataQuery(["mainBanner"], "/api/slides");

  useEffect(() => {
    const prev = document.querySelector(".custom-prev");
    const next = document.querySelector(".custom-next");
    if (prev && next) {
      prev.style.zIndex = 10;
      next.style.zIndex = 10;
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading slides</div>;

  // Get slides from API
  const apiSlides = data;
  const firstSlide = apiSlides[0];
  const dynamicSlides = apiSlides.slice(1, 6); // Get slides 2-6

  return (
    <div className="relative w-full">
      <div className="custom-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#e62245] text-white p-2 rounded-full cursor-pointer z-10">
        <FaChevronLeft />
      </div>
      <div className="custom-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#e62245] text-white p-2 rounded-full cursor-pointer z-10">
        <FaChevronRight />
      </div>

      <Swiper
        modules={[Navigation, Pagination, EffectFade]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ clickable: true }}
        // autoplay={{ delay: 10000 }}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-[540px] swiper-fade custom-swiper"
      >
        {/* First slide - dynamic image, static content */}
        {firstSlide && (
          <SwiperSlide key="first-slide">
            <div className="relative w-full h-[540px]">
              <img
                src={`${baseURL}${firstSlide.image_url}`}
                alt="Main Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 text-white px-4 flex justify-center items-center text-center">
                <div className="space-y-4 max-w-2xl">
                  <h2 className="mt-3 text-2xl md:text-4xl font-bold text-[#e62245]">
                    {firstSlideContent.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white">
                    {firstSlideContent.subtitle}
                  </p>
                  <p className="text-lg">{firstSlideContent.helpText}</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {firstSlideContent.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        className="underline text-xl text-[#e62245] transition"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}

        {/* Dynamic slides 2-6 */}
        {dynamicSlides.map((slide, i) => {
          const layoutConfig = slideLayouts[i];
          const isLeftLayout = layoutConfig.layout === "left";
          const isFourthSlide = i === 3; // Slide 5 in original (index 4 in dynamicSlides)

          return (
            <SwiperSlide key={`dynamic-${slide.id}`}>
              <div className="relative w-full h-[540px]">
                <img
                  src={`${baseURL}${slide.image_url}`}
                  alt={`Banner ${i + 2}`}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 text-white px-4 flex ${
                    isLeftLayout
                      ? "justify-start items-center"
                      : "justify-center items-center text-center"
                  }`}
                >
                  <div
                    className={`space-y-4 max-w-2xl ${
                      isLeftLayout ? "ml-12" : ""
                    }`}
                  >
                    {layoutConfig.status && (
                      <span
                        className={`${
                          isLeftLayout
                            ? "border-2 border-[#e62245] text-[#e62245]"
                            : "bg-[#e62245] text-white"
                        } px-3 py-1 text-sm font-semibold rounded`}
                      >
                        {layoutConfig.status}
                      </span>
                    )}
                    {slide.product_name && (
                      <h2 className="mt-3 text-xl md:text-3xl font-bold text-[#e62245]">
                        {slide.product_name}
                      </h2>
                    )}
                    {slide.product_description && (
                      <p
                        className={`text-md md:text-lg ${
                          isFourthSlide ? "text-[#e62245]" : "text-white"
                        }`}
                      >
                        {slide.product_description}
                      </p>
                    )}
                    {slide.product_link && (
                      <a
                        href={slide.product_link}
                        className={`${
                          isLeftLayout || !isLeftLayout
                            ? "text-[#e62245]"
                            : "text-white hover:bg-[#e62245]"
                        } inline-block border-2 border-[#e62245] px-5 py-2 transition rounded`}
                      >
                        {layoutConfig.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MainBanner;
