import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";

const reviews = [
  {
    name: "AI-Generated Summary",
    stars: 5,
    content:
      "G2 Survey provides exceptional service with knowledgeable and supportive staff.",
  },
  {
    name: "Levi Boszormenyi",
    stars: 5,
    content:
      "Very supportive team and professional approach, have used their services twice and it's always a great service.",
  },
  {
    name: "Kieran Barter",
    stars: 5,
    content: "Top notch service and support!",
  },
  {
    name: "Simon Page",
    stars: 5,
    content:
      "Fantastic service. I highly recommend G2. Very knowledgeable and incredibly helpful.",
  },
  {
    name: "Alex Morgan",
    stars: 5,
    content: "Great value and fast delivery. Definitely using them again.",
  },
  {
    name: "Riya Patel",
    stars: 4,
    content: "Customer service was responsive and friendly.",
  },
];

const GoogleReview = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      setActiveIndex(swiperRef.current.swiper.realIndex);
    }
  };

  return (
    <section className="pb-10">
      <div className="flex items-center justify-center gap-4 my-12">
        <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        <h2 className="text-xl md:text-2xl font-bold text-[#e62245] text-center">
          WHAT OUR CLIENTS SAY
        </h2>
        <div className="flex-1 h-0.5 bg-[#e62245]"></div>
      </div>
      <div className="flex items-center justify-between bg-gray-100 p-6 rounded shadow">
        <div>
          <p className="text-2xl font-bold">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span> Reviews
          </p>
          <p className="text-2xl font-bold mt-1 flex items-center gap-1">
            4.8
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#e62245]">
                ★
              </span>
            ))}
          </p>
        </div>
        <button
          className="px-4 py-2 font-bold border-[3px] border-[#e62245] text-[#e62245] rounded hover:bg-[#e62245] hover:text-white transition"
          onClick={() =>
            window.open(
              "https://www.google.com/search?q=g2+survey+reviews",
              "_blank"
            )
          }
        >
          Review us on Google
        </button>
      </div>
      {/* Swiper Slider */}
      <div className="relative max-w-6xl mx-auto mt-10">
        {/* Navigation Arrows */}
        {activeIndex > 0 && (
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
            onClick={() => swiperRef.current.swiper.slidePrev()}
          >
            <FaChevronLeft />
          </button>
        )}
        {activeIndex < reviews.length - 4 && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
            onClick={() => swiperRef.current.swiper.slideNext()}
          >
            <FaChevronRight />
          </button>
        )}
        <Swiper
          ref={swiperRef}
          spaceBetween={20}
          slidesPerView={4}
          onSlideChange={handleSlideChange}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-100 border p-4 rounded shadow h-full">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-800">
                    {review.name[0]}
                  </div>
                  <p className="font-medium flex items-center gap-1">
                    {review.name}
                    <FaCheckCircle className="text-[#e62245] text-sm" />
                  </p>
                </div>
                <div className="text-[#e62245] text-xl mb-1">
                  {"★".repeat(review.stars)}
                </div>
                <p className="text-sm text-gray-700">{review.content}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default GoogleReview;
