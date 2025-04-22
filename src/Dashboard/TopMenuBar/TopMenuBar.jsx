import { Menu, X } from "lucide-react";

const TopMenuBar = ({ toggleMobileSidebar }) => {
  return (
    <>
      <div className="flex justify-between items-center px-4 py-3 bg-gray-800 shadow sticky top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <button onClick={toggleMobileSidebar} className="md:hidden">
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
    </>
  );
};

export default TopMenuBar;
