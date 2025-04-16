import React, { useState, useRef, useEffect } from "react";
import { MdArrowForwardIos } from "react-icons/md";
const categories = {
  "Laser Scanners": [
    {
      name: "Scanner A",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/113/2828/leica-rtc360-3d-laser-scanner-c__62442.1669836108.jpg?c=1",
    },
    {
      name: "Scanner B",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/714/3906/leica-blk2go-pulse__63861.1701334286.jpg?c=1",
    },
    {
      name: "Scanner C",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/248/1793/leica-ms60-multistation__19669.1659454662.jpg?c=1",
    },
  ],
  "Total Stations": [
    {
      name: "Station A",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/523/3153/1678487747.1280.1280__97252.1695732157.jpg?c=1",
    },
    {
      name: "Station B",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/345/2310/leica-gvp716-backpack-b__32893.1659456356.jpg?c=1",
    },
    {
      name: "Station C",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Station D",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/482/3087/all-weather-cover-total-station-cs20__22898.1682382221.jpg?c=1",
    },
  ],
  "GNSS/GPS": [
    {
      name: "GNSS A",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/482/3087/all-weather-cover-total-station-cs20__22898.1682382221.jpg?c=1",
    },
    {
      name: "GNSS B",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "GNSS C",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "GNSS D",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
  ],
  Controllers: [
    {
      name: "Controller A",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Controller B",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Controller C",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Controller D",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Controller E",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
  ],
  Lasers: [
    { name: "Laser A", image: "https://source.unsplash.com/400x300/?laser" },
    {
      name: "Laser B",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Laser C",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Laser D",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
  ],
  Levels: [
    {
      name: "Level A",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Level B",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Level C",
      image: "https://source.unsplash.com/400x300/?spirit-level",
    },
    { name: "Level D", image: "https://source.unsplash.com/400x300/?accuracy" },
  ],
  "Location Detection": [
    {
      name: "Detector A",
      image: "https://source.unsplash.com/400x300/?sensor",
    },
    {
      name: "Detector B",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    {
      name: "Detector C",
      image: "https://source.unsplash.com/400x300/?location",
    },
    {
      name: "Detector D",
      image: "https://source.unsplash.com/400x300/?tracking",
    },
  ],
  Accessories: [
    {
      name: "Accessory A",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
    { name: "Accessory B", image: "https://source.unsplash.com/400x300/?tool" },
    { name: "Accessory C", image: "https://source.unsplash.com/400x300/?gear" },
    {
      name: "Accessory D",
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/765/4227/leica-cs20-controller-c__53925.1659455248.1280.1280__58962.1709896598.jpg?c=1",
    },
  ],
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
  const timeoutRef = useRef(null);
  const [animateLine, setAnimateLine] = useState(true);

  useEffect(() => {
    setAnimateLine(false);
    const timeout = setTimeout(() => setAnimateLine(true), 10);
    return () => clearTimeout(timeout);
  }, [hoveredCategory]);

  const handleMouseEnterCategory = (category) => {
    clearTimeout(timeoutRef.current);
    setHoveredCategory(category);
  };

  const handleMouseLeaveWrapper = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // delay for better UX
  };

  return (
    <div
      className="flex w-[1380px] min-h-[300px]"
      onMouseEnter={() => clearTimeout(timeoutRef.current)}
      onMouseLeave={handleMouseLeaveWrapper}
    >
      {/* Sidebar */}
      <div className="w-[250px] bg-white pl-4 pt-3 pb-4 border-r-[1px] border-slightly-dark">
        <h3 className="font-bold text-base mb-3 text-charcoal underline">
          SHOP BY CATEGORY
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li
            className="cursor-pointer hover:text-crimson-red transition"
            onMouseEnter={() => {
              handleMouseEnterCategory(null);
            }}
          >
            Shop All
          </li>

          {Object.keys(categories).map((category) => (
            <li
              key={category}
              onMouseEnter={() => {
                handleMouseEnterCategory(category);
              }}
              className="cursor-pointer pr-6"
            >
              <div className="flex justify-between items-center font-normal">
                <span
                  className="text-[13px]"
                  style={{
                    color: hoveredCategory === category ? "#e62245" : "",
                    letterSpacing: hoveredCategory === category ? "0.1px" : "",
                    marginRight: hoveredCategory === category ? "5px" : "",
                    transition: "all 0.1s ease-in-out",
                  }}
                >
                  {category}
                </span>
                <span className="text-xs">
                  <MdArrowForwardIos />
                </span>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="font-bold text-base mt-6 mb-3 text-charcoal underline">
          SHOP BY BRAND
        </h3>
        <ul className="space-y-1 text-sm text-gray-600">
          {brands.map((brand) => (
            <li
              key={brand}
              onMouseEnter={() => {
                handleMouseEnterCategory(null);
              }}
              className="cursor-pointer text-[13px] transition-all duration-[0.2s] ease-in-out group"
            >
              <span className="group-hover:text-[#e62245] group-hover:tracking-wide group-hover:mr-[5px]">
                {brand}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Product Preview */}
      {hoveredCategory && (
        <div className="flex-1 p-4 border-r-[1px] border-slightly-dark shadow-lg bg-white animate-fadeIn">
          <div className="relative inline-block mb-5">
            <div className={` text-reveal-wrapper text-3xl font-semibold mb-3`}>
              {hoveredCategory}
              <div
                className={`text-reveal-overlay  text-3xl font-semibold mb-3`}
              >
                {hoveredCategory}
              </div>
            </div>

            <span
              className={`absolute left-0 bottom-0 h-[4px] w-full bg-[#e62245] ${
                animateLine ? "animate-growLine" : ""
              }`}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {categories[hoveredCategory].map((product, index) => (
              <div className="flex flex-col group">
                <div
                  key={index}
                  className="relative group h-[180px] overflow-hidden rounded-lg shadow-md cursor-pointer bg-white border-[1px] border-slightly-dark"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="text-center mt-2  transition-all duration-[0.2s] ease-in-out">
                  <h4 className="font-bold text-base hover:text-crimson-red group-hover:underline cursor-pointer">
                    {product.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
