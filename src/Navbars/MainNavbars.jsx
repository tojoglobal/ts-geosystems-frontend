import TopMenu from "./TopMenu";
import HeaderContainer from "./HeaderContainer";
import MainNavContainer from "./MainNavContainer";
import MobileNavbar from "./MobileNavbar";
const MainNavbars = () => {
  return (
    <>
      {/* Desktop & tablet only */}
      <div className="hidden md:block">
        <TopMenu />
        <HeaderContainer />
        <MainNavContainer />
      </div>
      {/* Mobile only */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </>
  );
};

export default MainNavbars;
