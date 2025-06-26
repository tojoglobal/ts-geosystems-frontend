import { useSelector } from "react-redux";
import Logout from "../Pages/Auth/Logout";
import useDataQuery from "../utils/useDataQuery";

const TopMenu = () => {
  const { isAuth } = useSelector((state) => state.authUser);
  // Fetch dynamic helpdesk info
  const { data: info = {} } = useDataQuery(
    ["helpdeskInfo"],
    "/api/helpdesk-info"
  );

  const phoneNumber = info?.helpline_number;
  const phoneHref = "tel:" + phoneNumber?.replace(/[^\d+]/g, "");

  return (
    <div className="border-b border-slightly-dark">
      <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto py-1 flex items-center justify-between">
        <div className="align-middle">
          <a href={phoneHref} className="text-left text-burgundy text-[16px]">
            {phoneNumber}
          </a>
        </div>
        <div>
          {isAuth && (
            // <p>
            //   Welcome, {user?.email} ({user?.role})
            // </p>
            <Logout />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
