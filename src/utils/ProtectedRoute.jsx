import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAxiospublic } from "./../Hooks/useAxiospublic";

const ProtectedRoute = ({ children }) => {
  const axiosPublicUrl = useAxiospublic();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axiosPublicUrl
      .get("/api/dashboard")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);
  console.log(isAuth);

  if (isAuth === null) return <p>Loading...</p>;
  return isAuth ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
