import React from "react";
import BannerSlider from "./BannerSlider";
import GadSlide from "./GadSlide";
import Banner from "./Banner";
import GoHighBanner from "./GoHighBanner";
const HomeBanner = () => {
  return (
    <>
      <Banner />
      <BannerSlider />
      <GadSlide />
      <GoHighBanner />
    </>
  );
};

export default HomeBanner;
