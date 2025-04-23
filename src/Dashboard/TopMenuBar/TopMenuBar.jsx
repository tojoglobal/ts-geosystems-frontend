import { Menu, Bell, Search, Settings, Maximize2 } from "lucide-react";

const TopMenuBar = ({ toggleMobileSidebar, collapsed, toggleSidebar }) => {
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-800 shadow sticky top-0 w-full z-50">
      {/* Left Side: Menu Icon and Dashboard Text */}
      <div className="flex items-center gap-3">
        <button onClick={toggleMobileSidebar} className="md:hidden">
          <Menu size={24} />
        </button>
        {collapsed ? (
          <button onClick={toggleSidebar} className="hidden md:block">
            <Menu size={24} />
          </button>
        ) : null}
        <span className="text-xl font-bold text-white tracking-wide">
          Dashboard
        </span>
      </div>

      {/* Right Side: Search Bar, Notifications, Fullscreen, Settings */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-sm text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search
              size={16}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Notification Icon */}
        <button className="relative text-gray-300 hover:text-white">
          <Bell size={20} />
          <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Fullscreen Icon */}
        <button
          onClick={handleFullscreen}
          className="text-gray-300 hover:text-white"
        >
          <Maximize2 size={20} />
        </button>

        {/* Settings Icon */}
        <button className="text-gray-300 hover:text-white">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopMenuBar;
