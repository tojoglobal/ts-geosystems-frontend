/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const UserProtectedRoute = ({ children }) => {
  const axiosPublicUrl = useAxiospublic();
  const [isUserAuth, setIsUserAuth] = useState(null);
  // console.log(isUserAuth);

  useEffect(() => {
    axiosPublicUrl
      .get("/api/user-verify-token")
      .then(() => setIsUserAuth(true))
      .catch(() => {
        setIsUserAuth(false);
      });
  }, []);

  if (isUserAuth === null) {
    return (
      <div className="flex justify-center h-[60vh] items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b6d7f]"></div>
      </div>
    );
  }

  return isUserAuth ? children : <Navigate to="/user/login" />;
};

export default UserProtectedRoute;
