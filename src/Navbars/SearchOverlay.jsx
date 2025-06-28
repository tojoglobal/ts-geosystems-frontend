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
import { parsePrice } from "../utils/parsePrice";
import { useTrackProductView } from "../Hooks/useTrackProductView";
import useToastSwal from "../Hooks/useToastSwal";
import { formatBDT } from "../utils/formatBDT";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import AddToCartButton from "../Components/AddToCartButton";

const SearchOverlay = ({ isOpen, onClose }) => {
  const axiosPublicUrl = useAxiospublic();
  const { trackProductView } = useTrackProductView();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [showResultsView, setShowResultsView] = useState(false);
  const overlayRef = useRef(null);
  const showToast = useToastSwal();
  const [latestSearches, setLatestSearches] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const lastTrackedSearch = useRef(""); // To avoid duplicate posts

  // Fetch recommended products
  const { data: recommendedData } = useDataQuery(
    "recommendedProducts",
    "/api/recommended-products",
    { enabled: !searchText }
  );

  const { data: popularData } = useDataQuery(
    "popularSearches",
    "/api/popular-searches?limit=10"
  );
  const popularSearches = popularData?.searches ?? [];

  const { data: searchResults, isLoading } = useDataQuery(
    ["searchData", searchText, sortOrder],
    `/api/search?query=${encodeURIComponent(searchText)}&sort=${sortOrder}`,
    { enabled: !!searchText }
  );

  // Load latest searches from localStorage (dynamic, no hardcoded array)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("latestSearches")) || [];
    setLatestSearches(saved);
  }, []);

  useEffect(() => {
    if (recommendedData?.products) {
      setRecommendedProducts(recommendedData.products.slice(0, 10));
    }
  }, [recommendedData]);

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

  const displayProducts = searchText
    ? searchResults?.products ?? []
    : recommendedProducts ?? [];

  // Save new search to localStorage and state (dynamic)
  const saveToLocalStorage = (value) => {
    let updated = [
      value,
      ...latestSearches.filter((item) => item !== value),
    ].slice(0, 5);
    setLatestSearches(updated);
    localStorage.setItem("latestSearches", JSON.stringify(updated));
  };

  const handleRemoveSearch = (index) => {
    const updated = latestSearches.filter((_, i) => i !== index);
    setLatestSearches(updated);
    localStorage.setItem("latestSearches", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setLatestSearches([]);
    localStorage.setItem("latestSearches", JSON.stringify([]));
  };

  const handleViewAll = () => {
    setShowResultsView(true);
  };

  const handleCloseResultsView = () => {
    setShowResultsView(false);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  // Only track search and save to localStorage when user clicks a product
  const trackSearchOnProductClick = async (searchTerm) => {
    if (searchTerm?.trim() && searchTerm.trim() !== lastTrackedSearch.current) {
      try {
        await axiosPublicUrl.post("/api/popular-searches", {
          term: searchTerm.trim(),
        });
        lastTrackedSearch.current = searchTerm.trim();
        saveToLocalStorage(searchTerm.trim());
      } catch (error) {
        showToast("error", "Search Track Failed", error.message);
      }
    }
  };

  // No need to track on submit or typing now
  const handleSearchSubmit = (e) => {
    e.preventDefault();
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            ref={overlayRef}
            className={`fixed inset-0 bg-gray-100 z-[100] h-full xl:h-9/11 transition-transform duration-500 ease-in-out transform  animate-slide-down ${
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
                      className="text-gray-600 cursor-pointer hover:text-black"
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
                  {(popularSearches?.length ? popularSearches : []).map(
                    (search, i) => (
                      <li
                        key={i}
                        className="hover:text-[#e62245] cursor-pointer"
                      >
                        {search}
                      </li>
                    )
                  )}
                  {(!popularSearches || popularSearches.length === 0) && (
                    <li className="text-gray-400">No popular searches</li>
                  )}
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
                          <span className="text-sm text-gray-600">
                            Sort by:
                          </span>
                          <select
                            className="appearance-none text-sm border rounded px-2 py-1"
                            value={sortOrder}
                            onChange={handleSort}
                          >
                            <option value="relevance">Relevance</option>
                            <option value="price_asc">
                              Price: Low to High
                            </option>
                            <option value="price_desc">
                              Price: High to Low
                            </option>
                            <option value="name_asc">Name: A to Z</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {isLoading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : (displayProducts?.length ?? 0) === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    No products found.
                  </div>
                ) : displayProducts.length <= 4 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayProducts?.map((product, index) => {
                      // console.log(product);
                      const priceOption = product?.priceShowHide;
                      // vat part
                      let vat = 0;
                      try {
                        vat = product?.tax ? JSON.parse(product.tax).value : 0;
                      } catch {
                        vat = 0;
                      }
                      const basePrice = parsePrice(product.price) || 0;
                      const vatAmount = basePrice * (vat / 100);
                      const priceIncVat = basePrice + vatAmount;

                      return (
                        <Link
                          onClick={async () => {
                            trackProductView(product.id);
                            await trackSearchOnProductClick(searchText);
                            onClose();
                          }}
                          to={`/products/${product.id}/${slugify(
                            product.product_name || ""
                          )}`}
                          key={index}
                          className="h-full min-h-[350px] flex flex-col bg-white p-6 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200"
                        >
                          <img
                            src={
                              product?.image_urls
                                ? `${
                                    import.meta.env.VITE_OPEN_APIURL
                                  }${JSON?.parse(
                                    product?.image_urls
                                  )[0]?.replace(/^["\[]+|["\]]+$/g, "")}`
                                : product?.image
                            }
                            alt={product?.product_name || product.name}
                            className="mx-auto h-44 object-contain mb-3"
                          />
                          <p className="text-sm font-medium mb-1 hover:text-[#e62245] cursor-pointer">
                            {product.product_name || product.name}
                          </p>
                          <div className="flex justify-between items-center mt-auto">
                            <p className="font-semibold">
                              {product?.priceShowHide
                                ? ""
                                : formatBDT(priceIncVat)}
                            </p>

                            {product?.isStock === 1 && priceOption !== 1 && (
                              <AddToCartButton
                                product={product}
                                quantity={1}
                                selectedOptions={[]}
                              >
                                <MdAddShoppingCart size={24} />
                              </AddToCartButton>
                            )}
                            {product?.isStock === 1 && priceOption === 1 && (
                              <button
                                className="p-[6px] rounded bg-gray-400 cursor-not-allowed text-white"
                                disabled
                                title="Unavailable for direct purchase"
                              >
                                <MdAddShoppingCart size={24} />
                              </button>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <Slider {...settings}>
                    {displayProducts.map((product, index) => {
                      // vat part
                      let vat = 0;
                      try {
                        vat = product?.tax ? JSON.parse(product.tax).value : 0;
                      } catch {
                        vat = 0;
                      }
                      const basePrice = parsePrice(product.price) || 0;
                      const vatAmount = basePrice * (vat / 100);
                      const priceIncVat = basePrice + vatAmount;
                      const priceOption = product?.priceShowHide;
                      return (
                        <div key={index} className="px-2 relative">
                          {product?.sale === 1 && (
                            <div className="absolute top-2 right-4 bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm">
                              SALE
                            </div>
                          )}
                          <Link
                            onClick={async () => {
                              trackProductView(product.id);
                              await trackSearchOnProductClick(searchText);
                              onClose();
                            }}
                            to={`/products/${product.id}/${slugify(
                              product.product_name || ""
                            )}`}
                            className="h-full min-h-[350px] flex flex-col bg-white p-6 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200"
                          >
                            <img
                              src={
                                product?.image_urls
                                  ? `${
                                      import.meta.env.VITE_OPEN_APIURL
                                    }${JSON.parse(
                                      product?.image_urls
                                    )[0]?.replace(/^["\[]+|["\]]+$/g, "")}`
                                  : product?.image
                              }
                              alt={product?.product_name || product.name}
                              className="mx-auto h-44 object-contain mb-3"
                            />

                            <p className="text-sm font-medium mb-1 hover:text-[#e62245] cursor-pointer">
                              {product.product_name || product.name}
                            </p>
                            <div className="flex justify-between items-center mt-auto">
                              <p className="font-semibold">
                                {product?.priceShowHide
                                  ? ""
                                  : formatBDT(priceIncVat)}
                              </p>
                              {product?.isStock === 1 && priceOption !== 1 && (
                                <AddToCartButton
                                  product={product}
                                  quantity={1}
                                  selectedOptions={[]}
                                >
                                  <MdAddShoppingCart size={24} />
                                </AddToCartButton>
                              )}
                              {product?.isStock === 1 && priceOption === 1 && (
                                <button
                                  className="p-[6px] rounded bg-gray-400 cursor-not-allowed text-white"
                                  disabled
                                  title="Unavailable for direct purchase"
                                >
                                  <MdAddShoppingCart size={24} />
                                </button>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
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
      )}
    </>
  );
};

export default SearchOverlay;
