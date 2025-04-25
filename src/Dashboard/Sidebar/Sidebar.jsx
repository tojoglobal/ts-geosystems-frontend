import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  File,
  FileText,
  Users,
  Layers,
} from "lucide-react";
import SidebarProfileDropdown from "./SidebarProfileDropdown/SidebarProfileDropdown";
import logo from "/public/TS-WEB-LOGO.png";
import smallLogo from "/public/favicon.png";
import { MdCategory, MdOutlineShoppingCart } from "react-icons/md";
const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    to: "/dashboard",
  },
  {
    label: "Product",
    icon: <MdOutlineShoppingCart size={20} />,
    to: "/dashboard/add-product",
  },
  {
    label: "Add categorys",
    icon: <MdCategory size={20} />,
    to: "/dashboard/add-categorys",
  },
  {
    label: "Email",
    icon: <Mail size={20} />,
    submenu: [
      { label: "Inbox", to: "/dashboard/email/inbox" },
      { label: "Sent", to: "/dashboard/email/sent" },
    ],
  },
  {
    label: "Calendar",
    icon: <Calendar size={20} />,
    to: "/dashboard/calendar",
  },
  {
    label: "Chat",
    icon: <MessageCircle size={20} />,
    to: "/dashboard/chat",
  },
  {
    label: "Files",
    icon: <File size={20} />,
    submenu: [
      { label: "Documents", to: "/dashboard/files/documents" },
      { label: "Images", to: "/dashboard/files/images" },
    ],
  },
  {
    label: "Users",
    icon: <Users size={20} />,
    to: "/dashboard/users",
  },
  {
    label: "Layouts",
    icon: <Layers size={20} />,
    to: "/dashboard/layouts",
  },
  {
    label: "Files",
    icon: <File size={20} />,
    submenu: [
      { label: "Documents", to: "/dashboard/files/documents" },
      { label: "Images", to: "/dashboard/files/images" },
    ],
  },
];

const Sidebar = ({
  collapsed,
  toggleSidebar,
  mobileOpen,
  toggleMobileSidebar,
}) => {
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      <div
        className={`bg-gray-800 flex flex-col justify-between fixed md:relative z-50 transition-all duration-300 ${
          collapsed ? "w-20 pt-5 md:pt-0 h-full" : "w-64 h-[200vh] md:h-screen"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top Fixed Section */}
        <div
          className={`${
            collapsed
              ? "flex items-center justify-center "
              : " flex items-center justify-between"
          } px-4 py-4 border-b border-gray-700`}
        >
          <h2
            className={`text-xl font-bold transition-all ${
              collapsed ? "hidden md:block text-center" : ""
            }`}
          >
            {collapsed ? (
              <img src={smallLogo} alt="Logo" className="h-fit" />
            ) : (
              <img src={logo} alt="Logo" className="w-[90%]" />
            )}
          </h2>
          <button
            onClick={toggleSidebar}
            className={`${
              collapsed ? "hidden" : " hidden md:block"
            }  text-white `}
          >
            <Menu size={20} />
          </button>
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Menu Section */}
        <div
          className={`flex-1 ${
            collapsed ? "" : "overflow-y-auto overflow-x-hidden"
          }  px-2 py-2 space-y-1`}
        >
          {menuItems.map(({ label, to, icon, submenu }) => (
            <div key={label} className="relative group">
              {!submenu ? (
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "text-gray-300 hover:bg-teal-700 hover:text-white"
                    }`
                  }
                >
                  <span className="ml-1">{icon}</span>
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubmenu(label)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-teal-700 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className="ml-1">{icon}</span>
                      {!collapsed && <span>{label}</span>}
                    </div>
                    {!collapsed &&
                      (openSubmenus[label] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </button>
                  {/* Submenu */}
                  {(openSubmenus[label] || collapsed) && (
                    <div
                      className={`${
                        collapsed
                          ? "absolute left-full top-1 ml-2 w-48 z-[1000] p-2 rounded bg-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          : "pl-10 mt-1"
                      } space-y-1`}
                    >
                      {submenu.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block text-sm px-2 py-1 rounded text-gray-300 hover:bg-teal-600 hover:text-white ${
                              isActive ? "bg-teal-600 text-white" : ""
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full top-1 z-50 ml-2 w-40 p-2 rounded bg-gray-700 text-sm text-white shadow-lg opacity-0 group-hover:opacity-100 transition">
                  {label}
                  {submenu && (
                    <div className="mt-2 space-y-1">
                      {submenu.map((sub) => (
                        <div
                          key={sub.to}
                          className="text-xs text-gray-300 hover:text-white"
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Profile Section Fixed */}
        {!collapsed && <SidebarProfileDropdown collapsed={collapsed} />}
      </div>
    </>
  );
};

export default Sidebar;
