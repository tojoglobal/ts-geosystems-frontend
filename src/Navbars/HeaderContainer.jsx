import Swal from "sweetalert2";
import { IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCart } from "react-icons/pi";
import { Link } from "react-router-dom";
import SearchOverlay from "./SearchOverlay";
import { useAppContext } from "../context/useAppContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../features/CartToggleSlice/CartToggleSlice";
import { useState, useEffect, useRef } from "react";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { logout } from "../features/UserAuth/authSlice";
import axios from "axios";

const HeaderContainer = () => {
  const axiosPublic = useAxiospublic();
  const { isAuth, user } = useSelector((state) => state.authUser);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { showSearch, setShowSearch } = useAppContext();
  const dispatch = useDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSticky] = useState(false);
  const userMenuRef = useRef(null);
  const userIconRef = useRef(null);
  const [settings, setSettings] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await axiosPublic.post("/api/user-logout", { email: user.email });
      dispatch(logout());
      Swal.fire({
        icon: "success",
        title: "Logged out successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Logout failed. ${error?.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_OPEN_APIURL}/api/settings`)
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  const logoUrl =
    settings?.main_logo &&
    (settings.main_logo.startsWith("/") ||
      settings.main_logo.startsWith("http"))
      ? `${import.meta.env.VITE_OPEN_APIURL || ""}${settings.main_logo}`
      : "";

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto z-50">
      <div className="flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/">
          <img src={logoUrl} alt="G2 Survey" className="w-full" />
        </Link>
        <div className="flex items-center gap-4 relative">
          {/* Search */}
          <div
            className="flex items-center mx-4 py-1 w-[350px] relative"
            onClick={() => setShowSearch(true)}
          >
            <input
              type="text"
              placeholder="Search"
              className="input text-sm text-black placeholder:italic w-full focus:outline-none border border-[#ebebeb] bg-transparent rounded-[4px]"
            />
            <IoSearchOutline className="text-[#e62245] text-[28px] absolute right-2" />
          </div>
          {/* User Account Section */}
          <div className="relative">
            {isAuth ? (
              <>
                <div
                  ref={userIconRef}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <LuUserRound className="text-[36px] text-davy-gray hover:text-crimson-red cursor-pointer" />
                </div>
                {showUserMenu && (
                  <div
                    ref={userMenuRef}
                    className={`absolute z-[100] w-[250px] bg-white border border-gray-200 shadow-xl p-4 ${
                      isSticky ? "top-11 right-48" : "top-[72px] -right-[75px]"
                    }`}
                  >
                    <div className="flex flex-col px-2">
                      <h3 className="text-[20px] font-bold mb-2 border-b-2 border-crimson-red">
                        ACCOUNT INFO
                      </h3>
                      <Link
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        to="/user/account/orders"
                        className="py-[1px] text-sm font-normal hover:text-crimson-red"
                      >
                        Orders
                      </Link>
                      {/* <Link
                        to="/user/account/returns"
                        className="py-[1px] text-sm font-normal hover:text-crimson-red"
                      >
                        Returns
                      </Link> */}
                      <Link
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        to="/user/account/inbox"
                        className="py-[1px] text-sm font-normal hover:text-crimson-red"
                      >
                        Messages (0)
                      </Link>
                      <Link
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        to="/user/account/address-book"
                        className="py-[1px] text-sm font-normal hover:text-crimson-red"
                      >
                        Addresses
                      </Link>
                      <Link
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        to="/user/account/recent-viewed"
                        className="py-[1px] text-sm font-normal hover:text-crimson-red"
                      >
                        Recently Viewed
                      </Link>
                      <Link
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        to="/user/account/account-settings"
                        className="py-[1px] text-sm font-normal hover:text-crimson-red"
                      >
                        Account Settings
                      </Link>
                      <div>
                        <div className="flex items-center justify-center my-2">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <div className="mx-4 text-sm font-normal italic">
                            OR
                          </div>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full cursor-pointer bg-crimson-red text-white text-sm font-semibold py-1 px-4 rounded hover:bg-red-700"
                        >
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/user/login">
                <LuUserRound className="text-[36px] text-davy-gray hover:text-crimson-red cursor-pointer" />
              </Link>
            )}
          </div>
          {/* Cart with Popover */}
          <div className="relative" onClick={() => dispatch(toggleCart())}>
            <PiShoppingCart className="text-[36px] text-davy-gray hover:text-crimson-red cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-[#e62245] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          </div>
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
