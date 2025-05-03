import React from "react";
import MainBanner from "./MainBanner";
import MobilesBanner from "./MobilesBanner";
import GadgetBanner from "./GadgetBanner";
import GadgetGoHighBanner from "./GadgetGoHighBanner";
import CategoryBanner from "./CategoryBanner";
import GoHighBanner from "./GoHighBanner";
const HomeBanner = ({ control }) => {
  return (
    <>
      {control.MainBanner && <MainBanner />}
      {control.MobilesBanner && <MobilesBanner />}
      {control.GadgetBanner && <GadgetBanner />}
      {control.GadgetGoHighBanner && <GadgetGoHighBanner />}
      {control.CategoryBanner && <CategoryBanner />}
      {control.GoHighBanner && <GoHighBanner />}
    </>
  );
};

export default HomeBanner;
