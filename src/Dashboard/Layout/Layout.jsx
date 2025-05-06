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
      <div className="md:min-h-screen bg-gray-900 flex text-white">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 flex flex-col ${
            collapsed ? "md:w-16" : "md:w-64"
          } h-screen sticky top-0`}
        >
          <Sidebar
            collapsed={collapsed}
            toggleSidebar={toggleSidebar}
            mobileOpen={mobileOpen}
            toggleMobileSidebar={toggleMobileSidebar}
          />
        </aside>
        {/* Right side: Top Menu Bar and Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Menu Bar */}
          <header className="sticky top-0 z-10 bg-gray-800">
            <TopMenuBar
              toggleMobileSidebar={toggleMobileSidebar}
              collapsed={collapsed}
              toggleSidebar={toggleSidebar}
            />
          </header>
          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4">
              <Outlet />
            </div>
          </main>
          {/* Footer */}
          <footer className="bg-gray-800 text-center text-sm py-3 text-gray-400">
            &copy; {new Date().getFullYear()} Tocly. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
};

export default Layout;

// <div className="md:min-h-screen bg-gray-900 flex  text-white">
//       {/* side bar  */}
//       <aside
//         className={`bg-gray-800  flex flex-col ${
//           collapsed ? "md:min-h-[230vh]" : " md:h-screen"
//         }`}
//       >
//         <Sidebar
//           collapsed={collapsed}
//           toggleSidebar={toggleSidebar}
//           mobileOpen={mobileOpen}
//           toggleMobileSidebar={toggleMobileSidebar}
//         />
//       </aside>

//       {/*rigth side topMenu - outlet - footer part */}
//       <aside
//         className={`flex-1 flex flex-col ${
//           collapsed ? "h-full" : "md:h-screen"
//         }`}
//       >
//         {/* Top Bar */}
//         <TopMenuBar
//           toggleMobileSidebar={toggleMobileSidebar}
//           collapsed={collapsed}
//           toggleSidebar={toggleSidebar}
//         />

//         {/* Scrollable Content Area */}
//         <div
//           className={`flex-1 flex flex-col ${
//             collapsed ? "" : "overflow-y-auto"
//           }`}
//         >
//           <div className="px-4 pb-4 flex-1">
//             <Outlet />
//           </div>
//           <footer className="bg-gray-800 text-center text-sm py-3 text-gray-400">
//             &copy; {new Date().getFullYear()} Tocly. All rights reserved.
//           </footer>
//         </div>
//       </aside>
//     </div>
