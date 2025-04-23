import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  MessageSquare,
  HelpCircle,
  CreditCard,
  Settings,
  Lock,
} from "lucide-react";

const SidebarProfileDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className=" relative p-3">
      {/* Profile Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-white/10 p-2 rounded-lg text-white hover:bg-white/20 transition"
      >
        <div className="flex items-center gap-2">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="avatar"
            className={`w-8 h-8 rounded-full`}
          />
          <span className="font-semibold text-sm">Steven Deese</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute bottom-14 left-3 w-64 bg-white shadow-lg rounded-lg z-50">
          <div className="p-2">
            <DropdownItem icon={<User size={16} />} label="Profile" />
            <DropdownItem icon={<MessageSquare size={16} />} label="Messages" />
            <DropdownItem icon={<HelpCircle size={16} />} label="Help" />
          </div>
          <div className="border-t" />
          <div className="p-2">
            <DropdownItem
              icon={<CreditCard size={16} />}
              label={
                <span>
                  Balance: <span className="font-semibold">$5971.67</span>
                </span>
              }
            />
            <DropdownItem
              icon={<Settings size={16} />}
              label={
                <span className="flex items-center gap-1">
                  Settings
                  <span className="text-xs bg-blue-500 text-white px-1 rounded">
                    New
                  </span>
                </span>
              }
            />
            <DropdownItem icon={<Lock size={16} />} label="Lock screen" />
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded cursor-pointer transition">
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default SidebarProfileDropdown;
