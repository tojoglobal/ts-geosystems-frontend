import MainBanner from "./MainBanner";
import MobilesBanner from "./MobilesBanner";
import GadgetBanner from "./GadgetBanner";
import GadgetGoHighBanner from "./GadgetGoHighBanner";
import CategoryBanner from "./CategoryBanner";
import GoHighBanner from "./GoHighBanner";
import HeaderBottom from "../../../Navbars/HeaderBottom";
import { useLocation } from "react-router-dom";

const HomeBanner = ({ control }) => {
  const loc = useLocation();
  const home = loc.pathname === "/";
  return (
    <>
      {home && control.hero_banner_slider_01 && <HeaderBottom />}
      {control.hero_banner_slider_01 && <MainBanner />}
      {control.promo_product_banner_02 && <MobilesBanner />}
      {control.feature_highlight_banner_03 && <GadgetBanner />}
      {control.feature_highlight_banner_04 && <GadgetGoHighBanner />}
      {control.product_showcase_category_grid_05 && <CategoryBanner />}
      {control.product_higlight_banner_section_06 && <GoHighBanner />}
    </>
  );
};

export default HomeBanner;
