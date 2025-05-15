import { useDispatch, useSelector } from "react-redux";

import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { logout } from "../../features/UserAuth/authSlice";
import Swal from "sweetalert2";

const Logout = () => {
  const { user } = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const axiosPublic = useAxiospublic();

  const handleLogout = async () => {
    try {
      await axiosPublic.post("/api/user-logout", { email: user.email });
      dispatch(logout());
      Swal.fire({
        icon: "success",
        title: "Logged out successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Logout failed. ${error?.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <button onClick={handleLogout} className="cursor-pointer text-burgundy">
      Logout
    </button>
  );
};

export default Logout;
