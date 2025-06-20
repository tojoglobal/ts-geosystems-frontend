import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className=" bg-gray-800 rounded-xl shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Menu Control</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-4">
          {menus.map((menu) => (
            <li
              key={menu.menu_name}
              className="flex items-center justify-between"
            >
              <span className="text-lg">
                {MENU_LABELS[menu.menu_name] || menu.menu_name}
              </span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!!menu.enabled}
                  onChange={() => toggleMenu(menu.menu_name, !!menu.enabled)}
                  disabled={saving}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{menu.enabled ? "Enabled" : "Disabled"}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuControll;
