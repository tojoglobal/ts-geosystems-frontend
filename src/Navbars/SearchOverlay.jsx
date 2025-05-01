import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
// import { FaShoppingCart } from "react-icons/fa";
import {
  IoCloseOutline,
  IoSearchOutline,
  IoSearchSharp,
} from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdAddShoppingCart, MdOutlineKeyboardVoice } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import PrevArrow from "../Components/PrevArrow";
import NextArrow from "../Components/NextArrow";

const POPULAR_SEARCHES = [
  "tripod",
  "cyclone",
  "gs16",
  "pix4d",
  "leica gs16",
  "nedo",
  "rtc360",
  "bipod",
  "rty50",
  "sed",
];

const RECOMMENDED_PRODUCTS = [
  {
    name: "Retro Reflective Targets",
    price: "£3.95",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/200x60/products/152/3009/retro-reflective-targets__86299.1678487731.jpg?c=1",
  },
  {
    name: "Leica Cyclone REGISTER 360 PLUS",
    price: "£162.00",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/200x60/products/152/3009/retro-reflective-targets__86299.1678487731.jpg?c=1",
  },
  {
    name: "Leica GEB212 Li-Ion Battery",
    price: "£179.95",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/493/2941/rs30r__86371.1677189463.jpg?c=1",
  },
  {
    name: "Leica GS16 SmartAntenna GPS",
    price: "£7,020.00",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/289/2251/leica-gzt21-scanning-target__56546.1659456209.jpg?c=1",
  },
];

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchText, setSearchText] = useState("");
  // const [latestSearches, setLatestSearches] = useState([]);
  const overlayRef = useRef(null);
  const [latestSearches, setLatestSearches] = useState([
    "lecia",
    "lecia d",
    "lecia dedss",
  ]);

  const handleRemoveSearch = (index) => {
    setLatestSearches(latestSearches.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setLatestSearches([]);
  };

  const saveToLocalStorage = (value) => {
    let updated = [
      value,
      ...latestSearches.filter((item) => item !== value),
    ].slice(0, 5);
    setLatestSearches(updated);
    localStorage.setItem("latestSearches", JSON.stringify(updated));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      saveToLocalStorage(searchText.trim());
      setSearchText("");
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("latestSearches")) || [];
    setLatestSearches(saved);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-gray-100 z-[100] h-10/12 transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex max-w-[99%] z-50 mx-auto items-center pt-6 p-4">
          <img
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
            className="w-[200px] h-full mr-4"
            alt="G2 Survey"
          />
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full ml-5 mx-auto border-b border-[#c5ccd3] bg-white rounded"
          >
            <IoSearchSharp className="ml-7 mr-3 font-extrabold text-xl text-charcoal-black" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-3 py-4 text-2xl outline-none focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <MdOutlineKeyboardVoice className="mr-30 text-2xl text-charcoal" />
            <button
              type="submit"
              className="absolute right-0 cursor-pointer px-4 h-full text-2xl border-2 border-charcoal-black bg-gray-200 hover:bg-gray-100 focus:outline-none"
            >
              Submit
            </button>
          </form>
          {/* Close Icon */}
          <button onClick={onClose} className="ml-4 cursor-pointer ">
            <RxCross1 className="text-4xl text-[#626263]" />
          </button>
        </div>
        {/* Latest Search Section */}
        <div className="px-6 py-4 flex max-w-[70%] items-center mx-auto ">
          <h2 className="text-gray-700 font-medium mr-2">Latest searches:</h2>
          <div className="flex flex-wrap gap-2">
            {latestSearches.map((item, i) => (
              <div
                key={i}
                className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full text-gray-700"
              >
                <span className="mr-2">{item}</span>
                <button
                  onClick={() => handleRemoveSearch(i)}
                  className="text-gray-600 hover:text-black"
                >
                  <IoCloseOutline size={14} />
                </button>
              </div>
            ))}
            {latestSearches.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-red-500 text-sm font-medium hover:underline ml-2 cursor-pointer"
              >
                Delete all
              </button>
            )}
          </div>
        </div>
        {/* Bottom Section */}
        <div className="flex px-12 pb-12">
          {/* Left - Popular Searches */}
          <div className="w-4/9 p-5 bg-white">
            <h3 className="font-semibold text-lg mb-2">Popular searches</h3>
            <ul className="text-sm text-gray-700 space-y-3">
              {POPULAR_SEARCHES.map((search, i) => (
                <li key={i} className="hover:text-[#e62245] cursor-pointer">
                  {search}
                </li>
              ))}
            </ul>
          </div>
          {/* Right - Product Slider */}
          <div className="w-7/9 pl-10">
            <h3 className="font-semibold text-lg mb-4">
              {searchText
                ? `Results for "${searchText}"`
                : "Recommended products"}
            </h3>
            {/* <div className="relative w-full"> */}
            <Slider {...settings}>
              {RECOMMENDED_PRODUCTS.map((product, index) => (
                <div key={index} className="px-2">
                  <div className="h-full min-h-[350px] flex flex-col bg-white p-6 shadow-sm border-2 border-transparent hover:border-gray-300 transition-all duration-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mx-auto h-44 object-contain mb-3"
                    />
                    <p className="text-sm font-medium mb-1">{product.name}</p>
                    <div className="flex justify-between items-center mt-8">
                      <p className="text-sm font-semibold text-gray-800">
                        {product.price}
                      </p>
                      <button className="bg-crimson-red p-2 rounded text-white">
                        <MdAddShoppingCart className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* Backdrop Overlay inside relative wrapper */}
      {isOpen && (
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full z-[30] bg-black/85 transition-transform duration-500 ease-in-out transform ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default SearchOverlay;
