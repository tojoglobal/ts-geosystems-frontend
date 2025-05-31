import ExperienceCenter from "./ExperienceCenter";
import OurAchievements from "./OurAchievements";
import OurAdServices from "./OurAdServices";
import OurYoutube from "./OurYoutube";
import PopularBrands from "./PopularBrands";
import ProductHighlights from "./ProductHighlights";
import TopClients from "./TopClients";
import WeProvide from "./WeProvide";
import HomeBanner from "./HomeBanner/HomeBanner";
import useDataQuery from "../../utils/useDataQuery";
import { ComponentLoader } from "../../utils/Loader/ComponentLoader";
import LastBanner from "./HomeBanner/LastBanner";

const MainHome = () => {
  const { data, isLoading, isError } = useDataQuery(
    ["homepageControl"],
    "/api/homepage-control"
  );
  const comp = data?.components || {};
  // For simpler components, you can use the generic loader:
  // if (isLoading) return <ComponentLoader />;
  if (isLoading)
    return (
      <div className="space-y-8 my-2">
        <ComponentLoader componentName="MainBanner" />
        <ComponentLoader componentName="ProductHighlights" />
        <ComponentLoader type="spinner" />
      </div>
    );
  if (isError)
    return (
      <div className="min-h-[80vh] text-center my-16">
        Error loading homepage settings.
      </div>
    );

  const allComponentsDisabled = Object?.values(comp).every(
    (value) => value === false
  );

  if (allComponentsDisabled) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Website Under Maintenance
          </h2>
          <p className="text-gray-600">
            We're currently updating our website. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeBanner control={comp} />
      {comp.featured_products_grid_section_08 && <ProductHighlights />}
      {comp.last_dual_banner_section_09 && <LastBanner />}
      {comp.experienced_center_popular_products_slider_10 && (
        <ExperienceCenter />
      )}
      {comp.why_choose_us_11 && <WeProvide />}
      {comp.achievements_stats_12 && <OurAchievements />}
      {comp.client_logo_carousel_13 && <TopClients />}
      {comp.advantages_list_14 && <OurAdServices />}
      {comp.popular_brands_row_15 && <PopularBrands />}
      {comp.youtube_promotion_section_16 && <OurYoutube />}
    </>
  );
};

export default MainHome;
