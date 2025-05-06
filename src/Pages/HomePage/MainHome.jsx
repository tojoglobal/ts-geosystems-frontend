import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import ExperienceCenter from "./ExperienceCenter";
import OurAchievements from "./OurAchievements";
import OurAdServices from "./OurAdServices";
import OurYoutube from "./OurYoutube";
import PopularBrands from "./PopularBrands";
import ProductHighlights from "./ProductHighlights";
import TopClients from "./TopClients";
import WeProvide from "./WeProvide";
import HomeBanner from "./HomeBanner/HomeBanner";

const MainHome = () => {
  const axiosPublicUrl = useAxiospublic();
  const {
    data: comp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["homepageControl"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/homepage-control");
      return res?.data?.components || {};
    },
  });

  console.log(comp);

  if (isLoading) return null;
  if (isError) return <div>Error loading homepage settings.</div>;

  return (
    <>
      {comp.MainBanner ||
      comp.MobilesBanner ||
      comp.GadgetBanner ||
      comp.GadgetGoHighBanner ||
      comp.CategoryBanner ||
      comp.GoHighBanner ? (
        <HomeBanner control={comp} />
      ) : null}

      {comp.ProductHighlights && <ProductHighlights />}
      {comp.ExperienceCenter && <ExperienceCenter />}
      {comp.WeProvide && <WeProvide />}
      {comp.OurAchievements && <OurAchievements />}
      {comp.TopClients && <TopClients />}
      {comp.OurAdServices && <OurAdServices />}
      {comp.PopularBrands && <PopularBrands />}
      {comp.OurYoutube && <OurYoutube />}
    </>
  );
};

export default MainHome;
