/* eslint-disable no-useless-escape */
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { IoCloseOutline, IoSearchSharp } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  MdAddShoppingCart,
  MdOutlineKeyboardVoice,
  MdRequestQuote,
} from "react-icons/md";
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

// Shorter card for compact look
const CARD_HEIGHT = "h-[260px] min-h-[350px]"; // adjust as needed for more compact look

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
  const lastTrackedSearch = useRef(""); // To avoid duplicate posts!

  // Settings API for dynamic logo
  const { data: settingsData = {} } = useDataQuery(
    ["seetings"],
    "/api/settings"
  );
  const mainLogo =
    settingsData?.main_logo &&
    (settingsData.main_logo.startsWith("/") ||
      settingsData.main_logo.startsWith("http"))
      ? `${import.meta.env.VITE_OPEN_APIURL || ""}${settingsData.main_logo}`
      : "";
  const appName = settingsData?.app_name || "Logo";

  // Fetch recommended products (joined with main product table)
  const { data: recommendedData, isLoading: recommendedLoading } = useDataQuery(
    "recommendedProducts",
    "/api/recommended-products"
  );

  // Fetch fallback latest products in case recommended is empty or less than 10
  const { data: latestProductsData, isLoading: latestProductsLoading } =
    useDataQuery("latestProducts", "/api/products?limit=20");

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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("latestSearches")) || [];
    setLatestSearches(saved);
  }, []);

  // Always show 10 recommended; fill with latest if needed
  useEffect(() => {
    let recommended = [];
    if (Array.isArray(recommendedData) && recommendedData.length > 0) {
      recommended = recommendedData.slice(0, 10);
    } else if (recommendedData?.products?.length > 0) {
      recommended = recommendedData.products.slice(0, 10);
    }
    if (recommended.length < 10) {
      let latest = [];
      if (Array.isArray(latestProductsData?.products)) {
        latest = latestProductsData.products;
      } else if (Array.isArray(latestProductsData)) {
        latest = latestProductsData;
      }
      const excludeIds = new Set(recommended.map((p) => p.id));
      const toAdd = latest
        .filter((p) => !excludeIds.has(p.id))
        .slice(0, 10 - recommended.length);
      recommended = [...recommended, ...toAdd];
    }
    setRecommendedProducts(recommended.slice(0, 10));
  }, [recommendedData, latestProductsData]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // -- Height logic: expand overlay when searchText is not empty
  const overlayHeightClass =
    searchText.length > 0 ? "h-full xl:h-[87vh]" : "h-[80vh] xl:h-[87vh]";

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
        breakpoint: 1536,
        settings: { slidesToShow: 4 },
      },
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

  // Compact card
  const cardClass = `card bg-white border border-gray-200 hover:border-2 hover:border-gray-500 transition-all rounded-md ${CARD_HEIGHT} flex flex-col justify-between group`;

  // Product name min height for alignment
  const nameClass =
    "text-[13px] font-medium mb-1 hover:text-[#e62245] cursor-pointer min-h-[38px] flex items-center justify-center text-center";

  // Image height - MODIFIED: Increased height
  const imgClass = "mx-auto h-36 object-contain"; // Changed from h-24 to h-36

  return (
    <>
      {isOpen && (
        <>
          <div
            ref={overlayRef}
            className={`fixed inset-0 bg-gray-100 z-[100] ${overlayHeightClass} transition-transform duration-500 ease-in-out transform animate-slide-down ${
              isOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex max-w-[99%] z-50 mx-auto items-center pt-6 p-4">
              <img
                src={mainLogo}
                alt={appName}
                title={appName}
                className="h-auto max-w-full mr-4"
                loading="lazy"
                style={{ maxHeight: 70 }}
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
                        onClick={() => setSearchText(search)}
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
              {/* Right - Product Slider or Grid */}
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
                {isLoading || recommendedLoading || latestProductsLoading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : (displayProducts?.length ?? 0) === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    No products found.
                  </div>
                ) : displayProducts.length <= 4 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {" "}
                    {/* Added gap-4 for spacing */}
                    {displayProducts?.map((product, index) => {
                      const priceOption = Number(product?.priceShowHide);
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
                        <div key={index} className={cardClass}>
                          <Link
                            onClick={async () => {
                              trackProductView(product.id);
                              await trackSearchOnProductClick(searchText);
                              onClose();
                            }}
                            to={`/products/${product.id}/${slugify(
                              product.product_name || ""
                            )}`}
                            className="w-full"
                          >
                            <figure className="pt-2">
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
                                className={imgClass}
                              />
                            </figure>
                            <div className="card-body px-0 py-2">
                              <p
                                className={nameClass}
                                style={{ lineHeight: "1.18" }}
                              >
                                {product.product_name || product.name}
                              </p>
                            </div>
                          </Link>
                          <div className="card-actions px-0 pb-2 pt-1 flex justify-between items-center mt-auto gap-2">
                            <p className="font-semibold text-[14px]">
                              {priceOption === 1 ? "" : formatBDT(priceIncVat)}
                            </p>
                            {product?.isStock === 1 && priceOption === 1 && (
                              <Link
                                to={`/products/${product.id}/${slugify(
                                  product.product_name || ""
                                )}`}
                                title="Get Quotation"
                                className="ml-auto p-[4px] rounded bg-[#e62245] hover:bg-[#d41d3f] text-white transition min-w-0 flex items-center"
                                style={{ fontSize: "11px", fontWeight: 500 }}
                              >
                                <MdRequestQuote size={15} className="mr-1" />
                                QUOTE
                              </Link>
                            )}
                            {product?.isStock === 1 && priceOption !== 1 && (
                              <span className="ml-auto flex items-center">
                                <AddToCartButton
                                  product={product}
                                  quantity={1}
                                  selectedOptions={[]}
                                  variant="icon"
                                >
                                  <MdAddShoppingCart size={16} />
                                </AddToCartButton>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Slider {...settings}>
                    {displayProducts.map((product, index) => {
                      let vat = 0;
                      try {
                        vat = product?.tax ? JSON.parse(product.tax).value : 0;
                      } catch {
                        vat = 0;
                      }
                      const basePrice = parsePrice(product.price) || 0;
                      const vatAmount = basePrice * (vat / 100);
                      const priceIncVat = basePrice + vatAmount;
                      const priceOption = Number(product?.priceShowHide);
                      return (
                        <div
                          key={index}
                          style={{ paddingLeft: 10, paddingRight: 10 }} // Modified: Increased padding for gap
                        >
                          <div className={cardClass}>
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
                              className="w-full"
                            >
                              <figure className="pt-2">
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
                                  className={imgClass}
                                />
                              </figure>
                              <div className="card-body px-0 py-2">
                                <p
                                  className={nameClass}
                                  style={{ lineHeight: "1.18" }}
                                >
                                  {product.product_name || product.name}
                                </p>
                              </div>
                            </Link>
                            <div className="card-actions px-0 pb-2 pt-1 flex justify-between items-center mt-auto gap-2">
                              <p className="font-semibold text-[14px]">
                                {priceOption === 1
                                  ? ""
                                  : formatBDT(priceIncVat)}
                              </p>
                              {product?.isStock === 1 && priceOption === 1 && (
                                <Link
                                  to={`/products/${product.id}/${slugify(
                                    product.product_name || ""
                                  )}`}
                                  title="Get Quotation"
                                  className="ml-auto p-[4px] rounded bg-[#e62245] hover:bg-[#d41d3f] text-white transition min-w-0 flex items-center"
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 500,
                                  }}
                                >
                                  <MdRequestQuote size={15} className="mr-1" />
                                  QUOTE
                                </Link>
                              )}
                              {product?.isStock === 1 && priceOption !== 1 && (
                                <span className="ml-auto flex items-center">
                                  <AddToCartButton
                                    product={product}
                                    quantity={1}
                                    selectedOptions={[]}
                                    variant="icon"
                                  >
                                    <MdAddShoppingCart size={16} />
                                  </AddToCartButton>
                                </span>
                              )}
                            </div>
                          </div>
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
