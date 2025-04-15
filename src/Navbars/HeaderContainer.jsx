import React from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCart } from "react-icons/pi";

const HeaderContainer = () => {
  return (
    <div className="max-w-[1380px] mx-auto align-middle">
      <div className="flex justify-between items-center py-5">
        {/* ts-geosystems logo */}
        <div>
          <img
            class=" w-full"
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
            alt="G2 Survey"
            title="G2 Survey"
          ></img>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex items-center  px-4 py-1 w-[395px] relative">
            <input
              type="text"
              placeholder="Search"
              className="input text-sm placeholder:italic w-full focus:outline-none focus:ring-0 border-slightly-dark focus:border-slightly-dark bg-transparent rounded-[4px]"
            />
            <IoSearchOutline className="text-[#e62245] text-[28px] absolute right-6" />
          </div>

          {/* User Icon */}
          <LuUserRound className="text-[36px] text-davy-gray hover:text-crimson-red font-medium cursor-pointer duration-300 ease-in" />

          {/* Cart Icon with badge */}
          <div className="relative">
            <PiShoppingCart className="text-[36px] text-davy-gray hover:text-crimson-red cursor-pointer duration-300 ease-in font-medium" />
            <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderContainer;
