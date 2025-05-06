import React, { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleCart } from "../features/CartToggleSlice/CartToggleSlice";
import CartWithPopover from "./CartWithPopover";

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
  const { totalQuantity } = useSelector((state) => state.cart);
  const submenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [submenuHeight, setSubmenuHeight] = useState(0);
  const [animatingCategory, setAnimatingCategory] = useState(null);
  const { isCartVisible } = useSelector((state) => state.cartToggle);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setIsMenuOpen(false);
  };

  // const handleCategoryClick = (title) => {
  //   setOpenCategory((p) => (p === title ? null : title));
  // };

  const handleCategoryClick = (title) => {
    if (openCategory === title) {
      // Closing: animate and then hide
      setAnimatingCategory(title); // keep it rendered
      setSubmenuHeight(0); // start animation
      setTimeout(() => {
        setOpenCategory(null); // hide it after animation
        setAnimatingCategory(null); // clear animating
      }, 500); // must match transition duration
    } else {
      // Opening: show and animate height
      setOpenCategory(title);
      setAnimatingCategory(title); // ensure it's mounted
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

  return (
    <div className="w-full relative z-50">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 w-full ">
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
          {/* Hamburger Menu + Phone */}
          <div className="flex items-center gap-3">
            {/* Left: Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="relative w-8 h-4 flex flex-col gap-0.5 justify-between items-center z-50"
            >
              {/* Top bar */}
              <span
                className={`block w-5 h-0.5 bg-crimson-red transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
              />
              {/* Middle bar */}
              <span
                className={`block w-5 h-0.5 bg-crimson-red transition-opacity duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* Bottom bar */}
              <span
                className={`block w-5 h-0.5 bg-crimson-red transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                }`}
              />
            </button>
            {/* Center: Phone Number */}
            <a
              href="tel:+443330232200"
              className="text-xs font-normal text-burgundy"
            >
              +44 (0)333 023 2200
            </a>
          </div>

          {/*Icons: search , user , cart */}
          <div className="flex gap-2">
            <button onClick={toggleSearch}>
              <IoSearchOutline className="text-2xl text-red-600" />
            </button>
            <Link to="/login">
              <LuUserRound className="text-2xl text-red-600" />
            </Link>
            {/* Cart Icon with badge */}
            <button className="relative" onClick={() => dispatch(toggleCart())}>
              <PiShoppingCart className="text-2xl text-red-600" />
              <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {totalQuantity}
              </span>
            </button>
          </div>
        </div>
        {/* Search box */}
        {isSearchOpen && (
          <div className="bg-charcoal-gray px-2.5 py-2 z-40 shadow-md relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-1.5 border border-gray-300 placeholder:text-charcoal-black bg-gray-200  focus:outline-none "
            />
            <IoSearchOutline className="text-[#e62245] text-[28px] absolute top-3 right-5" />
          </div>
        )}
      </div>
      {/* Logo Section */}
      <Link
        to="/"
        className="flex w-full justify-center items-center mt-12 pt-4 pb-10 px-13  bg-white border-y border-slightly-dark"
      >
        <img
          //   className="h-auto w-full"
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
          alt="G2 Survey"
          title="G2 Survey"
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
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-sm bg-gray-200 text-black placeholder:text-gray-600 focus:outline-none"
            />
            <IoSearchOutline className="absolute top-2.5 right-4 text-crimson-red text-xl" />
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
          <div className="flex mb-24 space-x-4 text-2xl mt-6 text-white">
            <a href="#">
              <FaLinkedinIn />
            </a>
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaPinterestP />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
      {isCartVisible && <CartWithPopover />}
    </div>
  );
};

export default MobileNavbar;
