import { Link } from "react-router-dom";
const HeaderBottom = () => {
  return (
    <div className="px-2 md:px-0 bg-dark-slate pt-[10px] pb-[6px] flex items-center justify-center">
      <p className="text-sm text-white italic font-bold">
        We Offer Very Competitive Hire Rates On The Leica RTC360 3D Laser
        Scanner -{" "}
        <Link to="/hire" className="underline">
          {" "}
          Contact Us Today...
        </Link>
      </p>
    </div>
  );
};

export default HeaderBottom;
