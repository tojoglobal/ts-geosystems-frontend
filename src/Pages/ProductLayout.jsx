import { Link, Outlet, useLocation } from "react-router-dom";
import ProductSidebar from "./ProductPage/ProductSidebar";
import { useSelector } from "react-redux";

const ProductLayout = () => {
  const location = useLocation();
  const isDetailsPage = /^\/products\/\d+/.test(location.pathname);

  // Read breadcrumb from Redux (set by details page or on product click)
  const breadcrumb = useSelector((state) => state.breadcrumb);

  return (
    <div className="max-w-[1370px] mx-auto min-h-screen bg-white text-black mt-4 mb-10">
      {isDetailsPage && breadcrumb?.product && (
        <div className="flex items-center gap-1 text-[11px] mt-5 mb-2 flex-wrap">
          <Link to="/" className="hover:text-[#e62245]">
            Home
          </Link>
          {breadcrumb.category && (
            <>
              <span>/</span>
              <Link
                to={`/${breadcrumb.category.slug}`}
                className="hover:text-[#e62245] capitalize"
              >
                {breadcrumb.category.name}
              </Link>
            </>
          )}
          {breadcrumb.subcategory && (
            <>
              <span>/</span>
              <Link
                to={`/${breadcrumb.category.slug}/${breadcrumb.subcategory.slug}`}
                className="hover:text-[#e62245] capitalize"
              >
                {breadcrumb.subcategory.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#e62245] font-semibold line-clamp-1">
            {breadcrumb.product.name}
          </span>
        </div>
      )}
      <div className="flex flex-col md:flex-row ">
        <div className="hidden md:block w-full md:w-[18%]">
          <ProductSidebar />
        </div>
        <div className="w-full md:w-[82%] overflow-y-auto px-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
