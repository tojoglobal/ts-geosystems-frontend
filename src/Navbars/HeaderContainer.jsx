import { Popover } from "@headlessui/react";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCart } from "react-icons/pi";
import { Link } from "react-router-dom";
import SearchOverlay from "./SearchOverlay";
import { useAppContext } from "../context/useAppContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../features/CartToggleSlice/CartToggleSlice";

const HeaderContainer = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const { showSearch, setShowSearch } = useAppContext();
  const dispatch = useDispatch();

  return (
    <div className="max-w-[1300px] mx-auto z-50">
      <div className="flex justify-between items-center py-5">
        {/* Logo */}
        <Link to="/">
          <img
            src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
            alt="G2 Survey"
            className="w-full"
          />
        </Link>
        <div className="flex items-center gap-4 relative">
          {/* Search */}
          <div
            className="flex items-center mx-4 py-1 w-[395px] relative"
            onClick={() => setShowSearch(true)}
          >
            <input
              type="text"
              placeholder="Search"
              className="input text-sm placeholder:italic w-full focus:outline-none border border-[#ebebeb] bg-transparent rounded-[4px]"
            />
            <IoSearchOutline className="text-[#e62245] text-[28px] absolute right-6" />
          </div>
          {/* User */}
          <Link to="/login">
            <LuUserRound className="text-[36px] text-davy-gray hover:text-crimson-red cursor-pointer" />
          </Link>
          {/* Cart with Popover */}
          <div className="relative" onClick={() => dispatch(toggleCart())}>
            <PiShoppingCart className="text-[36px] text-davy-gray hover:text-crimson-red cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          </div>
          {/* <CartWithPopover /> */}
          {/* Search Overlay */}
          <SearchOverlay
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderContainer;
