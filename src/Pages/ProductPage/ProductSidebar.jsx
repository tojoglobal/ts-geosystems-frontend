import { useState } from "react";
import { Link } from "react-router-dom";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

const sidebarData = [
  { label: "Shop All", link: "/shop-all", children: null },
  { label: "Campaign", link: "/campaign", children: null },
  {
    label: "Auto Levels",
    children: ["Geomax", "Pentax", "Bosch", "Topcon", "Sokkia"],
  },
  {
    label: "3D Laser Scanner",
    children: [],
  },
  {
    label: "Echo Sounder",
    children: [],
  },
  {
    label: "LiDAR",
    children: [],
  },
  {
    label: "Total Station",
    children: ["Hi-Target", "Leica", "Kolida", "Sokkia", "Topcon"],
  },
  {
    label: "Accessories",
    children: [
      "Battery",
      "Charger",
      "Pole",
      "Prism",
      "Mini Tripod",
      "Tripod",
      "Charger",
      "Staff",
    ],
  },
  {
    label: "Robotic Total Station",
    children: ["Bike", "Car"],
  },
  {
    label: "Distance Meters",
    children: ["Leica"],
  },
  // Added gap with a spacer object
  { label: "", type: "spacer", height: "20px" },
  {
    label: "Shop by Brand",
    children: [
      "Sokkia",
      "Kolida",
      "Topcon",
      "ts",
      "Leica",
      "Hi-Target",
      "Geomax",
      "Bosch",
    ],
  },
];

const ProductSidebar = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="w-full">
      {sidebarData.map((item, index) =>
        item.type === "spacer" ? (
          <div key={index} style={{ height: item.height }} />
        ) : (
          <div
            key={item.label}
            className={`bg-[#ebebeb] text-black ${index !== 0 ? "mt-1" : ""}`}
          >
            {item.children !== null ? (
              <div>
                <button
                  onClick={() => toggleSection(item.label)}
                  className={`w-full hover:text-[#e62245] flex items-center justify-between font-medium text-left p-3 ${
                    openSections[item.label]
                      ? "border-b-2 border-[#e62245]"
                      : ""
                  }`}
                >
                  <span>{item.label}</span>
                  {openSections[item.label] ? (
                    <SlArrowUp size={14} />
                  ) : (
                    <SlArrowDown size={14} />
                  )}
                </button>
                {openSections[item.label] && item.children.length > 0 && (
                  <div className="bg-white">
                    {item.children.map((child) => (
                      <Link
                        key={child}
                        to={`/${child.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block px-5 py-3 text-sm hover:bg-gray-50 border-t border-[#ebebeb]"
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.link}
                className="block p-3 hover:text-[#e62245] font-medium hover:underline"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      )}
      <div className="mt-6">
        <img
          src="https://ts-geosystems.com.bd/assets/images/6enPbrand-leica-adsp.png"
          alt="Leica Authorized Distributor"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProductSidebar;
