import React, { useState } from "react";
import { FiMenu, FiSearch, FiUser, FiShoppingCart, FiX } from "react-icons/fi";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 w-full flex items-center justify-between px-4 py-3 bg-white shadow-sm">
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

        {/* Right: Icons */}
        <div className="flex gap-4">
          <button>
            <FiSearch className="text-2xl text-red-600" />
          </button>
          <button>
            <FiUser className="text-2xl text-red-600" />
          </button>
          <button>
            <FiShoppingCart className="text-2xl text-red-600" />
          </button>
        </div>
      </div>

      {/* Logo Section */}
      <div className="flex justify-center items-center pt-4 pb-10 px-13 bg-white border-y border-slightly-dark">
        <img
          className="h-auto w-full"
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
          alt="G2 Survey"
          title="G2 Survey"
        />
      </div>

      {/* Side Menu */}
      <div
        className={`fixed top-12 left-0 w-full h-full bg-gray-800 text-white transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4">
          <span className="text-lg font-semibold">SHOP BY CATEGORY</span>
          <button onClick={toggleMenu}></button>
        </div>

        <ul className="px-4 space-y-4">
          <li>Shop All</li>
          <li>Used Surveying Equipment</li>
          <li>3D Laser Scanning</li>
          <li>Total Stations</li>
          <li>GPS/GNSS Systems</li>
          <li>Lasers</li>
          <li>Levels</li>
          <li>Location Detection</li>
          <li>Distance Measuring</li>
          <li>Construction</li>
          <li>Surveying Accessories</li>
          <li>Clearance</li>
        </ul>
      </div>
    </>
  );
};

export default MobileNavbar;
