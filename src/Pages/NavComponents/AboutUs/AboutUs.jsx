import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import GoogleReview from "./GoogleReview";

const AboutUs = () => {
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">ABOUT US</span>
      </div>
      <p className="text-[#e62245] text-3xl mb-6">ABOUT US</p>
      <div className="mb-8">
        <h2 className="text-[#e62245] text-2xl font-semibold mb-4">Snapshot</h2>
        <p className="text-gray-700">
          To become Asia's No.1 "Surveyor's First" offering unique value
          proposition to all its clients by delivering high-end equipment and
          services that fits into the surveyor's daily duties and also ensure
          maximum return on investment.
        </p>
      </div>
      {/* Core Values Section */}
      <div className="mb-8 border-t pt-3">
        <h2 className="text-[#e62245] text-2xl font-semibold mb-4">
          What we do
        </h2>
        <ul className="list-disc text-gray-700 space-y-2">
          <li>G2 survey operates on four pillars:</li>
          <ul>
            <li>
              1.<span className="font-bold">Sales</span> of new and refurbished
              surveying equipment
            </li>
            <li>
              2.<span className="font-bold">Hire</span> of survey equipment
            </li>
            <li>
              3.<span className="font-bold">Service</span> and calibration
            </li>
            <li>
              3.<span className="font-bold">Support</span> and training
            </li>
          </ul>
        </ul>
      </div>
      {/* Who We Are Section */}
      <div className="mb-8 border-t pt-3">
        <h2 className="text-[#e62245] text-2xl font-semibold mb-4">
          Who We Serve
        </h2>
        <p className="text-gray-700 mb-6">
          We cater to surveying professionals, contractor, civil engineer,
          utility providers, and entitities within the construction and
          geospatial industries, ensuring high service levels syonomous with the
          esteemed brands we represent. Whether it's scanning, measuring,
          mapping, modelling, positioning, detecting, or monitoring, G2 survey
          is eqipped with the expertise and solutions to help you realize your
          objectives.
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/g2-survey-office-logo.jpg"
            alt="Office view 1"
            className="w-full rounded-lg"
          />
          <img
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/g2-survey-office-logo.jpg"
            alt="Office view 2"
            className="w-full rounded-lg"
          />
          <img
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/g2-survey-office-logo.jpg"
            alt="Office view 3"
            className="w-full rounded-lg"
          />
          <img
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/g2-survey-office-logo.jpg"
            alt="Office view 4"
            className="w-full rounded-lg"
          />
        </div>
      </div>
      <div className="space-y-5">
        <section className="mt-12 border-b pb-4">
          <h3 className="text-xl font-semibold text-red-600">Our Promise</h3>
          <p className="mt-2">
            Meeting current and future customer needs, supporting innovative
            solutions, and upholding high ethical and quality standards in a
            safe, environmentally responsible workplace.
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-xl font-semibold text-red-600">Our Services</h3>
          <p className="mt-2">
            National support, repair and calibration services, alongside
            comprehensive technical support and training.
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-xl font-semibold text-red-600">Our Journey</h3>
          <p className="mt-2">
            Originally Opti-cal Survey Equipment Ltd, we evolved into G2 Survey
            post-acquisition by a FTSE100 company in 2016, continuing to lead
            with e-commerce, support, and innovation.
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-xl font-semibold text-red-600">Our Future</h3>
          <p className="mt-2">
            Catalysts in the industry, emphasizing innovation and sustainability
            with world-class products and services.
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-xl font-semibold text-red-600">
            Why Choose G2 Survey?
          </h3>
          <p className="mt-2">
            Unparalleled expertise and solutions in surveying and geosystems. We
            value history, innovation, and relentless pursuit of excellence.
          </p>
        </section>
        <section className="border-b pb-4">
          <h3 className="text-xl font-semibold text-red-600">
            Connect With Us
          </h3>
          <p className="mt-2">
            Let’s build a sustainable and technologically advanced future
            together. Reach out for inquiries or collaborations.
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
        <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowBack size={24} className="text-gray-600" />
        </button>
        <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowForward size={24} className="text-gray-600" />
        </button>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/g2-survey-office-interior-new.jpg"
          alt=""
        />
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/g2-survey-office-interior-new.jpg"
          alt=""
        />
      </section>
      <GoogleReview />
    </div>
  );
};

export default AboutUs;
