import TopMenu from "./TopMenu";
import HeaderContainer from "./HeaderContainer";
import MainNavContainer from "./MainNavContainer";
import MobileNavbar from "./MobileNavbar";
const MainNavbars = () => {
  return (
    <>
      {/* Desktop & tablet only */}
      <div className="hidden lg:block">
        <TopMenu />
        <HeaderContainer />
        <MainNavContainer />
      </div>
      {/* Mobile only */}
      <div className="lg:hidden">
        <MobileNavbar />
      </div>
    </>
  );
};

export default MainNavbars;
