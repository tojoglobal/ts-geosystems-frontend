/* eslint-disable no-useless-escape */
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { IoCloseOutline, IoSearchSharp } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdAddShoppingCart, MdOutlineKeyboardVoice } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import PrevArrow from "../Components/PrevArrow";
import NextArrow from "../Components/NextArrow";
import useDataQuery from "../utils/useDataQuery";
import SearchResultsView from "./SearchResultsView";
import { Link } from "react-router-dom";
import { slugify } from "../utils/slugify";

const POPULAR_SEARCHES = [
  "rtc360",
  "ap20",
  "gs16",
  "rugby 620",
  "ts16",
  "benro",
  "cloudworx",
  "cmp104",
  "cs20",
  "disto",
];

const RECOMMENDED_PRODUCTS = [
  {
    name: "Leica GVP621 Soft Bag",
    price: "৳35.40",
    image: "/images/products/gvp621-soft-bag.jpg",
  },
  {
    name: "Leica GVP703 Soft Bag",
    price: "৳39.60",
    image: "/images/products/gvp703-soft-bag.jpg",
  },
  {
    name: "Leica GVP102 Soft Bag",
    price: "৳64.80",
    image: "/images/products/gvp102-soft-bag.jpg",
  },
  {
    name: "Radiodetection RD Carry Bag",
    price: "৳156.00",
    image: "/images/products/rd-carry-bag.jpg",
  },
  {
    name: "Leica BLK360 Mission Bag",
    price: "৳164.95",
    image: "/images/products/blk360-mission-bag.jpg",
  },
  {
    name: "Radiodetection CAT & Genny Carry Bag",
    price: "৳110.00",
    image: "/images/products/cat-genny-bag.jpg",
  },
];

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [showResultsView, setShowResultsView] = useState(false);
  const overlayRef = useRef(null);
  const [latestSearches, setLatestSearches] = useState([
    "blog",
    "leica",
    "contact",
    "ortact",
  ]);

  const { data: searchResults, isLoading } = useDataQuery(
    ["searchData", searchText, sortOrder],
    `/api/search?query=${encodeURIComponent(searchText)}&sort=${sortOrder}`,
    { enabled: !!searchText }
  );

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("latestSearches")) || [];
    setLatestSearches(saved);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const displayProducts = searchResults?.products || RECOMMENDED_PRODUCTS;

  const handleRemoveSearch = (index) => {
    setLatestSearches(latestSearches.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setLatestSearches([]);
  };

  const handleViewAll = () => {
    setShowResultsView(true);
  };

  const saveToLocalStorage = (value) => {
    let updated = [
      value,
      ...latestSearches.filter((item) => item !== value),
    ].slice(0, 5);
    setLatestSearches(updated);
    localStorage.setItem("latestSearches", JSON.stringify(updated));
  };

  const handleCloseResultsView = () => {
    setShowResultsView(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      saveToLocalStorage(searchText.trim());
    }
  };

  if (showResultsView) {
    return (
      <SearchResultsView
        products={displayProducts}
        onClose={handleCloseResultsView}
        searchText={searchText}
        handleSearchSubmit={handleSearchSubmit}
        setSearchText={setSearchText}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    );
  }

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-gray-100 z-[100] h-9/11 transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex max-w-[99%] z-50 mx-auto items-center pt-6 p-4">
          <img
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
            className="w-[190px] h-full mr-4"
            alt="G2 Survey"
          />
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full ml-2 mx-auto border-b border-[#c5ccd3] bg-white rounded"
          >
            <IoSearchSharp className="ml-6 mr-2 font-extrabold text-xl text-charcoal-black" />
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
          <button onClick={onClose} className="ml-8 cursor-pointer ">
            <RxCross1 className="text-4xl text-[#626263]" />
          </button>
        </div>
        {/* Latest Search Section */}
        <div className="px-6 mt-2 mb-6 flex max-w-[75%] items-center mx-auto">
          <h2 className="text-gray-700 text-sm font-semibold mr-2">
            Latest searches:
          </h2>
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
        <div className="flex flex-col md:flex-row px-12 pb-12">
          {/* Left - Popular Searches */}
          <div className="w-full md:w-[20%] p-5 bg-white">
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
          <div className="w-full md:w-[80%] pl-10">
            <div className="flex justify-between items-center mb-4 mx-2">
              <h3 className="text-sm">
                {searchText
                  ? `${searchResults?.products?.length || 0} results found`
                  : "Recommended products"}
              </h3>
              {searchText && displayProducts.length > 0 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleViewAll}
                    className="text-sm cursor-pointer text-[#e62245] hover:underline"
                  >
                    View All
                  </button>
                  {showResultsView && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sort by:</span>
                      <select
                        className="appearance-none text-sm border rounded px-2 py-1"
                        value={sortOrder}
                        onChange={handleSort}
                      >
                        <option value="relevance">Relevance</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name: A to Z</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-10">Loading...</div>
            ) : displayProducts.length <= 4 ? (
              <div className="grid grid-cols-4 gap-4">
                {displayProducts.map((product, index) => (
                  <Link
                    to={`/products/${product.id}/${slugify(
                      product.product_name || ""
                    )}`}
                    key={index}
                    className="h-full min-h-[350px] flex flex-col bg-white p-6 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    <img
                      src={
                        product.image_urls
                          ? `${import.meta.env.VITE_OPEN_APIURL}${JSON.parse(
                              product.image_urls
                            )[0].replace(/^["\[]+|["\]]+$/g, "")}`
                          : product.image
                      }
                      alt={product.product_name || product.name}
                      className="mx-auto h-44 object-contain mb-3"
                    />
                    <p
                      className="text-sm font-medium mb-1 hover:text-[#e62245]
                    cursor-pointer"
                    >
                      {product.product_name || product.name}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="font-semibold">{product.price}</p>
                      <button className="mt-2 w-10 ml-auto p-[6px] flex items-center justify-center gap-2 bg-[#e62245] text-white rounded hover:bg-[#d41f3f] transition-colors">
                        <MdAddShoppingCart size={27} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <Slider {...settings}>
                {displayProducts.map((product, index) => (
                  <div key={index} className="px-2">
                    <Link
                      to={`/products/${product.id}/${slugify(
                        product.product_name || ""
                      )}`}
                      className="h-full min-h-[350px] flex flex-col bg-white p-6 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200"
                    >
                      <img
                        src={
                          product.image_urls
                            ? `${import.meta.env.VITE_OPEN_APIURL}${JSON.parse(
                                product.image_urls
                              )[0].replace(/^["\[]+|["\]]+$/g, "")}`
                            : product.image
                        }
                        alt={product.product_name || product.name}
                        className="mx-auto h-44 object-contain mb-3"
                      />

                      <p className="text-sm font-medium mb-1 hover:text-[#e62245] cursor-pointer">
                        {product.product_name || product.name}
                      </p>
                      <div className="flex justify-between items-center mt-auto pt-4">
                        <p className="text-sm font-semibold text-gray-800">
                          ৳{product.price}
                        </p>
                        <button className="bg-[#e62245] p-[6px] rounded text-white hover:bg-[#d41d3f]">
                          <MdAddShoppingCart size={24} />
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      </div>
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
