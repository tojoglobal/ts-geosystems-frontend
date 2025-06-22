import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Settings,
  Lock,
  LogOut,
  Home,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAxiospublic } from "../../../Hooks/useAxiospublic";
import ScreenLockOverlay from "./ScreenLockOverlay";
import { AppContext } from "../../../context/AppContext";
import { useAppContext } from "../../../context/useAppContext";

const handleLogout = async (navigate) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_OPEN_APIURL}/api/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("admin");
    navigate("/admin/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const SidebarProfileDropdown = () => {
  const { lockScreen } = useAppContext();
  const axiosPublicUrl = useAxiospublic();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);

  const onLogoutClick = () => {
    handleLogout(navigate);
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiosPublicUrl.get("/api/admin/profile");
        const data = response.data.data;
        setDbUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className=" relative p-3">
      {/* Profile Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full cursor-pointer flex items-center justify-between gap-2 bg-white/10 p-2 rounded-lg text-white hover:bg-white/20 transition"
      >
        <div className="flex items-center gap-2">
          <img
            src={
              dbUser?.photo
                ? dbUser.photo.startsWith("http")
                  ? dbUser.photo
                  : `${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                      dbUser.photo
                    }`
                : "https://randomuser.me/api/portraits/women/44.jpg"
            }
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-sm">
            {dbUser?.name || "swapnil ahmed"}
          </span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {/* Dropdown Menu */}
      {open && (
        <div className="absolute bottom-14 left-3 w-56 md:w-60 bg-white shadow-lg rounded-lg z-50">
          <div className="p-2">
            <Link to="/dashboard/viewprofile">
              <DropdownItem icon={<User size={16} />} label="Profile" />
            </Link>
            <Link to="/">
              <DropdownItem icon={<Home size={16} />} label="Home" />
            </Link>
            <DropdownItem
              icon={<LogOut size={16} />}
              label="Logout"
              onClick={onLogoutClick}
            />
          </div>
          <div className="border-t" />
          <div className="p-2">
            <DropdownItem
              icon={<CreditCard size={16} />}
              label={
                <span>
                  Balance: <span className="font-semibold">$5971.67</span>
                </span>
              }
            />
            <DropdownItem
              icon={<Lock size={16} />}
              label="Lock screen"
              onClick={() => {
                lockScreen();
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, label, onClick }) => (
  <div
    className="flex items-center gap-3 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded cursor-pointer transition"
    onClick={onClick}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default SidebarProfileDropdown;
