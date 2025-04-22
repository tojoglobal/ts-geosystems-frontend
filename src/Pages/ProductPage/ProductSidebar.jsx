import { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const sidebarData = [
   { label: "Shop All", link: "/shop-all", children: null },
   { label: "Campaign", link: "/campaign", children: null },
   {
      label: "Auto Levels",
      children: ["Geomax", "Pentax", "Bosch", "Topcon", "Sokkia"],
   },
   {
      label: "3D Laser Scanner",
      children: null,
   },
   {
      label: "Echo Sounder",
      children: null,
   },
   {
      label: "LiDAR",
      children: null,
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
         {sidebarData.map((item, index) => (
            <div
               key={item.label}
               className={`bg-[#ebebeb] p-3 text-black border-b border-white ${
                  index !== 0 ? "mt-1" : ""
               }`}
            >
               {item.children ? (
                  <div>
                     <button
                        onClick={() => toggleSection(item.label)}
                        className="w-full flex items-center justify-between font-medium text-left"
                     >
                        <span>{item.label}</span>
                        {openSections[item.label] ? (
                           <FaChevronDown />
                        ) : (
                           <FaChevronRight />
                        )}
                     </button>
                     {openSections[item.label] && (
                        <div className="mt-2 ml-3 divide-y divide-[#ddd] bg-white">
                           {item.children.map((child) => (
                              <Link
                                 key={child}
                                 to={`/${child
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                 className="block px-2 py-2 text-sm hover:underline"
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
                     className="block font-medium hover:underline"
                  >
                     {item.label}
                  </Link>
               )}
            </div>
         ))}
      </div>
   );
};

export default ProductSidebar;
