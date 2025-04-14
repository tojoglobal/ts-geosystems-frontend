import React from "react";
import TopMenu from "./TopMenu";
import HeaderContainer from "./HeaderContainer";
import MainNavContainer from "./MainNavContainer";
import HeaderBottom from "./HeaderBottom";

const MainNavbars = () => {
  return (
    <div>
      <div className="">
        <TopMenu />
        <HeaderContainer />
        <MainNavContainer />
        <HeaderBottom />
      </div>
    </div>
  );
};

export default MainNavbars;
