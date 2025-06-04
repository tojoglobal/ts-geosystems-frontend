import { useEffect, useState } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Drum,
  Monitor,
  BadgeCheck,
  MessageSquare,
  Repeat,
  LifeBuoy,
  BookOpen,
  Bookmark,
  Tag,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageCircle,
  Settings,
} from "lucide-react";
import {
  MdArticle,
  MdCategory,
  MdLocalOffer,
  MdPercent,
  MdWebStories,
} from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import logo from "/TS-WEB-LOGO.png";
import smallLogo from "/favicon.png";
import SidebarProfileDropdown from "./SidebarProfileDropdown/SidebarProfileDropdown";
import { FaTelegram } from "react-icons/fa6";

const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    to: "/dashboard",
  },
  {
    label: "Orders",
    icon: <Package size={20} />,
    to: "/dashboard/orders",
  },
  {
    label: "Client Messages",
    icon: <MessageSquare size={20} />,
    to: "/dashboard/client-messages",
  },
  {
    label: "Trade In",
    icon: <Repeat size={20} />,
    to: "/dashboard/trade-in",
  },
  {
    label: "Support",
    icon: <LifeBuoy size={20} />,
    to: "/dashboard/support",
  },
  {
    label: "Credit Account",
    icon: <LifeBuoy size={20} />,
    to: "/dashboard/credit-account",
  },
  {
    label: "Service Inquiries",
    icon: <BsQuestionCircle size={20} />,
    to: "/dashboard/service-inquiries",
  },
  {
    label: "All Products",
    icon: <ShoppingCart size={20} />,
    to: "/dashboard/product",
  },
  {
    label: "Product Question",
    icon: <ShoppingCart size={20} />,
    to: "/dashboard/product/question",
  },
  {
    label: "Add Software",
    icon: <Monitor size={20} />,
    to: "/dashboard/add-software",
  },
  {
    label: "Add UserManuals",
    icon: <BookOpen size={20} />,
    to: "/dashboard/add-userManuals",
  },
  {
    label: "Add QuickGuides",
    icon: <Bookmark size={20} />,
    to: "/dashboard/add-quickGuides",
  },
  {
    label: "Add Categorys",
    icon: <MdCategory size={20} />,
    to: "/dashboard/add-categorys",
  },
  {
    label: "Taxes",
    icon: <MdPercent size={20} />,
    to: "/dashboard/taxesmanager",
  },
  {
    label: "Promo Code",
    icon: <MdLocalOffer size={20} />,
    to: "/dashboard/promocodemanager",
  },
  {
    label: "Subscriber",
    icon: <FaTelegram size={20} />,
    to: "/dashboard/subscriber",
  },
  {
    label: "Add Brands",
    icon: <Drum size={20} />,
    to: "/dashboard/add-brands",
  },
  {
    label: "Blog Controll",
    icon: <MdArticle size={20} />,
    submenu: [
      { label: "TS Blog", to: "/dashboard/ts-blog" },
      { label: "Author", to: "/dashboard/author" },
      { label: "Blog Type", to: "/dashboard/blog-type" },
      { label: "Blog Tags", to: "/dashboard/blog-tags" },
    ],
  },
  {
    label: "Website Controll",
    icon: <MdWebStories size={20} />,
    submenu: [
      { label: "Home Page", to: "/dashboard/home-page" },
      { label: "Help Desk", to: "/dashboard/help-desk" },
      { label: "Used Equipment", to: "/dashboard/used-equipment" },
      { label: "Hire", to: "/dashboard/hire" },
      { label: "Service", to: "/dashboard/service" },
      { label: "Trade In", to: "/dashboard/tradein" },
      { label: "About Us", to: "/dashboard/about-us" },
      { label: "Contact Us", to: "/dashboard/contact-us" },
      { label: "Support", to: "/dashboard/update/support" },
      { label: "Certificate Tracking", to: "/dashboard/cc" },
      { label: "Footer", to: "/dashboard/footer" },
    ],
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
    icon: <FileText size={20} />,
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
    label: "Settings",
    icon: <Settings size={16} />,
    to: "/dashboard/settings",
  },
];

const Sidebar = ({
  collapsed,
  toggleSidebar,
  mobileOpen,
  toggleMobileSidebar,
}) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(() => {
    const activeSubmenus = {};
    menuItems.forEach((item) => {
      if (
        item.submenu &&
        item.submenu.some((sub) => location.pathname.startsWith(sub.to))
      ) {
        activeSubmenus[item.label] = true;
      }
    });
    setOpenSubmenus(activeSubmenus);
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
        className={`bg-gray-800 flex flex-col justify-between fixed md:relative z-[60] transition-all duration-300 ${
          collapsed ? "w-20 pt-5 md:pt-0" : "w-60 md:w-64"
        } h-screen ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top Fixed Section */}
        <div
          className={`${
            collapsed
              ? "flex items-center justify-center"
              : "flex items-center justify-between"
          } p-4 border-b border-gray-700 shrink-0`}
        >
          <h2
            className={`text-xl font-bold transition-all ${
              collapsed ? "hidden md:block text-center" : ""
            }`}
          >
            {collapsed ? (
              <Link to="/dashboard">
                <img src={smallLogo} alt="Logo" className="h-fit" />
              </Link>
            ) : (
              <Link to="/dashboard">
                <img src={logo} alt="Logo" className="w-[90%]" />
              </Link>
            )}
          </h2>
          <button
            onClick={toggleSidebar}
            className={`${
              collapsed ? "hidden" : " hidden md:block"
            }  text-white cursor-pointer`}
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
          className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-2 py-2 space-y-1`}
        >
          {menuItems.map(({ label, to, icon, submenu }) => (
            <div key={label} className="relative group">
              {!submenu ? (
                <NavLink
                  key={label}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-1 md:px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive && location.pathname === to
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
                    className="w-full cursor-pointer flex items-center justify-between gap-2 px-1 md:px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-teal-700 hover:text-white"
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
        <div className="shrink-0">
          {!collapsed && <SidebarProfileDropdown collapsed={collapsed} />}
        </div>
      </div>
      {/* Invisible overlay for handling outside clicks */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
