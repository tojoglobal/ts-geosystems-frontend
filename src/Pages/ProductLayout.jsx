import { Link, Outlet, useLocation } from "react-router-dom";
import ProductSidebar from "./ProductPage/ProductSidebar";
import { useSelector } from "react-redux";
import AskAQuestion from "./ProductPage/AskAQuestion";

const ProductLayout = () => {
  const location = useLocation();
  const isDetailsPage = /^\/products\/\d+/.test(location.pathname);

  // Read breadcrumb from Redux (set by details page or on product click)
  const breadcrumb = useSelector((state) => state.breadcrumb);
  // Get productName and productId only if on product details page
  const productName =
    isDetailsPage && breadcrumb?.product?.name ? breadcrumb.product.name : "";
  const productId =
    isDetailsPage && breadcrumb?.product?.id ? breadcrumb.product.id : "";

  return (
    <div>
      {isDetailsPage && (
        <div className="z-50">
          <AskAQuestion productName={productName} productId={productId} />
        </div>
      )}
      <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto min-h-screen bg-white text-black mt-4 mb-10">
        {isDetailsPage && breadcrumb?.product && (
          <div className="flex items-center gap-1 text-[11px] md:mt-5 mb-2 flex-wrap mx-2 md:mx-0 px-1">
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
        <div className="flex flex-col md:flex-row">
          {/* Sidebar: show on md+ */}
          <div className="hidden md:block w-full md:w-[18%]">
            <ProductSidebar />
          </div>
          {/* Main content */}
          <div className="w-full md:w-[82%] overflow-y-auto px-2 sm:px-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
