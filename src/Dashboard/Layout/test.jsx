import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Mail,
  Calendar,
  MessageCircle,
  File,
  FileText,
  Users,
  Layers,
} from "lucide-react";
import SidebarProfileDropdown from "../Sidebar/SidebarProfileDropdown/SidebarProfileDropdown";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { to: "/dashboard/email", label: "Email", icon: <Mail size={20} /> },
  {
    to: "/dashboard/calendar",
    label: "Calendar",
    icon: <Calendar size={20} />,
  },
  { to: "/dashboard/chat", label: "Chat", icon: <MessageCircle size={20} /> },
  { to: "/dashboard/files", label: "File Manager", icon: <File size={20} /> },
  { to: "/dashboard/invoice", label: "Invoice", icon: <FileText size={20} /> },
  { to: "/dashboard/users", label: "Users", icon: <Users size={20} /> },
  { to: "/dashboard/layouts", label: "Layouts", icon: <Layers size={20} /> },
  { to: "/dashboard/chat", label: "Chat", icon: <MessageCircle size={20} /> },
  { to: "/dashboard/files", label: "File Manager", icon: <File size={20} /> },
  { to: "/dashboard/invoice", label: "Invoice", icon: <FileText size={20} /> },
  { to: "/dashboard/users", label: "Users", icon: <Users size={20} /> },
  { to: "/dashboard/layouts", label: "Layouts", icon: <Layers size={20} /> },
  { to: "/dashboard/chat", label: "Chat", icon: <MessageCircle size={20} /> },
  { to: "/dashboard/files", label: "File Manager", icon: <File size={20} /> },
  { to: "/dashboard/invoice", label: "Invoice", icon: <FileText size={20} /> },
  { to: "/dashboard/users", label: "Users", icon: <Users size={20} /> },
  { to: "/dashboard/layouts", label: "Layouts", icon: <Layers size={20} /> },
];

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  return (
    <>
      <div className="min-h-screen flex bg-gray-900 text-white">
        {/* side bar  */}
        <aside className="bg-gray-800 flex flex-col h-screen">
          {/* Sidebar */}
          <div
            className={`h-full bg-gray-800 overflow-hidden transition-transform duration-300 z-40 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:relative w-64 ${
              collapsed ? "md:w-20" : "md:w-64"
            }`}
          >
            {/* Logo + Collapse Button */}
            <div className=" flex items-center justify-between px-4 py-4 border-b border-gray-700">
              <h2
                className={`text-xl font-bold transition-all ${
                  collapsed && "hidden md:block text-center"
                }`}
              >
                {collapsed ? "T" : "Tocly"}
              </h2>
              <button onClick={toggleSidebar} className="hidden md:block">
                <Menu size={20} />
              </button>
              <button onClick={toggleMobileSidebar} className="md:hidden">
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-4 px-2 space-y-2 overflow-y-auto">
              {menuItems.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "text-gray-300 hover:bg-teal-700 hover:text-white"
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="ml-2">{icon}</span>
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </nav>
            {/* side bar  */}
            <SidebarProfileDropdown />
          </div>

          {/* Backdrop for mobile */}
          {mobileOpen && (
            <div
              onClick={toggleMobileSidebar}
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            />
          )}
        </aside>

        <aside className="flex-1 flex flex-col h-screen">
          {/* Top Bar */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-800 shadow sticky top-0 w-full z-50">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="md:hidden">
                <Menu size={24} />
              </button>
              <span className="text-xl font-bold text-white tracking-wide">
                Dashboard
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-700 text-sm text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4">
              <Outlet />
            </div>
            <footer className="bg-gray-800 text-center text-sm py-3 text-gray-400">
              &copy; {new Date().getFullYear()} Tocly. All rights reserved.
            </footer>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Layout;
