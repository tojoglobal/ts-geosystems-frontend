import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCart } from "react-icons/pi";
import NewEquipmentDropdown from "./NewEquipmentDropdown";
import { useAppContext } from "../context/useAppContext";
import { Link } from "react-router-dom";

const MainNavContainer = () => {
  const { setShowSearch } = useAppContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSticky, setSticky] = useState(false);
  const [menuIcon, setMenuIcon] = useState(false);
  const [shouldAnimateSticky, setShouldAnimateSticky] = useState(false);
  const dropdownRef = useRef(null);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setSticky(true);
      setShouldAnimateSticky(true);
    } else {
      setSticky(false);
      setShouldAnimateSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setMenuIcon(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setMenuIcon(!menuIcon);
  };

  return (
    <div
      className={`border-y border-crimson-red bg-white z-50 w-full ${
        shouldAnimateSticky
          ? "transition-transform duration-[900ms] ease-in-out"
          : ""
      } ${
        isSticky
          ? "fixed top-0 translate-y-0 shadow-md"
          : "relative top-12 -translate-y-full"
      }`}
    >
      <div className="relative" ref={dropdownRef}>
        <div className="max-w-[1390px]  mx-auto flex justify-between items-center">
          {/* Left side */}
          <div
            className="relative cursor-pointer py-2.5"
            onClick={toggleDropdown}
          >
            <div
              className={`flex items-center gap-2.5 transition-all duration-500 ease-in-out  relative ${
                isDropdownOpen ? "translate-x-5" : ""
              }`}
            >
              <button
                onClick={toggleDropdown}
                className={`cursor-pointer ${
                  isDropdownOpen ? "text-crimson-red" : "text-charcoal"
                }`}
              >
                {menuIcon ? <X size={20} /> : <Menu size={20} />}
              </button>
              <button
                className={`relative overflow-hidden  font-semibold cursor-pointer transition-all duration-500 ease-in-out ${
                  isDropdownOpen ? "text-crimson-red" : "text-charcoal"
                }`}
              >
                <span className="relative block">
                  <span>NEW EQUIPMENT</span>
                </span>
              </button>
            </div>
            <span
              className={`absolute left-0 bottom-0 h-[3px] bg-crimson-red transition-all duration-700 ease-in-out ${
                isDropdownOpen ? "w-[12.2rem]" : "w-0"
              }`}
            ></span>
          </div>

          {/* Right side */}
          {!isSticky ? (
            <div className="flex gap-6 text-base font-semibold text-charcoal">
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300  py-2.5">
                USED EQUIPMENT
              </span>
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300  py-2.5">
                CLEARANCE
              </span>
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300  py-2.5">
                HIRE
              </span>
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300  py-2.5">
                <Link to="/service">SERVICE</Link>
              </span>
              {/* Dropdown Wrapper */}
              <div className="relative group cursor-pointer py-2.5">
                <span className="flex items-center gap-1 hover:text-crimson-red transition-colors duration-300">
                  SUPPORT{" "}
                  <MdOutlineKeyboardArrowDown className="text-xl"></MdOutlineKeyboardArrowDown>
                </span>
                {/* Dropdown Menu */}
                <div className="absolute -left-10 top-full w-50 bg-white rounded-sm border border-slightly-dark shadow-lg pl-4 py-2 hidden group-hover:block z-50">
                  <ul className="space-y-1 text-sm text-charcoal">
                    <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                      Software Downloads
                    </li>
                    <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                      <Link to="/quick-guides">Quick Guides</Link>
                    </li>
                    <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                      User Manuals
                    </li>
                    <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                      Remote Support
                    </li>
                  </ul>
                </div>
              </div>
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300  py-2.5">
                TRADE IN
              </span>
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300  py-2.5">
                G2 BLOG
              </span>
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2.5">
                <Link to="/about-us">ABOUT US</Link>
              </span>
              <span className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2.5">
                <Link to="/contact-us">CONTACT US</Link>
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div
                  className="flex items-center px-1 w-[495px] relative"
                  onClick={() => setShowSearch(true)}
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className="input text-[13px] placeholder:italic w-full h-7 focus:outline-none focus:ring-0 border border-slightly-dark focus:border-slightly-dark bg-transparent rounded-[4px]"
                  />
                  <IoSearchOutline className="text-[#e62245] text-[20px] absolute right-5" />
                </div>

                {/* User Icon */}
                <LuUserRound className="text-[25px] text-davy-gray hover:text-crimson-red font-medium cursor-pointer duration-300 ease-in" />

                {/* Cart Icon with badge */}
                <div className="relative">
                  <PiShoppingCart className="text-[25px] text-davy-gray hover:text-crimson-red cursor-pointer duration-300 ease-in font-medium" />
                  <span className="absolute -top-1 -right-2.5 bg-[#e62245] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    0
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <>
          {/* Backdrop Overlay inside relative wrapper */}
          {isDropdownOpen && (
            <div
              className="absolute top-[45px] w-full inset-0 z-[40] bg-black/40 bg-opacity-50 transition-all h-lvw duration-300"
              onClick={toggleDropdown}
            ></div>
          )}

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-[98px] top-[45px] z-50">
              <NewEquipmentDropdown />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default MainNavContainer;
