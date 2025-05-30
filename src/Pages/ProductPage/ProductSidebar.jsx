import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";
import useDataQuery from "../../utils/useDataQuery";
import { useSelector } from "react-redux";

const ProductSidebar = () => {
  const { category, subcategory } = useParams();
  const location = useLocation();
  const axiosPublicUrl = useAxiospublic();
  const [openSections, setOpenSections] = useState({});
  const breadcrumb = useSelector((state) => state.breadcrumb);
  const subcategoryRefs = useRef({}); // Ref to hold subcategory div elements

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
    data: brandsData,
    isLoading: brandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/brands");
      return res?.data?.map((brand) => ({
        name: brand.brands_name,
        slug: brand.slug,
      }));
    },
  });

  const { data: popularImage = {}, isLoading: loading } = useDataQuery(
    ["popularBrandPhoto"],
    "/api/brand/popular-photo"
  );

  useEffect(() => {
    let catSlug =
      (location.pathname.startsWith("/products/") &&
        breadcrumb?.category?.slug) ||
      category;

    if (catSlug && categoriesData?.categories) {
      const foundCategory = categoriesData.categories.find(
        (cat) => cat.slug_name === catSlug
      );
      if (foundCategory) {
        setOpenSections({
          [foundCategory.category_name]: true,
        });
      }
    }
    if (!catSlug) setOpenSections({});
  }, [category, categoriesData, breadcrumb?.category, location.pathname]);

  useEffect(() => {
    let catSlug =
      (location.pathname.startsWith("/products/") &&
        breadcrumb?.category?.slug) ||
      category;

    if (catSlug && categoriesData?.categories) {
      const foundCategory = categoriesData.categories.find(
        (cat) => cat.slug_name === catSlug
      );
      if (foundCategory) {
        setOpenSections((prev) => ({
          ...prev,
          [foundCategory.category_name]: true,
        }));
      }
    }
  }, [category, categoriesData, breadcrumb?.category, location.pathname]);

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

  if (categoriesLoading || subcategoriesLoading || brandsLoading || loading)
    return null;

  if (categoriesError || subcategoriesError || brandsError) {
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
      children: brandsData?.map((brand) => ({
        name: brand.name,
        slug: brand.slug,
      })),
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
            {item.children !== null && item.children.length > 0 ? (
              <div>
                <Link
                  to={item?.categorySlug}
                  className={`w-full text-xs capitalize hover:text-[#e62245] flex items-center justify-between bg-[#ebebeb] font-bold text-left p-3 ${
                    openSections[item.label]
                      ? "border-b-2 border-[#e62245]"
                      : ""
                    // } ${
                    //   activeCategorySlug === item.categorySlug
                    //     ? "text-[#e62245]"
                    //     : ""
                  }`}
                >
                  {item.label}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSection(item.label);
                    }}
                    className="cursor-pointer"
                  >
                    {openSections[item.label] ? (
                      <SlArrowUp size={14} />
                    ) : (
                      <SlArrowDown size={14} />
                    )}
                  </button>
                </Link>
                {/* Apply animation classes here */}
                <div
                  ref={(el) => (subcategoryRefs.current[item.label] = el)}
                  style={{
                    maxHeight: openSections[item.label]
                      ? `${subcategoryRefs.current[item.label]?.scrollHeight}px`
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
                            ? `/${child.slug}`
                            : `/${item.categorySlug}/${child.slug}`
                        }
                        className={`font-normal capitalize block px-5 py-3 text-[13px] hover:bg-gray-50 hover:text-[#e62245] border-t border-[#ebebeb] ${
                          activeSubcategorySlug === child.slug &&
                          activeCategorySlug === item.categorySlug
                            ? "text-[#e62245] font-bold"
                            : ""
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to={item.link}
                className={`block p-[11px] hover:text-[#e62245] font-bold hover:underline ${
                  item.link === `/${activeCategorySlug}` ? "text-[#e62245]" : ""
                }`}
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      )}
      <div className="mt-6 h-[80px] overflow-hidden border rounded-[4px]">
        <img
          src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
            popularImage.photo
          }`}
          alt="Leica Authorized Distributor"
          className="h-full w-full transition-transform duration-1000 hover:scale-110"
        />
      </div>
      {/* <div className="mt-6 overflow-hidden border rounded-[4px]">
        <img
          src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
            popularImage.photo
          }`}
          alt="Leica Authorized Distributor"
          className="w-full object-cover h-[105px] transition-transform duration-1000 hover:scale-110"
        />
      </div> */}
    </div>
  );
};

export default ProductSidebar;
