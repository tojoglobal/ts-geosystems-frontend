import { useEffect, useRef, useState } from "react";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCart } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { useTrackProductView } from "../Hooks/useTrackProductView";
import { slugify } from "../utils/slugify";

const categories = [
  { title: "Shop All" },
  { title: "Used Surveying Equipment" },
  {
    title: "3D Laser Scanning",
    subLinks: ["Scanners", "Scanner Software", "Scanner Accessories"],
  },
  { title: "Total Stations" },
  { title: "GPS/GNSS Systems" },
  { title: "Lasers" },
  { title: "Levels" },
  { title: "Location Detection" },
  { title: "Distance Measuring" },
  { title: "Construction" },
  { title: "Surveying Accessories" },
  { title: "Clearance" },
];

const brands = [{ title: "Leica Geosystems" }];

const mainMenu = [
  {
    title: "Support",
    subLinks: [
      "Software Downloads",
      "Quick Guides",
      "User Manuals",
      "Remote Support",
    ],
  },
  { title: "Trade In" },
  { title: "G2 Blog" },
  { title: "About Us" },
  { title: "Contact Us" },
];

const MobileNavbar = () => {
  const submenuRef = useRef(null);
  const { trackProductView } = useTrackProductView();
  const searchInputRef = useRef(null);
  const axiosPublicUrl = useAxiospublic();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [submenuHeight, setSubmenuHeight] = useState(0);
  const [animatingCategory, setAnimatingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosPublicUrl.get(`/api/search`, {
        params: {
          query: query,
        },
      });
      setSearchResults(response.data.products || []);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (productId) => {
    trackProductView(productId);
    setShowResults(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMenuOpen(false);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleCategoryClick = (title) => {
    if (openCategory === title) {
      setAnimatingCategory(title);
      setSubmenuHeight(0);
      setTimeout(() => {
        setOpenCategory(null);
        setAnimatingCategory(null);
      }, 500);
    } else {
      setOpenCategory(title);
      setAnimatingCategory(title);
      setTimeout(() => {
        if (submenuRef.current) {
          setSubmenuHeight(submenuRef.current.scrollHeight);
        }
      }, 10);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest(".search-container")) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <div className="w-full relative z-50">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 w-full">
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
          {/* Hamburger Menu + Phone */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMenu}
              className="relative cursor-pointer w-8 h-4 flex flex-col gap-0.5 justify-between items-center z-50"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-crimson-red transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-crimson-red transition-opacity duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-crimson-red transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                }`}
              />
            </button>
            <a
              href="tel:+443330232200"
              className="text-xs font-normal text-burgundy"
            >
              +44 (0)333 023 2200
            </a>
          </div>

          {/* Icons: search, user, cart */}
          <div className="flex gap-2">
            <button
              onClick={toggleSearch}
              aria-label="Search"
              className="cursor-pointer"
            >
              <IoSearchOutline className="text-2xl text-red-600" />
            </button>
            <Link to="/user/login" aria-label="User account">
              <LuUserRound className="text-2xl text-red-600" />
            </Link>
            <button className="relative" aria-label="Shopping cart">
              <PiShoppingCart className="text-2xl text-red-600" />
              <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                4
              </span>
            </button>
          </div>
        </div>

        {/* Search box */}
        {isSearchOpen && (
          <div className="bg-charcoal-gray px-2.5 py-2 z-40 shadow-md relative search-container">
            <form onSubmit={handleSearchSubmit}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-1.5 border border-gray-300 placeholder:text-gray-700 bg-gray-200 focus:outline-none"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
                aria-label="Search products"
              />
              <button type="submit" aria-label="Submit search">
                <IoSearchOutline className="text-[#e62245] text-[28px] absolute top-3 right-5" />
              </button>
            </form>
            {isSearching && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 p-2 text-black">
                Searching...
              </div>
            )}
            {showResults && searchResults.length > 0 && (
              <div className="absolute px-3 top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <div key={product.id} className="border-b">
                    <Link
                      onClick={() => handleResultClick(product.id)}
                      to={`/products/${product.id}/${slugify(
                        product.product_name || ""
                      )}`}
                      className="p-1 cursor-pointer"
                    >
                      <div className="font-medium capitalize text-black">
                        {product.product_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${product.price}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {showResults &&
              searchResults.length === 0 &&
              searchQuery &&
              !isSearching && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 p-2 text-black">
                  No products found
                </div>
              )}
          </div>
        )}
      </div>

      {/* Logo Section */}
      <Link
        to="/"
        className="flex w-full justify-center items-center mt-12 pt-4 pb-10 px-13 bg-white border-y border-slightly-dark"
        aria-label="Home"
      >
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
          alt="G2 Survey"
          title="G2 Survey"
          className="h-auto max-w-full"
        />
      </Link>

      {/* Side Menu */}
      <div
        className={`fixed top-12 inset-0 bg-charcoal-gray z-50 text-white transition-opacity duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-y-auto max-h-screen px-4 py-4">
          {/* Search in Side Menu */}
          <div className="relative mb-4 search-container">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-sm bg-gray-200 text-black placeholder:text-gray-600 focus:outline-none"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" aria-label="Submit search">
                <IoSearchOutline className="absolute top-2.5 right-4 text-crimson-red text-xl" />
              </button>
            </form>
            {isSearching && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 p-2 text-black">
                Searching...
              </div>
            )}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    onClick={() => handleResultClick(product.id)}
                    to={`/products/${product.id}/${slugify(
                      product.product_name || ""
                    )}`}
                    key={product.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                  >
                    <div className="font-medium text-black">
                      {product.product_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${product.price}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {showResults &&
              searchResults.length === 0 &&
              searchQuery &&
              !isSearching && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 p-2 text-black">
                  No products found
                </div>
              )}
          </div>

          {/* SHOP BY CATEGORY */}
          <div className="border border-crimson-red rounded-sm mb-2 px-3 py-1">
            <span className="text-base font-semibold">SHOP BY CATEGORY</span>
          </div>
          <ul className="space-y-2 mb-6">
            {categories.map((item, idx) => (
              <li key={idx} className="relative group">
                <div className="flex justify-between items-center cursor-pointer">
                  <span>{item.title}</span>
                  {item.subLinks && <IoIosArrowDown className="text-lg" />}
                </div>
                {item.subLinks && (
                  <ul className="absolute left-0 top-full bg-white text-crimson-red text-sm shadow-lg px-4 py-2 space-y-1 hidden group-hover:block z-50 w-52 rounded-md">
                    {item.subLinks.map((sub, i) => (
                      <li key={i} className="hover:text-black transition">
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* SHOP BY BRAND */}
          <div className="border border-crimson-red rounded-sm mb-2 px-3 py-1">
            <span className="text-base font-semibold">SHOP BY BRAND</span>
          </div>
          <ul className="space-y-2 mb-6">
            {brands.map((item, idx) => (
              <li key={idx}>{item.title}</li>
            ))}
          </ul>

          {/* MAIN MENU */}
          <div className="border border-crimson-red rounded-sm mb-2 px-3 py-1">
            <span className="text-base font-semibold">MAIN MENU</span>
          </div>
          <ul className="space-y-2 mb-6">
            {mainMenu.map((item, idx) => (
              <li
                onClick={() => handleCategoryClick(item.title)}
                key={idx}
                className="relative group"
              >
                <div className="flex justify-between items-center cursor-pointer">
                  <span>{item.title}</span>
                  {item.subLinks && <IoIosArrowDown className="text-lg" />}
                </div>
                {item.subLinks && (
                  <ul className="absolute left-0 top-full bg-white text-crimson-red text-sm shadow-lg px-4 py-2 space-y-1 hidden group-hover:flex flex-col items-center z-50 w-52 rounded-md">
                    {item.subLinks.map((sub, i) => (
                      <li
                        key={i}
                        className="hover:bg-gray-100 hover:shadow-md hover:rounded-md transition-all duration-200 w-full text-center"
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Social Media Links */}
          <div className="flex mb-24 space-x-4 text-2xl mt-6 text-white">
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Pinterest">
              <FaPinterestP />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
