import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Promo_product_banner_02 from "./Promo_product_banner_02";
import SingleImages from "./SingleImages";
import SlideContorols from "./SlideContorols";
import ExperienceCenterControl from "./ExperienceCenterControl";
import Feature_highlight_banner_03_left_01 from "./feature_highlight_banner_03_left_01";
import AdminUpdateWeProvide from "./HomePage/AdminUpdateWeProvide";
import AdminUpdateOurAchievements from "./HomePage/AdminUpdateOurAchievements";
import AdminUpdateOurAdService from "./HomePage/AdminUpdateOurAdService";
import LastBannerControl from "./LastBannerControl";
import Swal from "sweetalert2";

// Define the exact order of components as they appear on the homepage
const COMPONENT_ORDER = [
  "hero_banner_slider_01",
  "promo_product_banner_02",
  "feature_highlight_banner_03",
  "feature_highlight_banner_04",
  "product_showcase_banner_05",
  "product_showcase_category_grid_06",
  "product_higlight_banner_section_07",
  "featured_products_grid_section_08",
  "last_dual_banner_section_09",
  "experienced_center_popular_products_slider_10",
  "why_choose_us_11",
  "achievements_stats_12",
  "client_logo_carousel_13",
  "advantages_list_14",
  "popular_brands_row_15",
  "youtube_promotion_section_16",
];

const HomePageControl = () => {
  const axiosPublicUrl = useAxiospublic();
  const [enabledComponents, setEnabledComponents] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const {
    data = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homepageControl"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/homepage-control");
      return res?.data?.components;
    },
  });

  // Set fetched data to local state
  useEffect(() => {
    if (data) {
      setEnabledComponents(data);
    }
  }, [data]);

  // Toggle individual component on checkbox change
  const handleToggle = (component) => {
    setEnabledComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  // Handle save manually using PUT request
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await axiosPublicUrl.put("/api/homepage-control", {
        components: enabledComponents,
      });
      if (res.data.success) {
        Swal.fire("Success", "Settings saved successfully!", "success");
      } else {
        Swal.fire({
          icon: "Error",
          text: "Failed to save settings",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b6d7f]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load settings.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mb-2">
      <div className="mb-5 text-center">
        <h2 className="text-xl md:text-2xl font-bold">
          Home Page Component Control
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-1">
          Enable or disable sections on the home page. Changes will affect all
          visitors.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {COMPONENT_ORDER.map((component, idx) => (
          <label
            key={component}
            className="border border-gray-600 rounded-md p-3 cursor-pointer select-none"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={enabledComponents[component] || false}
                onChange={() => handleToggle(component)}
                className="w-4 h-4 accent-[#0b6d7f]"
              />
              <span className="text-sm font-medium">
                {idx + 1}.{" "}
                {component
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
                  .replace(/\d+/g, "")}
              </span>
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-center mt-8 space-x-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-1.5 cursor-pointer bg-[#0b6d7f] text-white font-bold rounded transition hover:bg-[#095666] disabled:bg-gray-400"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
      {/* all dynamic routes */}
      <div className="pt-5">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            Home Page Component Dynamic
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Dynamic sections on the home page. Changes affect all visitors.
          </p>
        </div>
        <div className="my-6 border-t border-gray-200/20" />
        <SlideContorols />
        <div className="my-6 border-t border-gray-200/20" />
        <Promo_product_banner_02 key="1" />
        <div className="my-6 border-t border-gray-200/20" />
        <Feature_highlight_banner_03_left_01 key="2" />
        <div className="my-6 border-t border-gray-200/20" />
        <SingleImages />
        <div className="my-6 border-t border-gray-200/20" />
        <LastBannerControl />
        <div className="my-6 border-t border-gray-200/20" />
        <ExperienceCenterControl />
        <div className="my-6 border-t border-gray-200/20" />
        <AdminUpdateWeProvide />
        <div className="my-6 border-t border-gray-200/20" />
        <AdminUpdateOurAchievements />
        <div className="my-6 border-t border-gray-200/20" />
        <AdminUpdateOurAdService />
      </div>
    </div>
  );
};

export default HomePageControl;

// unique all name
// {
//   "hero_banner_slider_01": [...],
//   "promo_product_banner_02": {...},
//   "feature_highlight_banner_03_left_01": [...],
//   "feature_highlight_banner_03_right_02": [...],
//   "feature_highlight_banner_04_left_01": [...],
//   "feature_highlight_banner_04_right_02": [...],
//   "product_showcase_category_grid_05": [...],
//   "product_higlight_banner_section_06": {...},
//   "featured_products_grid_section_07": [...],
//   "experienced_center_popular_products_slider_08": [...],
//   "why_choose_us_09": [...],
//   "achievements_stats_10": [...],
//   "client_logo_carousel_11": [...],
//   "advantages_list_12": [...],
//   "popular_brands_row_13": [...],
//   "youtube_promotion_section_14": [...],
// }
