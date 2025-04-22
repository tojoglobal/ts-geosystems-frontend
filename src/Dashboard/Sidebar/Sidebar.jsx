import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const ResponsiveNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-800 shadow-md fixed w-full z-50">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar} className="md:hidden">
            <Menu size={24} />
          </button>
          <span className="text-lg font-semibold">Tocly</span>
        </div>
        <div className="hidden md:flex gap-4">
          {/* Add top right icons / items here */}
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-sm px-3 py-1 rounded focus:outline-none"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-teal-700 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:block`}
      >
        <div className="flex items-center justify-between p-4 border-b border-teal-600">
          <div className="text-lg font-semibold">Team Reporting</div>
          <button className="md:hidden" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li className="hover:text-teal-200">Dashboard</li>
            <li className="hover:text-teal-200">Email</li>
            <li className="hover:text-teal-200">Calendar</li>
            <li className="hover:text-teal-200">Chat</li>
            <li className="hover:text-teal-200">File Manager</li>
            <li className="hover:text-teal-200">Invoice</li>
            <li className="hover:text-teal-200">Users</li>
            <li className="hover:text-teal-200">Layouts</li>
          </ul>
        </nav>
      </div>

      {/* Overlay when sidebar open */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        />
      )}

      {/* Main Content Placeholder */}
      <main className="pt-16 p-4 md:ml-64">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-300">Your content goes here...</p>
      </main>
    </div>
  );
};

export default ResponsiveNavbar;
