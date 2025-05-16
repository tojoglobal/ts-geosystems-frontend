import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.authUser);

  // If authenticated, redirect to user account
  return isAuth ? <Navigate to="/user/account/orders" replace /> : children;
};

export default PublicOnlyRoute;
