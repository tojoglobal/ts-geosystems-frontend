import Banner from "./Banner";
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
            <TotalStation />
            <WeProvide />
            <TopClients />
            <OurAdServices />
            <PopularBrands />
            <OurYoutube />
        </>
    );
};

export default MainHome;