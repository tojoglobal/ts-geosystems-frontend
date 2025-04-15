import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const MainNavContainer = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSticky, setSticky] = useState(false);
  const [menuIcon, setMenuIcon] = useState(false);
  const [shouldAnimateSticky, setShouldAnimateSticky] = useState(false);

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
          : "-translate-y-full mt-12"
      }`}
    >
      <div className="relative">
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
            <div className="flex gap-6 text-sm font-semibold text-black">
              <span className="cursor-pointer">USED EQUIPMENT</span>
              <span className="cursor-pointer">CLEARANCE</span>
              <span className="cursor-pointer">HIRE</span>
              <span className="cursor-pointer">SERVICE</span>
              <span className="cursor-pointer">SUPPORT</span>
              <span className="cursor-pointer">TRADE IN</span>
              <span className="cursor-pointer">G2 BLOG</span>
              <span className="cursor-pointer">ABOUT US</span>
              <span className="cursor-pointer">CONTACT US</span>
            </div>
          ) : (
            <div className="ml-auto">
              <input
                type="text"
                placeholder="Search..."
                className="border px-3 py-1 rounded-md text-sm"
              />
            </div>
          )}
        </div>
        {/* isDropdownOpen menu */}
        <>
          {/* Backdrop Overlay inside relative wrapper */}
          {isDropdownOpen && (
            <div className="absolute top-[45px] w-full inset-0 z-[40] bg-black/40 bg-opacity-50 transition-all h-lvw duration-300"></div>
          )}

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-[98px] top-[45px] z-50 bg-white shadow-md p-4 w-[250px] animate-fadeIn">
              <ul className="space-y-2 text-black">
                <li>Excavators</li>
                <li>Bulldozers</li>
                <li>Loaders</li>
                <li>More...</li>
              </ul>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default MainNavContainer;
