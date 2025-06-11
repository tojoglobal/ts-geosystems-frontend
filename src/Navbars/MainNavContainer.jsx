/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import NewEquipmentDropdown from "./NewEquipmentDropdown";
import { useAppContext } from "../context/useAppContext";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartWithPopover from "./CartWithPopover";
import { setSticky } from "../features/Sticky/Sticky";
import { PiShoppingCart } from "react-icons/pi";
import { toggleCart } from "../features/CartToggleSlice/CartToggleSlice";
import useDataQuery from "../utils/useDataQuery";

const MainNavContainer = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const { isSticky } = useSelector((state) => state.sticky);
  const { isCartVisible } = useSelector((state) => state.cartToggle);

  const { data: dynamicLinks } = useDataQuery(
    ["dynamicLinks"],
    "/api/dynamic-links"
  );
  const headerLinks = dynamicLinks?.data?.filter((l) => l.show_in_header);
  const { setShowSearch } = useAppContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [menuIcon, setMenuIcon] = useState(false);
  const [shouldAnimateSticky, setShouldAnimateSticky] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const handleScroll = () => {
    if (window.scrollY > 100) {
      dispatch(setSticky(true));
      setShouldAnimateSticky(true);
    } else {
      dispatch(setSticky(false));
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
    <>
      <div
        className={`border-y border-crimson-red bg-white ${
          isDropdownOpen ? "z-50" : "z-20"
        } w-full ${
          shouldAnimateSticky
            ? "transition-transform duration-[900ms] ease-in-out"
            : ""
        } ${
          isSticky
            ? "fixed top-0 translate-y-0 shadow-md py-[1px]"
            : "relative top-12 -translate-y-full"
        }`}
      >
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <div className="w-full max-w-[95%] 2xl:max-w-[1370px] mx-auto flex justify-between items-center">
              {/* Left side */}
              <div
                className="relative cursor-pointer py-2"
                onClick={toggleDropdown}
                ref={dropdownRef}
              >
                <div
                  className={`flex items-center gap-3 transition-all duration-500 ease-in-out relative ${
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
                    className={`relative overflow-hidden font-semibold cursor-pointer transition-all duration-500 ease-in-out ${
                      isDropdownOpen ? "text-crimson-red" : "text-[#4d4d4a]"
                    }`}
                  >
                    <span className="relative block">
                      <span className="text-[16px]">NEW EQUIPMENT</span>
                    </span>
                  </button>
                </div>
                <span
                  className={`absolute left-0 bottom-0 h-[3px] bg-crimson-red transition-all duration-700 ease-in-out ${
                    isDropdownOpen ? "w-[12.2rem]" : "w-0"
                  }`}
                ></span>
                {isDropdownOpen && (
                  <div className="absolute top-[86%] left-0 mt-2 z-50">
                    <NewEquipmentDropdown />
                  </div>
                )}
              </div>
              {/* Right side */}
              {!isSticky ? (
                <div className="flex gap-6 lg:gap-9 text-[14px] font-bold text-charcoal relative">
                  <Link
                    to="/used"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    USED EQUIPMENT
                  </Link>
                  <Link
                    to="/clearance"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    CLEARANCE
                  </Link>
                  <Link
                    to="/hire"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    HIRE
                  </Link>
                  <Link
                    to="/service"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    SERVICE
                  </Link>
                  {headerLinks && headerLinks.length > 0 && (
                    <div className="relative group py-2">
                      <div className="flex uppercase hover:text-crimson-red cursor-pointer">
                        Info <MdOutlineKeyboardArrowDown className="text-xl" />
                      </div>
                      <div className="absolute -left-10 top-full w-50 bg-white rounded-sm border border-slightly-dark shadow-lg pl-4 py-2 hidden group-hover:block z-50">
                        <ul>
                          {headerLinks.map((link) => (
                            <li
                              key={link.slug}
                              className="hover:text-crimson-red cursor-pointer transition-colors duration-300 font-normal text-[13px] text-charcoal"
                            >
                              <Link
                                to={`/ts/${link.slug}`}
                                className="hover:text-crimson-red"
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {/* Dropdown Wrapper */}
                  <div className="relative group py-2">
                    <div className="flex hover:text-crimson-red transition-colors duration-300 cursor-pointer">
                      SUPPORT
                      <MdOutlineKeyboardArrowDown className="text-xl" />
                    </div>
                    {/* Dropdown Menu */}
                    <div className="absolute -left-10 top-full w-50 bg-white rounded-sm border border-slightly-dark shadow-lg pl-4 py-2 hidden group-hover:block z-50">
                      <ul className="space-y-1 font-normal text-[13px] text-charcoal">
                        <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                          <Link to="/support">Support Request Form</Link>
                        </li>
                        <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                          <Link to="/software-downloads">
                            Software Downloads
                          </Link>
                        </li>
                        <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                          <Link to="/quick-guides">Quick Guides</Link>
                        </li>
                        <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                          <Link to="/user-manuals">User Manuals</Link>
                        </li>
                        <li className="hover:text-crimson-red cursor-pointer transition-colors duration-300">
                          <Link to="/remote-support">Remote Support</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <Link
                    to="/trade-in"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    TRADE IN
                  </Link>
                  <Link
                    to="/ts-blog"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    TS BLOG
                  </Link>
                  <Link
                    to="/about-us"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    ABOUT US
                  </Link>
                  <Link
                    to="/contact-us"
                    className="cursor-pointer hover:text-crimson-red transition-colors duration-300 py-2"
                  >
                    CONTACT US
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 relative">
                    {/* Search Bar */}
                    <div
                      className="flex items-center px-1 w-[430px] text-black relative"
                      onClick={() => setShowSearch(true)}
                    >
                      <input
                        type="text"
                        placeholder="Search"
                        className="input text-[13px] placeholder:italic w-full h-7 focus:outline-none focus:ring-0 border border-slightly-dark focus:border-slightly-dark bg-transparent rounded-[4px]"
                      />
                      <IoSearchOutline className="text-[#e62245] text-[20px] absolute right-3" />
                    </div>
                    {/* User Icon */}
                    <Link to="/user/login">
                      <LuUserRound className="text-[23px] text-davy-gray hover:text-crimson-red font-medium cursor-pointer duration-300 ease-in" />
                    </Link>
                    {/* Cart Icon with badge */}
                    <div onClick={() => dispatch(toggleCart())}>
                      <PiShoppingCart className="text-[23px] text-davy-gray hover:text-crimson-red cursor-pointer duration-300 ease-in font-medium" />
                      <span className="absolute -top-1 -right-2.5 bg-[#e62245] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {totalQuantity}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {isCartVisible && <CartWithPopover />}
          </div>
        </div>
      </div>
      {isDropdownOpen && (
        <div
          className={`fixed ${!isSticky && "top-44"} inset-0 bg-black/50 z-40`}
          onClick={toggleDropdown}
        />
      )}
    </>
  );
};

export default MainNavContainer;
