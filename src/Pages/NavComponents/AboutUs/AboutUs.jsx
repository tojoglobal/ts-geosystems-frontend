import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import GoogleReview from "./GoogleReview";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import Loader from "../../../utils/Loader";
import useDataQuery from "../../../utils/useDataQuery";

const AboutUs = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data = [], isLoading: loading } = useDataQuery(
    ["popularBrand"],
    "/api/brands"
  );

  const {
    data: aboutContent,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["aboutContent"],
    queryFn: async () => {
      const { data } = await axiosPublicUrl.get("/api/about-us");
      return data.data;
    },
  });
  const brands = data.filter((brand) => brand.is_populer === 1);

  if (isLoading || loading) return <Loader />;
  if (isError) return <p>Error loading data...</p>;

  const section2Points = aboutContent?.section2_points || [];

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-3">
        <Link to="/" className="text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/about-us" className="uppercase text-[#e62245]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {aboutContent?.who_we_serve_image &&
            Array(4)
              .fill(null)
              .map((_, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_OPEN_APIURL}${
                    aboutContent.who_we_serve_image
                  }`}
                  alt={index + 1}
                  className="w-full rounded-lg"
                />
              ))}
        </div>
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
        <button className="cursor-pointer swiper-button-prev-custom hidden group-hover:block absolute -left-1 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowBack size={18} className="text-gray-600" />
        </button>
        <button className="cursor-pointer swiper-button-next-custom hidden group-hover:block absolute -right-1 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowForward size={18} className="text-gray-600" />
        </button>
      </section>
      {/* Bottom Images */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {aboutContent?.bottom_section_image &&
          Array(2)
            .fill(null)
            .map((_, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_OPEN_APIURL}${
                  aboutContent.bottom_section_image
                }`}
                alt={`About us ${index + 1}`}
                className="w-full rounded-lg"
              />
            ))}
      </section>
      <GoogleReview />
    </div>
  );
};

export default AboutUs;
