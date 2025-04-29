import React, { useState, useRef, useEffect } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";

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
  const axiosPublicUrl = useAxiospublic();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const timeoutRef = useRef(null);
  const [animateLine, setAnimateLine] = useState(true);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/category");
      return res?.data;
    },
  });

  // Fetch subcategories
  const {
    data: subcategoriesData,
    isLoading: subcategoriesLoading,
    error: subcategoriesError,
  } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/subcategory");
      return res?.data;
    },
  });

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

  // Get subcategories for the hovered category
  const getSubcategoriesForCategory = (categoryId) => {
    if (!subcategoriesData?.subcategories) return [];
    return subcategoriesData.subcategories.filter(
      (subcat) => subcat.main_category_id === categoryId
    );
  };

  if (categoriesLoading || subcategoriesLoading) {
    // add better design if want to
    return <div>Loading...</div>;
  }

  if (categoriesError || subcategoriesError) {
    // add better design if want to
    return <div>Error loading data</div>;
  }

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
          {categoriesData?.categories?.map((category) => (
            <li
              key={category.id}
              onMouseEnter={() => {
                handleMouseEnterCategory(category);
              }}
              className="cursor-pointer pr-6"
            >
              <div className="flex justify-between items-center font-normal">
                <span
                  className="capitalize text-[13px]"
                  style={{
                    color: hoveredCategory?.id === category.id ? "#e62245" : "",
                    letterSpacing:
                      hoveredCategory?.id === category.id ? "0.1px" : "",
                    marginRight:
                      hoveredCategory?.id === category.id ? "5px" : "",
                    transition: "all 0.1s ease-in-out",
                  }}
                >
                  {category.category_name}
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
            <div
              className={`capitalize text-reveal-wrapper text-3xl font-semibold mb-3`}
            >
              {hoveredCategory.category_name}
              <div
                className={`text-reveal-overlay  text-3xl font-semibold mb-3`}
              >
                {hoveredCategory.category_name}
              </div>
            </div>
            <span
              className={`absolute left-0 bottom-0 h-[4px] w-full bg-[#e62245] ${
                animateLine ? "animate-growLine" : ""
              }`}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {getSubcategoriesForCategory(hoveredCategory.id).map(
              (subcategory) => (
                <div key={subcategory.id} className="flex flex-col group">
                  <div className="relative group h-[180px] overflow-hidden rounded-lg shadow-md cursor-pointer bg-white border-[1px] border-slightly-dark">
                    <div className="w-full h-full overflow-hidden">
                      {subcategory.photo && (
                        <img
                          src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                            subcategory.photo
                          }`}
                          alt={subcategory.name}
                          className="w-full h-full object-contain transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-2 transition-all duration-[0.2s] ease-in-out">
                    <h4 className="capitalize font-bold text-base hover:text-crimson-red group-hover:underline cursor-pointer">
                      {subcategory.name}
                    </h4>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
