import Banner from "./Banner";
import ExperienceCenter from "./ExperienceCenter";
import OurAchievements from "./OurAchievements";
import OurAdServices from "./OurAdServices";
import OurYoutube from "./OurYoutube";
import PopularBrands from "./PopularBrands";
import TopClients from "./TopClients";
import TotalStation from "./TotalStation";
import WeProvide from "./WeProvide";
const MainHome = () => {
    return (
        <>
            <Banner />
            <ExperienceCenter />
            <TotalStation />
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