import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery } from "@tanstack/react-query";

const ProductSidebar = () => {
  const { category, subcategory } = useParams();
  const axiosPublicUrl = useAxiospublic();
  const [openSections, setOpenSections] = useState({});

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

  useEffect(() => {
    // Automatically open the section if category is in URL params
    if (category && categoriesData?.categories) {
      const foundCategory = categoriesData.categories.find(
        (cat) => cat.slug_name === category
      );
      if (foundCategory) {
        setOpenSections((prev) => ({
          ...prev,
          [foundCategory.category_name]: true,
        }));
      }
    }
  }, [category, categoriesData]);

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Get subcategories for a category
  const getSubcategoriesForCategory = (categoryId) => {
    if (!subcategoriesData?.subcategories) return [];
    return subcategoriesData.subcategories.filter(
      (subcat) => subcat.main_category_id === categoryId
    );
  };

  if (categoriesLoading || subcategoriesLoading || brandsLoading) {
    return <div>Loading...</div>;
  }

  if (categoriesError || subcategoriesError || brandsError) {
    return <div>Error loading data</div>;
  }

  // Create sidebar data structure dynamically
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

  return (
    <div className="w-full mt-3">
      {dynamicSidebarData.map((item, index) =>
        item.type === "spacer" ? (
          <div key={index} style={{ height: item.height }} />
        ) : (
          <div
            key={item.label}
            className={`bg-[#ebebeb] font-bold rounded-[3px] text-[13px] text-black ${
              index !== 0 ? "mt-[6px]" : ""
            }`}
          >
            {item.children !== null && item.children.length > 0 ? (
              <div>
                <button
                  onClick={() => toggleSection(item.label)}
                  className={`w-full text-xs capitalize hover:text-[#e62245] flex items-center justify-between font-medium text-left p-3 ${
                    openSections[item.label]
                      ? "border-b-2 border-[#e62245]"
                      : ""
                  } ${
                    category === item.categorySlug
                      ? "text-[#e62245] font-bold"
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
                        key={child.slug || child.name}
                        to={
                          item.label === "Shop by Brand"
                            ? `/${child.slug}`
                            : `/${item.categorySlug}/${child.slug}`
                        }
                        className={`capitalize block px-5 py-3 font-bold text-[13px] hover:bg-gray-50 border-t border-[#ebebeb] ${
                          subcategory === child.slug &&
                          category === item.categorySlug
                            ? "text-[#e62245] font-bold"
                            : ""
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.link}
                className={`block p-3 hover:text-[#e62245] font-medium hover:underline ${
                  item.link === `/${category}` ? "text-[#e62245] font-bold" : ""
                }`}
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
