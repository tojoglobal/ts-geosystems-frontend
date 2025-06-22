import { useEffect, useState } from "react";
import axios from "axios";
import { Switch } from "@headlessui/react";
import { CheckCircle, XCircle } from "lucide-react";

const API_URL = `${import.meta.env.VITE_OPEN_APIURL}/api/menu-controll`;

const MENU_LABELS = {
  used_equipment: "Used Equipment",
  clearance: "Clearance",
  hire: "Hire",
};

const MenuControll = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((res) => setMenus(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleMenu = (menu_name, current) => {
    setSaving(true);
    axios
      .put(API_URL, { menu_name, enabled: !current })
      .then(() => {
        setMenus((menus) =>
          menus.map((m) =>
            m.menu_name === menu_name ? { ...m, enabled: !current } : m
          )
        );
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-full sm:max-w-lg mx-auto mt-4 sm:mt-8 tw-animate-fade-in-up">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-white flex items-center gap-2">
        <span role="img" aria-label="menu">
          📋
        </span>{" "}
        Menu Control
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-24 sm:h-32 text-base sm:text-lg text-white animate-pulse">
          Loading...
        </div>
      ) : (
        <ul className="space-y-4 sm:space-y-6">
          {menus.map((menu) => (
            <li
              key={menu.menu_name}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800/80 rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow hover:shadow-md transition-shadow group"
            >
              <span className="text-base sm:text-lg font-semibold text-white flex items-center gap-2 mb-2 sm:mb-0">
                {MENU_LABELS[menu.menu_name] || menu.menu_name}
                {menu.enabled ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 opacity-80 group-hover:scale-110 transition-transform" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 opacity-70 group-hover:scale-110 transition-transform" />
                )}
              </span>
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!menu.enabled}
                  onChange={() => toggleMenu(menu.menu_name, !!menu.enabled)}
                  disabled={saving}
                  className={`${
                    menu.enabled ? "bg-emerald-500" : "bg-gray-500"
                  } 
                    relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                >
                  <span className="sr-only">
                    Toggle {MENU_LABELS[menu.menu_name] || menu.menu_name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`${
                      menu.enabled ? "translate-x-6" : "translate-x-0"
                    }
                    pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
                <span
                  className={`text-sm sm:text-base font-medium select-none ${
                    menu.enabled ? "text-emerald-300" : "text-gray-400"
                  }`}
                >
                  {menu.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuControll;
