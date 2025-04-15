import React, { useState } from "react";

const categories = {
  "shop All": ["shop A", "shop B"],
  "Laser Scanners": ["Scanner A", "Scanner B"],
  "Total Stations": ["Station A", "Station B"],
  "GNSS/GPS": ["GNSS A", "GNSS B"],
  Controllers: ["Controller A", "Controller B"],
  Lasers: ["Laser A", "Laser B"],
  Levels: ["Level A", "Level B"],
  "Location Detection": ["Detector A", "Detector B"],
  Accessories: ["Accessory A", "Accessory B"],
};

const brands = [
  "Leica Geosystems",
  "Radiodetection",
  "Rothbucher Systeme",
  "Chartwell",
  "Nedo",
  "Survipod",
  "PIX4D",
  "Vivax Metrotech",
];

export default function NewEquipmentDropdown() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="flex w-[700px] animate-fadeIn">
      {/* Sidebar */}
      <div className="w-[250px] p-4 border-r">
        <h3 className="font-semibold mb-2">SHOP BY CATEGORY</h3>
        <ul className="space-y-2">
          {Object.keys(categories).map((category) => (
            <li
              key={category}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="cursor-pointer hover:text-red-600"
            >
              {category}
            </li>
          ))}
        </ul>

        <h3 className="font-semibold mt-6 mb-2">SHOP BY BRAND</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {brands.map((brand) => (
            <li key={brand} className="hover:text-red-600 cursor-pointer">
              {brand}
            </li>
          ))}
        </ul>
      </div>

      {/* Product Preview */}
      {hoveredCategory && (
        <div className="flex-1 bg-white shadow-xl p-4 grid grid-cols-2 gap-4">
          {categories[hoveredCategory].map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-center border p-4 rounded hover:shadow"
            >
              <span className="text-center">{product}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
