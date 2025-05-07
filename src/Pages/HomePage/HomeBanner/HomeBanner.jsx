import MainBanner from "./MainBanner";
import MobilesBanner from "./MobilesBanner";
import GadgetBanner from "./GadgetBanner";
import GadgetGoHighBanner from "./GadgetGoHighBanner";
import CategoryBanner from "./CategoryBanner";
import GoHighBanner from "./GoHighBanner";

const HomeBanner = ({ control }) => {
  return (
    <>
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
