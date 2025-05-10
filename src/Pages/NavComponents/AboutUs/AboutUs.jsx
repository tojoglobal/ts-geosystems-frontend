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

const AboutUs = () => {
  const axiosPublicUrl = useAxiospublic();

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

  if (isLoading) return <Loader />;
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
        <p className="text-gray-700 text-[14px]">
          {aboutContent?.section1_description}
        </p>
      </div>
      <div className="mb-8 border-t pt-3">
        <h2 className="text-[#e62245] text-[18px] font-semibold mb-4">
          {aboutContent?.section2_title}
        </h2>
        <ul className="list-disc text-gray-700 space-y-1 pl-2 text-[14px]">
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
        <p className="text-gray-700 mb-6 text-[14px]">
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
          <p className="mt-2 text-gray-700 text-[14px]">
            {aboutContent?.section4_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section5_title}
          </h3>
          <p className="mt-2 text-gray-700 text-[14px]">
            {aboutContent?.section5_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section6_title}
          </h3>
          <p className="mt-2 text-gray-700 text-[14px]">
            {aboutContent?.section6_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section7_title}
          </h3>
          <p className="mt-2 text-gray-700 text-[14px]">
            {aboutContent?.section7_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section8_title}
          </h3>
          <p className="mt-2 text-gray-700 text-[14px]">
            {aboutContent?.section8_description}
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-[18px] font-semibold text-[#e62245]">
            {aboutContent?.section9_title}
          </h3>
          <p className="mt-2 text-gray-700 text-[14px]">
            {aboutContent?.section9_description}
          </p>
        </section>
      </div>
      <section className="my-12 relative">
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
          {[
            {
              name: "Chartwell",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/a7832d91-6d86-4b77-947a-ff429aa6fc12.png",
              link: "/chartwell",
            },
            {
              name: "SURVIPOD",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/ec4238ba-3eba-4030-9963-67a42faf2e75.png",
              link: "/chartwell",
            },
            {
              name: "VIVAX METROTECH",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/a791e65d-defd-4ec8-8f33-64539bbaaf1a/brand-vivax-metrotech.webp",
              link: "/chartwell",
            },
            {
              name: "Hundred 2024",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/b67f54d0-e3c7-4031-8daa-75fc89ff512b.png",
              link: "/chartwell",
            },
            {
              name: "Partner 5",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/ec4238ba-3eba-4030-9963-67a42faf2e75.png",
              link: "/chartwell",
            },
            {
              name: "Partner 6",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/b67f54d0-e3c7-4031-8daa-75fc89ff512b.png",
              link: "/chartwell",
            },
          ].map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-12 rounded shadow flex items-center justify-center">
                <Link to={partner.link}>
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="max-h-36 w-auto object-contain"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="swiper-button-prev-custom absolute -left-1 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowBack size={18} className="text-gray-600" />
        </button>
        <button className="swiper-button-next-custom absolute -right-1 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowForward size={24} className="text-gray-600" />
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
