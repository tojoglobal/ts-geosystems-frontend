import { Link, Outlet } from "react-router-dom";
import ProductSidebar from "./ProductPage/ProductSidebar";

const ProductLayout = () => {
  return (
    <div className="max-w-[1370px] mx-auto min-h-screen bg-white text-black mt-4 mb-10">
      <div className="flex items-center gap-2 text-[11px] mt-3 mb-1">
        <Link to="/" className="text-[#e62245] hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to="/hire" className="capitalize text-[#e62245]">
          Hire
        </Link>
      </div>
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
