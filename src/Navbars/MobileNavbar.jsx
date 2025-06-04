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
import { useQuery } from "@tanstack/react-query";
import useDataQuery from "../utils/useDataQuery";
import { useDispatch, useSelector } from "react-redux";
import {
  closeCart,
  toggleCart,
} from "../features/CartToggleSlice/CartToggleSlice";
import CartWithPopover from "./CartWithPopover";

const MobileNavbar = () => {
  const { trackProductView } = useTrackProductView();
  const searchInputRef = useRef(null);
  const axiosPublicUrl = useAxiospublic();
  const navigate = useNavigate();
  const { isCartVisible } = useSelector((state) => state.cartToggle);
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const submenuRefs = useRef({});

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest(".search-container")) {
        setShowResults(false);
      }
      if (
        isCartVisible &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        dispatch(closeCart());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, isCartVisible, dispatch]);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useDataQuery(["categories"], "/api/category");

  // Fetch subcategories
  const {
    data: subcategoriesData,
    isLoading: subcategoriesLoading,
    error: subcategoriesError,
  } = useDataQuery(["subcategories"], "/api/subcategory");

  // Fetch brands
  const {
    data: brandsData,
    isLoading: brandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/brands");
      return res?.data?.map((brand) => ({
        name: brand.brands_name,
        slug: brand.slug,
      }));
    },
  });

  // Get subcategories for a category
  const getSubcategoriesForCategory = (categoryId) => {
    if (!subcategoriesData?.subcategories) return [];
    return subcategoriesData.subcategories.filter(
      (subcat) => subcat.main_category_id === categoryId
    );
  };

  // Create dynamic categories data structure
  const dynamicCategories = [
    { title: "Shop All", link: "/shop-all" },
    ...(categoriesData?.categories?.map((category) => ({
      title: category.category_name,
      link: `/${category.slug_name}`,
      subLinks: getSubcategoriesForCategory(category.id).map((subcat) => ({
        title: subcat.name,
        link: `/${category.slug_name}/${subcat.slug}`,
      })),
    })) || []),
    { title: "Clearance", link: "/clearance" },
  ];

  // Dynamic brands data
  const dynamicBrands = brandsData?.map((brand) => ({
    title: brand.name,
    link: `brand/${brand.slug}`,
  })) || [{ title: "Leica Geosystems" }];

  // Main menu (static)
  const mainMenu = [
    { title: "USED EQUIPMENT", link: "/used" },
    { title: "CLEARANCE", link: "/clearance" },
    { title: "HIRE", link: "/hire" },
    { title: "SERVICE", link: "/service" },
    {
      title: "Support",
      subLinks: [
        { title: "Support Request Form", link: "/support" },
        { title: "Software Downloads", link: "/software-downloads" },
        { title: "Quick Guides", link: "/quick-guides" },
        { title: "User Manuals", link: "/user-manuals" },
        { title: "Remote Support", link: "/remote-support" },
      ],
    },
    { title: "TRADE IN", link: "/trade-in" },
    { title: "TS Blog", link: "/ts-blog" },
    { title: "About Us", link: "/about-us" },
    { title: "Contact Us", link: "/contact-us" },
  ];

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
    navigate(
      `/products/${productId}/${slugify(
        searchResults.find((p) => p.id === productId)?.product_name || ""
      )}`
    );
    setShowResults(false);
    setIsSearchOpen(false);
    setSearchQuery("");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowResults(false);
      setOpenCategory(null); // Close any open submenus when the main menu closes
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
    setOpenCategory((prev) => (prev === title ? null : title));
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  if (categoriesLoading || subcategoriesLoading || brandsLoading) {
    return (
      <div className="w-full relative z-50">
        {/* Simplified loading navbar */}
        <div className="fixed top-0 w-full">
          <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center items-center mt-12 pt-4 pb-10 px-13 bg-white border-y border-slightly-dark">
          <div className="w-64 h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (categoriesError || subcategoriesError || brandsError) {
    return (
      <div className="w-full relative z-50">
        {/* Error state navbar */}
        <div className="fixed top-0 w-full">
          <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <button className="relative w-8 h-4 flex flex-col gap-0.5 justify-between items-center z-50">
                <span className="block w-5 h-0.5 bg-gray-400"></span>
                <span className="block w-5 h-0.5 bg-gray-400"></span>
                <span className="block w-5 h-0.5 bg-gray-400"></span>
              </button>
              <span className="text-xs font-normal text-gray-400">
                +44 (0)333 023 2200
              </span>
            </div>
            <div className="flex gap-2">
              <div className="text-2xl text-gray-400">
                <IoSearchOutline />
              </div>
              <div className="text-2xl text-gray-400">
                <LuUserRound />
              </div>
              <div className="relative text-2xl text-gray-400">
                <PiShoppingCart />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center items-center mt-12 pt-4 pb-10 px-13 bg-white border-y border-slightly-dark">
          <div className="text-gray-400">Error loading navigation</div>
        </div>
      </div>
    );
  }

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
            <button
              className="relative cursor-pointer"
              aria-label="Shopping cart"
              onClick={() => dispatch(toggleCart())}
            >
              <PiShoppingCart className="text-2xl text-red-600" />
              <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {totalQuantity}
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
                      onClick={() => {
                        handleResultClick(product.id);
                      }}
                      to={`/products/${product.id}/${slugify(
                        product.product_name || ""
                      )}`}
                      className="p-1 cursor-pointer block" // Added block
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
                    onClick={() => {
                      handleResultClick(product.id);
                    }}
                    to={`/products/${product.id}/${slugify(
                      product.product_name || ""
                    )}`}
                    key={product.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 block text-black"
                  >
                    <div className="font-medium capitalize">
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
          <ul className="space-y-2 mt-4 mb-6">
            {dynamicCategories.map((item, idx) => (
              <li key={idx} className="relative group">
                <div className="flex justify-between items-center text-white">
                  {" "}
                  {/* Set text color here */}
                  <Link
                    to={item.link}
                    className="flex-1"
                    onClick={() => {
                      if (!item.subLinks) {
                        toggleMenu();
                      } else {
                        handleCategoryClick(item.title);
                      }
                    }}
                  >
                    {item.title}
                  </Link>
                  {/* Only show arrow if subLinks exist */}
                  {item.subLinks && item.subLinks.length > 0 && (
                    <button
                      onClick={() => handleCategoryClick(item.title)}
                      className="cursor-pointer p-2 -mr-2"
                    >
                      <IoIosArrowDown
                        className={`text-lg transition-transform duration-300 ${
                          openCategory === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
                {/* Animated Submenu */}
                <div
                  ref={(el) => (submenuRefs.current[item.title] = el)}
                  style={{
                    maxHeight:
                      openCategory === item.title
                        ? `${submenuRefs.current[item.title]?.scrollHeight}px`
                        : "0px",
                  }}
                  className={`overflow-hidden transition-all duration-300 ease-in-out`}
                >
                  {item.subLinks && item.subLinks.length > 0 && (
                    <ul className="bg-dark-charcoal text-white text-sm shadow-lg space-y-2 rounded-md mt-2">
                      {" "}
                      {/* Changed bg and text color */}
                      {item.subLinks.map((sub, i) => (
                        <li
                          key={i}
                          className="hover:bg-gray-700 hover:shadow-md hover:rounded-md transition-all duration-200 w-full"
                        >
                          <Link
                            to={sub.link}
                            className="block active:scale-95 transition-transform duration-100 text-base text-left px-2 py-1.5 rounded-sm border border-gray-600 mb-1"
                            onClick={toggleMenu}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {/* SHOP BY BRAND */}
          <div className="border border-crimson-red rounded-sm mb-2 px-3 py-1">
            <span className="text-base font-semibold">SHOP BY BRAND</span>
          </div>
          <ul className="space-y-2 mt-4 mb-6">
            {dynamicBrands.map((item, idx) => (
              <li key={idx} className="text-white">
                {" "}
                {/* Set text color here */}
                <Link to={item.link || "#"} onClick={toggleMenu}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          {/* MAIN MENU */}
          <div className="border border-crimson-red rounded-sm mb-2 px-3 py-1">
            <span className="text-base font-semibold">MAIN MENU</span>
          </div>
          <ul className="space-y-3 mt-4 mb-6">
            {mainMenu.map((item, idx) => (
              <li key={idx} className="relative group">
                <div className="flex justify-between uppercase items-center text-white">
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="flex-1"
                      onClick={() => {
                        if (!item.subLinks) {
                          toggleMenu();
                        } else {
                          handleCategoryClick(item.title);
                        }
                      }}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="flex-1">{item.title}</span>
                  )}
                  {/* Only show arrow if subLinks exist */}
                  {item.subLinks && item.subLinks.length > 0 && (
                    <button
                      onClick={() => handleCategoryClick(item.title)}
                      className="cursor-pointer p-2 -mr-2"
                    >
                      <IoIosArrowDown
                        className={`text-lg transition-transform duration-300 ${
                          openCategory === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
                {/* Animated Submenu for Main Menu */}
                <div
                  ref={(el) => (submenuRefs.current[item.title] = el)}
                  style={{
                    maxHeight:
                      openCategory === item.title
                        ? `${submenuRefs.current[item.title]?.scrollHeight}px`
                        : "0px",
                  }}
                  className={`overflow-hidden transition-all duration-300 ease-in-out`}
                >
                  {item.subLinks && item.subLinks.length > 0 && (
                    <ul className="bg-dark-charcoal text-white text-sm shadow-lg px-4 py-2 space-y-1 rounded-md mt-2">
                      {" "}
                      {/* Changed bg and text color */}
                      {item.subLinks.map((sub, i) => (
                        <li
                          key={i}
                          className="hover:bg-gray-700 hover:shadow-md hover:rounded-md transition-all duration-200 w-full"
                        >
                          <Link
                            to={sub.link}
                            className="block active:scale-95
                            transition-transform duration-100 text-base
                            text-left px-2 py-1.5 rounded-sm border
                            border-gray-600 mb-1"
                            onClick={toggleMenu}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
      {/* {isCartVisible && (
        <div
          ref={cartRef}
          className="fixed top-12 right-0 z-[100] w-[90vw] max-w-sm"
        >
          <CartWithPopover />
        </div>
      )} */}
    </div>
  );
};

export default MobileNavbar;
