import { useSelector } from "react-redux";
import Logout from "../Pages/Auth/Logout";

const TopMenu = () => {
  const { isAuth, user } = useSelector((state) => state.authUser);
  console.log(isAuth, user);

  return (
    <div className="border-b border-slightly-dark">
      <div className="max-w-[1370px] mx-auto py-1 align-middle">
        <a
          href="tel:+443330232200"
          className="text-left text-burgundy text-[16px]"
        >
          +44 (0)333 023 2200
        </a>
      </div>
      {isAuth && (
        // <p>
        //   Welcome, {user?.email} ({user?.role})
        // </p>
        <Logout />
      )}
    </div>
  );
};

export default TopMenu;
