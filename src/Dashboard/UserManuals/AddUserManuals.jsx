/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
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
  Users,
  Layers,
  Drum,
  MonitorCogIcon,
  PackageCheck,
  MessageSquareText,
  Repeat,
  LifeBuoy,
  BookUser,
  BookmarkCheck,
  Tags,
} from "lucide-react";
import SidebarProfileDropdown from "./SidebarProfileDropdown/SidebarProfileDropdown";
import logo from "/TS-WEB-LOGO.png";
import smallLogo from "/favicon.png";
import {
  MdArticle,
  MdCategory,
  MdLocalOffer,
  MdOutlineShoppingCart,
  MdPercent,
  MdWebStories,
} from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";

// Menu structure remains unchanged
const menuItems = [
  // ... [unchanged menuItems array]
  // Copy your menuItems array here as in your original code
  // For brevity, not shown in full
];

// Helper to determine if a route is active (for submenu highlighting)
const isSubActive = (location, submenu) =>
  submenu.some((sub) => location.pathname.startsWith(sub.to));

const Sidebar = ({
  collapsed,
  toggleSidebar,
  mobileOpen,
  toggleMobileSidebar,
}) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const scrollRef = useRef < HTMLDivElement > null;

  // Keep scroll position when navigating between routes
  useEffect(() => {
    if (scrollRef.current) {
      // On first mount, restore last scroll position
      const scrollY = sessionStorage.getItem("sidebar-scroll");
      if (scrollY) scrollRef.current.scrollTop = parseInt(scrollY, 10);
      // Save scroll position on unmount
      return () => {
        sessionStorage.setItem(
          "sidebar-scroll",
          String(scrollRef.current?.scrollTop || 0)
        );
      };
    }
  }, []);

  // Open submenu if its child is active
  useEffect(() => {
    const activeSubmenus = {};
    menuItems.forEach((item) => {
      if (item.submenu && isSubActive(location, item.submenu)) {
        activeSubmenus[item.label] = true;
      }
    });
    setOpenSubmenus((prev) => ({
      ...prev,
      ...activeSubmenus,
    }));
    // Don't scroll sidebar to top on route change
  }, [location.pathname]);

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      <div
        className={`bg-gray-900 flex flex-col justify-between fixed md:relative z-[60] transition-all duration-300
          ${collapsed ? "w-20 pt-5 md:pt-0" : "w-64 md:w-72"}
          h-screen ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 shadow-2xl md:shadow-none
        `}
      >
        {/* Top Section */}
        <div
          className={`${
            collapsed
              ? "flex items-center justify-center"
              : "flex items-center justify-between"
          } p-4 border-b border-gray-800 shrink-0`}
        >
          <h2
            className={`text-xl font-bold transition-all ${
              collapsed ? "hidden md:block text-center" : ""
            }`}
          >
            {collapsed ? (
              <Link to="/">
                <img src={smallLogo} alt="Logo" className="h-fit" />
              </Link>
            ) : (
              <Link to="/">
                <img src={logo} alt="Logo" className="w-[90%]" />
              </Link>
            )}
          </h2>
          <button
            onClick={toggleSidebar}
            className={`${
              collapsed ? "hidden" : " hidden md:block"
            } text-white cursor-pointer`}
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

        {/* Scrollable Menu */}
        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 px-2 py-2 space-y-1
            custom-sidebar-scroll
          `}
        >
          {menuItems.map(({ label, to, icon, submenu }) => (
            <div key={label} className="relative group">
              {!submenu ? (
                <NavLink
                  key={label}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg text-[15px] font-medium transition
                    ${
                      isActive && location.pathname === to
                        ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow"
                        : "text-gray-200 hover:bg-teal-700/80 hover:text-white"
                    }`
                  }
                  style={{
                    boxShadow:
                      location.pathname === to
                        ? "0 1px 8px 0 rgba(32,180,179,0.12)"
                        : undefined,
                  }}
                >
                  <span className="ml-1">{icon}</span>
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubmenu(label)}
                    className={`w-full cursor-pointer flex items-center justify-between gap-2 px-2 md:px-4 py-2 rounded-lg text-[15px] text-gray-200 hover:bg-teal-700/80 hover:text-white transition`}
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
                  {/* Improved Submenu */}
                  {(openSubmenus[label] || collapsed) && (
                    <div
                      className={`${
                        collapsed
                          ? "absolute left-full top-1 ml-2 w-56 z-[1000] p-2 rounded-lg bg-gray-800 shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                          : "pl-6 mt-1"
                      } space-y-1`}
                    >
                      {submenu.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block text-[15px] px-4 py-1.5 rounded-md font-normal transition
                            ${
                              isActive || location.pathname.startsWith(item.to)
                                ? "bg-teal-600 text-white shadow"
                                : "text-gray-300 hover:bg-teal-500/80 hover:text-white"
                            }`
                          }
                          style={{
                            marginLeft: collapsed ? 0 : 0,
                          }}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full top-1 z-50 ml-2 w-44 p-2 rounded bg-gray-800 text-sm text-white shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
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

        {/* Bottom Profile Section */}
        <div className="shrink-0">
          {!collapsed && <SidebarProfileDropdown collapsed={collapsed} />}
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Custom CSS for improved submenu, scrollbar, etc. */}
      <style>{`
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 6px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: #111827;
        }
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 7px;
        }
        .custom-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #374151 #111827;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
