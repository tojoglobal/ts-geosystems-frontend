import { useDispatch, useSelector } from "react-redux";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { logout } from "../../features/UserAuth/authSlice";
import { useNavigate } from "react-router-dom";
import useToastSwal from "../../Hooks/useToastSwal";

const Logout = () => {
  const { user } = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const axiosPublic = useAxiospublic();
  const navigate = useNavigate();
  const showToast = useToastSwal();

  const handleLogout = async () => {
    try {
      await axiosPublic.post("/api/user-logout", { email: user.email });
      dispatch(logout());
      showToast(
        "success",
        "Logged out successfully!",
        "",
        { timer: 1500 }
      );
      navigate("/user/login");
    } catch (error) {
      showToast("error", "Logout failed.", error?.message || "Unknown error.", {
        timer: 2000,
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
