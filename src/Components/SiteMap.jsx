import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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

const categoryApi = "/api/category";
const subcategoryApi = "/api/subcategory";
const brandsApi = "/api/brands"; // Not shown in image, but you can add if needed

const SiteMap = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios.get(categoryApi).then((res) => {
      setCategories(res.data.categories || []);
    });
    axios.get(subcategoryApi).then((res) => {
      setSubcategories(res.data.subcategories || []);
    });
  }, []);

  const getSubcategories = (categoryId) =>
    subcategories.filter((s) => s.main_category_id === categoryId);

  return (
    <div className="max-w-[1370px] mx-auto py-12">
      <h1 className="text-2xl font-light text-[#e62245] mb-7">Sitemap</h1>
      <ul className="pl-8 text-[15px] text-black space-y-2">
        <li className="mb-4 relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
          <span className="font-semibold text-lg text-black">Pages</span>
          <ul className="pl-7 space-y-2 mt-2">
            {PAGES.map((page, idx) =>
              !page.children ? (
                <li key={page.name + idx} className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
                  <Link to={page.to} className="text-[#e62245] hover:underline">
                    {page.name}
                  </Link>
                </li>
              ) : (
                <li key={page.name + idx} className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
                  <span className="text-[#e62245]">{page.name}</span>
                  <ul className="pl-7 space-y-2 mt-2">
                    {page.children.map((child, cidx) => (
                      <li key={child.name + cidx} className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-black before:rounded-full before:-left-4 before:top-2">
                        <Link
                          to={child.to}
                          className="text-[#e62245] hover:underline"
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
          <span className="font-semibold text-lg text-black">Categories</span>
          <ul className="pl-7 space-y-2 mt-2">
            <li className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
              <Link to="/shop" className="text-[#e62245] hover:underline">
                Shop All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border before:border-gray-400 before:rounded-full before:-left-4 before:top-2">
                <Link
                  to={`/category/${cat.slug_name}`}
                  className="text-[#e62245] hover:underline"
                >
                  {cat.category_name}
                </Link>
                {getSubcategories(cat.id).length > 0 && (
                  <ul className="pl-7 space-y-2 mt-2">
                    {getSubcategories(cat.id).map((sub) => (
                      <li key={sub.id} className="relative before:content-[''] before:absolute before:w-2 before:h-2 before:bg-black before:rounded-full before:-left-4 before:top-2">
                        <Link
                          to={`/category/${cat.slug_name}/${sub.slug_name}`}
                          className="text-[#e62245] hover:underline"
                        >
                          {sub.subcategory_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default SiteMap;
