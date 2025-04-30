import { Popover } from "@headlessui/react";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCart } from "react-icons/pi";
import { Link } from "react-router-dom";
import SearchOverlay from "./SearchOverlay";
import { useAppContext } from "../context/useAppContext";

const HeaderContainer = () => {
  const { showSearch, setShowSearch } = useAppContext();

  const cartItems = [
    {
      id: 1,
      brand: "Leica Geosystems",
      name: 'Leica TS16 5" Total Station with CS20 LTE Controller',
      price: "£26,100.00",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/100x100/products/523/3151/leica-ts16-total-station-f__07894.1669836115.1280.1280__55911.1678487753.1280.1280__49659.1695732162.jpg?c=1",
    },
    {
      id: 2,
      brand: "Leica Geosystems",
      name: 'Leica TS16 1" R500 Robotic Total Station + CS20 LTE Controller',
      price: "£25,740.00",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/100x100/products/802/4633/1659454908.1280.1280__87897.1727717909.jpg?c=1",
    },
  ];

  return (
    <div className="max-w-[1380px] mx-auto z-50">
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
          <Popover className="relative">
            <Popover.Button className="relative focus:outline-none">
              <PiShoppingCart className="text-[36px] text-davy-gray hover:text-crimson-red cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            </Popover.Button>
            <Popover.Panel className="absolute right-0 z-20 mt-8 w-[360px] bg-white border border-gray-200 shadow-xl p-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="py-2">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-contain"
                        />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            {item.brand}
                          </p>
                          <p className="text-xs font-medium text-crimson-red leading-tight mb-1">
                            {item.name}
                          </p>
                          <p className="text-sm text-black font-semibold">
                            {item.price}
                          </p>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && (
                        <hr className="my-3 border-t border-gray-300" />
                      )}
                    </div>
                  ))}
                  <button className="mb-5 flex items-center justify-center gap-2 w-full bg-[#ffc439] text-black font-semibold py-2 rounded my-3">
                    <img src="/paypal.svg" className="w-16" alt="" />
                    Checkout
                  </button>
                  <div className="flex gap-3 pt-5 border-t">
                    <Link to="/checkout" className="w-1/2">
                      <button className="w-full bg-crimson-red text-sm text-white font-semibold py-2 rounded">
                        CHECK OUT NOW
                      </button>
                    </Link>
                    <Link to="/cart" className="w-1/2">
                      <button className="w-full bg-crimson-red text-sm text-white font-semibold py-2 rounded">
                        VIEW CART
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </Popover.Panel>
          </Popover>
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
