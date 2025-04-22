import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Menu */}
      <div className="bg-gray-800 text-white flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            {openSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-semibold text-lg">Admin Dashboard</span>
        </div>
        <div className="hidden md:block">Welcome, Admin</div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-gray-900 text-white w-64 space-y-4 p-4 transition-transform duration-300 ease-in-out
          ${openSidebar ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:block fixed md:relative h-full top-0 z-40`}
        >
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-teal-300 font-bold"
                  : "text-white hover:text-teal-300"
              }
            >
              Dashboard Home
            </NavLink>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive
                  ? "text-teal-300 font-bold"
                  : "text-white hover:text-teal-300"
              }
            >
              Users
            </NavLink>
            {/* Add more links */}
          </nav>
        </div>

        {/* Page Content */}
        <main className="flex-1 bg-gray-100 p-4 ml-0 md:ml-64 mt-16">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-3 mt-auto">
        &copy; {new Date().getFullYear()} Tocly. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardLayout;
