import { useState, useRef, useEffect } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router-dom";
import useDataQuery from "../utils/useDataQuery";

export default function NewEquipmentDropdown() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const timeoutRef = useRef(null);
  const [animateLine, setAnimateLine] = useState(true);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useDataQuery(["categories"], "/api/category");

  // Fetch subcategories
  const {
    data: subcategoriesData,
    isLoading: subcategoriesLoading,
    error: subcategoriesError,
  } = useDataQuery(["subcategories"], "/api/subcategory");

  // Fetch brands
  const {
    data = {},
    isLoading: brandsLoading,
    error: brandsError,
  } = useDataQuery(["popularBrand"], "/api/brand/home");
  const brandsData = data?.brands || [];
  
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

  if (categoriesLoading || subcategoriesLoading || brandsLoading) {
    // add better design if want to
    return <div>Loading...</div>;
  }

  if (categoriesError || subcategoriesError || brandsError) {
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
        <ul className="space-y-2 capitalize text-[13px] font-normal text-gray-700">
          <li>
            <Link
              to="/shop-all"
              className="cursor-pointer hover:text-crimson-red transition"
              onMouseEnter={() => {
                handleMouseEnterCategory(null);
              }}
            >
              Shop All
            </Link>
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
                <Link
                  to={`/${category.slug_name}`}
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
                </Link>
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
          {brandsData?.map((brand) => (
            <li
              key={brand.slug}
              onMouseEnter={() => {
                handleMouseEnterCategory(null);
              }}
              className="cursor-pointer text-[13px] transition-all duration-[0.2s] ease-in-out group"
            >
              <Link
                to={`brand/${brand.slug}`}
                className="group-hover:text-[#e62245] group-hover:tracking-wide group-hover:mr-[5px]"
              >
                {brand.brands_name}
              </Link>
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
          <div className="grid grid-cols-4 gap-4 mb-4">
            {getSubcategoriesForCategory(hoveredCategory.id).map(
              (subcategory) => (
                <div key={subcategory.id} className="flex flex-col group">
                  <Link
                    to={`/${hoveredCategory.slug_name}/${subcategory.slug}`}
                    className="relative group"
                  >
                    <div className="relative group h-[180px] overflow-hidden rounded-[3px] shadow-md cursor-pointer bg-white border-[1px] border-slightly-dark">
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
                      <h4 className="capitalize font-bold text-base text-black group-hover:underline cursor-pointer">
                        {subcategory.name}
                      </h4>
                    </div>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
