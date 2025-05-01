import React from "react";
import BannerMobiles from "./BannerMobiles";
import GadSlide from "./GadSlide";
import Banner from "./Banner";
import GoHighBanner from "./GoHighBanner";
const HomeBanner = () => {
  return (
    <>
      <Banner />
      <BannerMobiles />
      <GadSlide />
      <GoHighBanner />
    </>
  );
};

export default HomeBanner;
