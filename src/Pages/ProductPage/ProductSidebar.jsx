import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import useDataQuery from "../../utils/useDataQuery";
import { useSelector } from "react-redux";
import { useHomeBrands } from "../../Hooks/useHomeBrands";

const ProductSidebar = () => {
  const { category, subcategory, brand } = useParams();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  const breadcrumb = useSelector((state) => state.breadcrumb);
  const subcategoryRefs = useRef({});

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

  // Fetch only Home Page brands for "Shop by Brand"
  const { brands: brandsData, isLoading: loading } = useHomeBrands();
  const { data = {}, isLoading: brandsLoading } = useDataQuery(
    ["popularBrand"],
    "/api/brand/popular"
  );

  useEffect(() => {
    let catSlug =
      (location.pathname.startsWith("/products/") &&
        breadcrumb?.category?.slug) ||
      category;

    let newOpenSections = {};

    if (catSlug && categoriesData?.categories) {
      const foundCategory = categoriesData.categories.find(
        (cat) => cat.slug_name === catSlug
      );
      if (foundCategory) {
        newOpenSections[foundCategory.category_name] = true;
      }
    }
    if (brand) {
      newOpenSections["Shop by Brand"] = true;
    }
    setOpenSections(newOpenSections);
  }, [
    category,
    categoriesData,
    breadcrumb?.category,
    location.pathname,
    brand,
  ]);

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const getSubcategoriesForCategory = (categoryId) => {
    if (!subcategoriesData?.subcategories) return [];
    return subcategoriesData.subcategories.filter(
      (subcat) => subcat.main_category_id === categoryId
    );
  };

  if (categoriesLoading || subcategoriesLoading || loading || brandsLoading)
    return null;
  if (categoriesError || subcategoriesError) {
    return <div>Error loading data</div>;
  }

  const dynamicSidebarData = [
    { label: "Shop All", link: "/shop-all", children: null },
    ...(categoriesData?.categories?.map((category) => ({
      label: category.category_name,
      children: getSubcategoriesForCategory(category.id).map((subcat) => ({
        name: subcat.name,
        slug: subcat.slug,
        categorySlug: category.slug_name,
      })),
      categoryId: category.id,
      categorySlug: category.slug_name,
    })) || []),
    { label: "", type: "spacer", height: "20px" },
    {
      label: "Shop by Brand",
      children: Array.isArray(brandsData)
        ? brandsData.map((brand) => ({
            name: brand.brands_name,
            slug: brand.slug,
          }))
        : [],
    },
  ];

  const activeCategorySlug =
    (location.pathname.startsWith("/products/") &&
      breadcrumb?.category?.slug) ||
    category;
  const activeSubcategorySlug =
    (location.pathname.startsWith("/products/") &&
      breadcrumb?.subcategory?.slug) ||
    subcategory;

  // Helper to check if a category or any of its subcategories is active
  const isCategoryActive = (item) => {
    if (!item.categorySlug) return false;
    if (item.categorySlug === activeCategorySlug) return true;
    if (
      item.children &&
      item.children.some(
        (sub) =>
          sub.slug === activeSubcategorySlug &&
          item.categorySlug === activeCategorySlug
      )
    ) {
      return true;
    }
    return false;
  };

  // Helper: is subcategory hovered?
  const isCategoryOrSubHover = (item) => {
    if (hoveredCategory === item.label) return true;
    if (
      item.children &&
      hoveredSubcategory &&
      item.children.some(
        (sub) => hoveredSubcategory === `${item.categorySlug}/${sub.slug}`
      )
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="w-full mt-3">
      {dynamicSidebarData.map((item, index) =>
        item.type === "spacer" ? (
          <div key={index} style={{ height: item.height }} />
        ) : (
          <div
            key={item.label}
            className={`bg-[#ebebeb] font-bold rounded-[4px] text-[13px] ${
              index !== 0 ? "mt-[5px]" : ""
            }`}
          >
            {item.label === "Shop All" ? (
              <Link
                to={item.link}
                className={`block p-[11px] hover:text-[#e62245] font-bold ${
                  item.link === `/${activeCategorySlug}` ? "text-[#e62245]" : ""
                }`}
              >
                {item.label}
              </Link>
            ) : item.children !== null && item.children.length > 0 ? (
              <div
                className="group"
                onMouseEnter={() => setHoveredCategory(item.label)}
                onMouseLeave={() => {
                  setHoveredCategory(null);
                  setHoveredSubcategory(null);
                }}
              >
                <div
                  className={`
                    flex items-center justify-between p-3 cursor-pointer
                    ${
                      isCategoryActive(item)
                        ? "border-b-2 border-[#e62245]"
                        : "border-b-2 border-transparent"
                    }
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSection(item.label);
                  }}
                >
                  <Link
                    to={
                      item.label === "Shop by Brand"
                        ? undefined
                        : `/${item.categorySlug}`
                    }
                    className={`
                      w-full text-xs capitalize font-bold text-left
                      ${isCategoryOrSubHover(item) ? "text-[#e62245]" : ""}
                    `}
                    style={{ flex: 1 }}
                  >
                    {item.label}
                  </Link>
                  <span
                    className={`ml-2 ${
                      isCategoryOrSubHover(item) ? "text-[#e62245]" : ""
                    }`}
                  >
                    {openSections[item.label] ? (
                      <SlArrowUp size={14} />
                    ) : (
                      <SlArrowDown size={14} />
                    )}
                  </span>
                </div>
                <div
                  ref={(el) => (subcategoryRefs.current[item.label] = el)}
                  style={{
                    maxHeight: openSections[item.label]
                      ? `${
                          subcategoryRefs.current[item.label]?.scrollHeight ||
                          999
                        }px`
                      : "0",
                  }}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openSections[item.label] ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="bg-[#f6f6f6]">
                    {item.children.map((child) => (
                      <Link
                        key={child.slug || child.name}
                        to={
                          item.label === "Shop by Brand"
                            ? `/brand/${child.slug}`
                            : `/${item.categorySlug}/${child.slug}`
                        }
                        className={`font-normal capitalize block px-5 py-3 text-[13px] hover:bg-gray-50 hover:text-[#e62245] border-t border-[#ebebeb] ${
                          item.label === "Shop by Brand" && brand === child.slug
                            ? "font-bold text-[#e62245]"
                            : activeSubcategorySlug === child.slug &&
                              activeCategorySlug === item.categorySlug
                            ? "font-bold text-[#e62245]"
                            : ""
                        }`}
                        onMouseEnter={() =>
                          setHoveredSubcategory(
                            item.label === "Shop by Brand"
                              ? child.slug
                              : `${item.categorySlug}/${child.slug}`
                          )
                        }
                        onMouseLeave={() => setHoveredSubcategory(null)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // No children: just a normal category link
              <Link
                to={`/${item.categorySlug}`}
                className={`block p-[11px] hover:text-[#e62245] font-bold ${
                  `/${item.categorySlug}` === `/${activeCategorySlug}`
                    ? "border-b-2 border-[#e62245]"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      )}
      {Array.isArray(data?.brands) &&
        data.brands.map((filename, i) => (
          <div
            className="mt-3 h-[110px] overflow-hidden border rounded-[4px]"
            key={i}
          >
            <img
              src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                filename.photo
              }`}
              alt="Brand"
              className="h-full w-full transition-transform duration-1000 hover:scale-110"
            />
          </div>
        ))}
    </div>
  );
};

export default ProductSidebar;
