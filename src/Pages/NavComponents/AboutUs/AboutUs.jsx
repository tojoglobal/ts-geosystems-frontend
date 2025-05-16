import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import GoogleReview from "./GoogleReview";
import Loader from "../../../utils/Loader";
import useDataQuery from "../../../utils/useDataQuery";

const AboutUs = () => {
  const { data = [], isLoading: loading } = useDataQuery(
    ["popularBrand"],
    "/api/brands"
  );
  const brands = data.filter((brand) => brand.is_populer === 1);

  const {
    data: response = {},
    isLoading,
    isError,
  } = useDataQuery(["aboutContent"], "/api/about-us");
  const aboutContent = response.data || {};

  const { data: aboutUsImg = [], isLoading: imgLoading } = useDataQuery(
    ["aboutUsImage"],
    "/api/get-about-us-images"
  );

  // Filter images by section and show status
  const whoWeServeImages = aboutUsImg.filter(
    (img) => img.section === "who_we_serve" && img.show
  );
  const ourJourneyImages = aboutUsImg.filter(
    (img) => img.section === "our_journey" && img.show
  );
  const bottomImages = aboutUsImg.filter(
    (img) => img.section === "bottom_images" && img.show
  );

  if (isLoading || loading || imgLoading) return <Loader />;
  if (isError) return <p>Error loading data...</p>;

  const section2Points = aboutContent?.section2_points || [];

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-3">
        <Link to="/" className="text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/about-us" className="capitalize text-[#e62245]">
          About Us
        </Link>
      </div>
      <p className="text-[#e62245] font-light text-[28px] mb-6">ABOUT US</p>
      <div className="mb-8">
        <h2 className="text-[#e62245] text-[18px] font-semibold mb-4">
          {aboutContent?.section1_title}
        </h2>
        <p className="text-gray-700 text-sm">
          {aboutContent?.section1_description}
        </p>
      </div>
      <div className="mb-8 border-t pt-3">
        <h2 className="text-[#e62245] text-[18px] font-semibold mb-4">
          {aboutContent?.section2_title}
        </h2>
        <ul className="list-disc text-gray-700 space-y-1 pl-2 text-sm">
          {section2Points.length > 0 &&
            section2Points.map((point, index) => (
              <li key={index}>
                {index + 1}. {point}
              </li>
            ))}
        </ul>
      </div>
      <div className="mb-8 border-t pt-3">
        <h2 className="text-[#e62245] text-[18px] font-semibold mb-4">
          {aboutContent?.section3_title}
        </h2>
        <p className="text-gray-700 mb-6 text-sm">
          {aboutContent?.section3_description}
        </p>
        {whoWeServeImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-9">
            {whoWeServeImages.map((img, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_OPEN_APIURL}${img.filePath}`}
                alt={`Who we serve ${index + 1}`}
                className="w-full h-80 object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-5">
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section4_title}
          </h3>
          <p className="mt-2 text-gray-700 text-sm">
            {aboutContent?.section4_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section5_title}
          </h3>
          <p className="mt-2 text-gray-700 text-sm">
            {aboutContent?.section5_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section6_title}
          </h3>
          <p className="mt-2 text-gray-700 text-sm">
            {aboutContent?.section6_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section7_title}
          </h3>
          <p className="mt-2 text-gray-700 text-sm">
            {aboutContent?.section7_description}
          </p>
        </section>
        {ourJourneyImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-9">
            {ourJourneyImages.map((img, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_OPEN_APIURL}${img.filePath}`}
                alt={`Our journey ${index + 1}`}
                className="w-full h-80 object-cover rounded-md"
              />
            ))}
          </div>
        )}
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section8_title}
          </h3>
          <p className="mt-2 text-gray-700 text-sm">
            {aboutContent?.section8_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section9_title}
          </h3>
          <p className="mt-2 text-gray-700 text-sm">
            {aboutContent?.section9_description}
          </p>
        </section>
      </div>
      <section className="my-12 relative group">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          autoplay={{ delay: 3000 }}
          loop={true}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div className="w-full h-12 rounded shadow flex items-center justify-center">
                <Link to={brand.slug}>
                  <img
                    src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                      brand.photo
                    }`}
                    alt={brand.brands_name}
                    className="max-h-36 w-auto object-contain"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="cursor-pointer swiper-button-prev-custom hidden group-hover:block absolute -left-1 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
          <IoIosArrowBack size={18} className="text-white" />
        </button>
        <button className="cursor-pointer swiper-button-next-custom hidden group-hover:block absolute -right-1 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
          <IoIosArrowForward size={18} className="text-white" />
        </button>
      </section>
      {/* Bottom Images */}
      {bottomImages.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-9">
          {bottomImages.map((img, index) => (
            <img
              key={index}
              src={`${import.meta.env.VITE_OPEN_APIURL}${img.filePath}`}
              alt={`About us ${index + 1}`}
              className="w-full h-80 object-cover rounded-md"
            />
          ))}
        </section>
      )}
      <GoogleReview />
    </div>
  );
};

export default AboutUs;
