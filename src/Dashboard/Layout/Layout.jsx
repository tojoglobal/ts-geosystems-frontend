import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import TopMenuBar from "../TopMenuBar/TopMenuBar";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <div className="min-h-screen flex bg-gray-900 text-white">
        {/* side bar  */}
        <aside className="bg-gray-800 flex flex-col h-screen">
          <Sidebar
            collapsed={collapsed}
            toggleSidebar={toggleSidebar}
            mobileOpen={mobileOpen}
            toggleMobileSidebar={toggleMobileSidebar}
          />
        </aside>

        {/*rigth side topMenu - outlet - footer part */}
        <aside className="flex-1 flex flex-col h-screen">
          {/* Top Bar */}
          <TopMenuBar toggleMobileSidebar={toggleMobileSidebar} />

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
