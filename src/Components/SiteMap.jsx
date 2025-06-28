import { Link } from "react-router-dom";
import useDataQuery from "../utils/useDataQuery";

const PAGES = [
  { name: "CONTACT US", to: "/contact-us" },
  { name: "ABOUT US", to: "/about-us" },
  {
    name: "SUPPORT",
    children: [
      { name: "Software Downloads", to: "/software-downloads" },
      { name: "Remote Support", to: "/remote-support" },
      { name: "Quick Guides", to: "/quick-guides" },
      { name: "User Manuals", to: "/user-manuals" },
    ],
  },
  { name: "SERVICE", to: "/service" },
  { name: "HIRE", to: "/hire" },
  { name: "USED EQUIPMENT", to: "/used" },
  { name: "TRADE IN", to: "/trade-in" },
  { name: "G2 BLOG", to: "/ts-blog" },
  { name: "CLEARANCE", to: "/clearance" },
  { name: "Home", to: "/" },
];

const SiteMap = () => {
  const { data: catData, isLoading: catLoading } = useDataQuery(
    ["categories"],
    "/api/category"
  );
  const { data: subData, isLoading: subLoading } = useDataQuery(
    ["subcategories"],
    "/api/subcategory"
  );
  const { data: brandData, isLoading: brandLoading } = useDataQuery(
    ["brands"],
    "/api/brands"
  );

  const categories = catData?.categories || [];
  const subcategories = subData?.subcategories || [];
  const brands = brandData || [];

  const getSubcategories = (categoryId) =>
    subcategories.filter(
      (s) =>
        (s.main_category_id === categoryId ||
          s.mainCategoryId === categoryId) &&
        (s.status === 1 || s.status === true)
    );

  // pick slug/subcategory name field depending on API
  const getSubSlug = (sub) => sub.slug || sub.slug_name;
  const getSubName = (sub) => sub.name || sub.subcategory_name;

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] px-3 mx-auto py-12">
      <h1 className="text-[28px] font-light mb-7">Sitemap</h1>
      <ul className="pl-5 text-[15px] text-black space-y-2">
        <li className="mb-4 relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
          <span className="font-light text-[22px] text-black">Pages</span>
          <ul className="pl-7 space-y-2 mt-2 text-sm">
            {PAGES.map((page, idx) =>
              !page.children ? (
                <li
                  key={page.name + idx}
                  className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2"
                >
                  <Link
                    to={page.to}
                    className="text-[#e62245] underline text-sm"
                  >
                    {page.name}
                  </Link>
                </li>
              ) : (
                <li
                  key={page.name + idx}
                  className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2"
                >
                  <span className="text-[#e62245]">{page.name}</span>
                  <ul className="pl-7 space-y-2 mt-2">
                    {page.children.map((child, cidx) => (
                      <li
                        key={child.name + cidx}
                        className="relative before:content-[''] before:absolute before:w-1 before:h-1 before:bg-black before:rounded-none before:-left-4 before:top-2"
                      >
                        <Link
                          to={child.to}
                          className="text-[#e62245] underline"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            )}
          </ul>
        </li>
        <li className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
          <span className="font-light text-[22px] text-black">Categories</span>
          <ul className="pl-7 space-y-2 mt-2">
            <li className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
              <Link to="/shop-all" className="text-[#e62245] underline">
                Shop All
              </Link>
            </li>
            {catLoading || subLoading ? (
              <li className="text-gray-400">Loading...</li>
            ) : (
              categories.map((cat) => (
                <li
                  key={cat.id}
                  className="text-sm relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2"
                >
                  <Link
                    to={`/${cat.slug_name}`}
                    className="text-[#e62245] underline"
                  >
                    {cat.category_name}
                  </Link>
                  {getSubcategories(cat.id).length > 0 && (
                    <ul className="pl-7 space-y-2 mt-2">
                      {getSubcategories(cat.id).map((sub) => (
                        <li
                          key={sub.id}
                          className="relative before:content-[''] before:absolute before:w-1 before:h-1 before:bg-black before:rounded-none before:-left-4 before:top-2"
                        >
                          <Link
                            to={`/${cat.slug_name}/${getSubSlug(sub)}`}
                            className="text-[#e62245] underline"
                          >
                            {getSubName(sub)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))
            )}
          </ul>
        </li>
        <li className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2 mt-4">
          <span className="font-light text-[22px] text-black">Brands</span>
          <ul className="pl-7 space-y-2 text-sm mt-2">
            {brandLoading ? (
              <li className="text-gray-400">Loading...</li>
            ) : (
              brands
                .filter((brand) => brand.status === 1)
                .map((brand) => (
                  <li
                    key={brand.id}
                    className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2"
                  >
                    <Link
                      to={`/brand/${brand.slug}`}
                      className="text-[#e62245] underline"
                    >
                      {brand.brands_name}
                    </Link>
                  </li>
                ))
            )}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default SiteMap;
