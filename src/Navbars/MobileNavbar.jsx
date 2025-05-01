import React, { useEffect, useRef, useState } from "react";
// import { FiMenu, FiSearch, FiUser, FiShoppingCart, FiX } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCart } from "react-icons/pi";
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

const MobileNavbar = () => {
  const submenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [submenuHeight, setSubmenuHeight] = useState(0);
  const [animatingCategory, setAnimatingCategory] = useState(null);

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
            <button>
              <LuUserRound className="text-2xl text-red-600" />
            </button>
            {/* Cart Icon with badge */}
            <button className="relative">
              <PiShoppingCart className="text-2xl text-red-600" />
              <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                4
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
      <div className="flex w-full justify-center items-center mt-12 pt-4 pb-10 px-13  bg-white border-y border-slightly-dark">
        <img
          //   className="h-auto w-full"
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
          alt="G2 Survey"
          title="G2 Survey"
        />
      </div>

      {/* Side Menu */}
      <div
        className={`fixed top-12 left-0 w-full h-full bg-charcoal-gray border-t-2 z-50 border-davy-gray text-white transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="bg-charcoal-gray px-2.5 py-2 z-40 shadow-md relative border-b border-gray-600">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-1.5 border border-gray-300 placeholder:text-charcoal-black bg-gray-200  focus:outline-none "
          />
          <IoSearchOutline className="text-[#e62245] text-[28px] absolute top-3 right-5" />
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
          <div>
            <div className=" border border-crimson-red rounded-sm mx-3 my-4 px-3 py-1">
              <span className="text-base font-semibold">SHOP BY CATEGORY</span>
            </div>

            <ul className="mx-3 px-4 space-y-1">
              {categories.map((item, index) => (
                <li key={index} className="cursor-pointer">
                  <div
                    onClick={() => handleCategoryClick(item.title)}
                    className="flex justify-between items-center py-0.5 text-white"
                  >
                    {item.title}
                    {item.subLinks && (
                      <span className="text-xl">
                        {openCategory === item.title ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </span>
                    )}
                  </div>
                  {item.subLinks &&
                    (openCategory === item.title ||
                      animatingCategory === item.title) && (
                      <ul
                        ref={submenuRef}
                        style={{
                          height:
                            openCategory === item.title ? submenuHeight : 0,
                        }}
                        className={`ml-4 space-y-1 text-sm text-red-400 overflow-hidden transition-all duration-500 ease-in-out ${
                          openCategory === item.title
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2"
                        }`}
                      >
                        {item.subLinks.map((sub, idx) => (
                          <li
                            key={idx}
                            className="pl-2 border-l border-red-400"
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
