import React from "react";
import TopMenu from "./TopMenu";
import HeaderContainer from "./HeaderContainer";
import MainNavContainer from "./MainNavContainer";
import HeaderBottom from "./HeaderBottom";
import MobileNavbar from "./MobileNavbar";

const MainNavbars = () => {
  return (
    <>
      {/* Desktop & tablet only */}
      <div className="hidden md:block">
        <TopMenu />
        <HeaderContainer />
        <MainNavContainer />
        <HeaderBottom />
      </div>

      {/* Mobile only */}
      <div className="md:hidden">
        <MobileNavbar />
        <HeaderBottom />
      </div>
    </>
  );
};

export default MainNavbars;
