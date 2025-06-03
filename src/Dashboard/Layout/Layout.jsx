import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import TopMenuBar from "../TopMenuBar/TopMenuBar";
import ScreenLockOverlay from "../Sidebar/SidebarProfileDropdown/ScreenLockOverlay";
import { useAppContext } from "../../context/useAppContext";

const Layout = () => {
  const { locked, unlockScreen } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      const parsedData = JSON.parse(adminData);
      setDbUser(parsedData);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white dashboard-dark">
      {/* Global Screen Lock Overlay */}
      <ScreenLockOverlay
        open={locked}
        onUnlock={unlockScreen}
        userEmail={dbUser?.adminEmail}
      />
      {/* Sidebar - Fixed position on mobile, sticky on desktop */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen overflow-y-auto bg-gray-800 flex flex-col ${
          collapsed ? "md:w-16" : "md:w-64"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileOpen}
          toggleMobileSidebar={toggleMobileSidebar}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Menu Bar - Sticky */}
        <header className="sticky top-0 z-40 bg-gray-800">
          <TopMenuBar
            toggleMobileSidebar={toggleMobileSidebar}
            collapsed={collapsed}
            toggleSidebar={toggleSidebar}
          />
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 md:p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer - Sticky at bottom */}
        <footer className="sticky bottom-0 bg-gray-800 text-center text-sm py-3 text-gray-400">
          <div className="px-4">
            &copy; {new Date().getFullYear()} Tocly. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
