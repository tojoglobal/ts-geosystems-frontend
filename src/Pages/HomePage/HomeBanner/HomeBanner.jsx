import HeroBanner from "./HeroBanner";
import PromoProductBanner from "./PromoProductBanner";
import GadgetBanner from "./GadgetBanner";
import GadgetGoHighBanner from "./GadgetGoHighBanner";
import CategoryBanner from "./CategoryBanner";
import ProductShowcaseBanner from "./ProductShowcaseBanner";
import TextHeroBanner from "../../../Navbars/TextHeroBanner";
import { useLocation } from "react-router-dom";
import GoHighBannerAnother from "./GoHighBannerAnother";

const HomeBanner = ({ control }) => {
  const loc = useLocation();
  const home = loc.pathname === "/";
  return (
    <>
      {home && control.hero_banner_slider_01 && <TextHeroBanner />}
      {control.hero_banner_slider_01 && <HeroBanner />}
      {control.promo_product_banner_02 && <PromoProductBanner />}
      {control.feature_highlight_banner_03 && <GadgetBanner />}
      {control.feature_highlight_banner_04 && <GadgetGoHighBanner />}
      {control.product_showcase_banner_05 && <ProductShowcaseBanner />}
      {control.product_showcase_category_grid_06 && <CategoryBanner />}
      {control.product_higlight_banner_section_07 && <GoHighBannerAnother />}
    </>
  );
};

export default HomeBanner;
