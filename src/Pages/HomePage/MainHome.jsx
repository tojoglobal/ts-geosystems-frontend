import ExperienceCenter from "./ExperienceCenter";
import OurAchievements from "./OurAchievements";
import OurAdServices from "./OurAdServices";
import OurYoutube from "./OurYoutube";
import PopularBrands from "./PopularBrands";
import ProductHighlights from "./ProductHighlights";
import TopClients from "./TopClients";
// import TotalStation from "./TotalStation";
import WeProvide from "./WeProvide";
import HomeBanner from "./HomeBanner/HomeBanner";
const MainHome = () => {
  return (
    <>
      <HomeBanner />
      <ProductHighlights />
      <ExperienceCenter />
      {/* <TotalStation /> */}
      <WeProvide />
      <OurAchievements />
      <TopClients />
      <OurAdServices />
      <PopularBrands />
      <OurYoutube />
    </>
  );
};

export default MainHome;
