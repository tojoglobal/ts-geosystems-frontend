import { Link, Outlet, useLocation } from "react-router-dom";

const UserAccountLayout = () => {
  const location = useLocation();
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case "/user/account/orders":
        return { title: "Orders", breadcrumb: "Your Orders" };
      case "/user/account/inbox":
        return { title: "Messages", breadcrumb: "Your Messages" };
      case "/user/account/address-book":
        return { title: "Addresses", breadcrumb: "Your Addresses" };
      case "/user/account/recent-viewed":
        return {
          title: "Recently Viewed",
          breadcrumb: "Recently Viewed Items",
        };
      case "/user/account/account-settings":
        return { title: "Account Settings", breadcrumb: "Account Settings" };
      default:
        return { title: "Account", breadcrumb: "Your Account" };
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const pageInfo = getPageInfo();

  return (
    <div className="p-2 md:p-0 max-w-[1370px] mx-auto py-5">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[11px] mb-5">
        <Link to="/" className="hover:text-crimson-red">
          Home
        </Link>
        <span>/</span>
        <Link to="/account" className="hover:text-crimson-red">
          Your Account
        </Link>
        <span>/</span>
        <span className="text-crimson-red">{pageInfo.breadcrumb}</span>
      </div>
      {/* Page Title */}
      <h1 className="text-[28px] font-light mb-3">{pageInfo.title}</h1>
      <div className="flex flex-wrap md:flex-row gap-3 md:gap-5 justify-center text-[14px] font-normal mb-12">
        <Link
          to="/user/account/orders"
          className={`${
            isActiveLink("/account/orders")
              ? "border-b-2 border-black -mb-[2px]"
              : "hover:text-crimson-red"
          }`}
        >
          ORDERS
        </Link>
        <Link
          to="/user/account/inbox"
          className={`${
            isActiveLink("/account/inbox")
              ? "border-b-2 border-black -mb-[2px]"
              : "hover:text-crimson-red"
          }`}
        >
          MESSAGES (0)
        </Link>
        <Link
          to="/user/account/address-book"
          className={`${
            isActiveLink("/account/address-book")
              ? "border-b-2 border-black -mb-[2px]"
              : "hover:text-crimson-red"
          }`}
        >
          ADDRESSES
        </Link>
        <Link
          to="/user/account/recent-viewed"
          className={`${
            isActiveLink("/account/recent-viewed")
              ? "border-b-2 border-black -mb-[2px]"
              : "hover:text-crimson-red"
          }`}
        >
          RECENTLY VIEWED
        </Link>
        <Link
          to="/user/account/account-settings"
          className={`${
            isActiveLink("/account/account-settings")
              ? "border-b-2 border-black -mb-[2px]"
              : "hover:text-crimson-red"
          }`}
        >
          ACCOUNT SETTINGS
        </Link>
      </div>
      <div className="mb-4">
        <Outlet />
      </div>
    </div>
  );
};

export default UserAccountLayout;
