import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const PublicOnlyRoute = ({ children }) => {
  const axiosPublicUrl = useAxiospublic();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userVerified, setUserVerified] = useState(false);

  useEffect(() => {
    axiosPublicUrl
      .get("/api/user-verify-token")
      .then(() => setUserVerified(true))
      .catch(() => setUserVerified(false))
      .finally(() => setCheckingAuth(false));
  }, [axiosPublicUrl]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b6d7f]"></div>
      </div>
    );
  }

  return userVerified ? (
    <Navigate to="/user/account/orders" replace />
  ) : (
    children
  );
};

export default PublicOnlyRoute;
