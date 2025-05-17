import { useAxiospublic } from "./useAxiospublic";
import { useSelector } from "react-redux";

export const useTrackProductView = () => {
  const axiosPublicUrl = useAxiospublic();
  const { isAuth, user } = useSelector((state) => state.authUser);

  const trackProductView = async (productId) => {
    if (!isAuth) return null;
    if (isAuth && user?.email) {
      await axiosPublicUrl
        .post("/api/views/product", {
          productId,
          userEmail: user.email,
        })
        .catch((error) => {
          console.error("Error tracking product view:", error);
        });
    }
  };

  return { trackProductView };
};
