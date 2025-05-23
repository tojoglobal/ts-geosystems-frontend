import { Outlet } from "react-router-dom";
import ProductSidebar from "./ProductPage/ProductSidebar";

const ProductLayout = () => {
  return (
    <div className="max-w-[1370px] mx-auto flex flex-col md:flex-row min-h-screen bg-white text-black mt-4 mb-10">
      <div className="hidden md:block w-full md:w-[18%]">
        <ProductSidebar />
      </div>
      <div className="w-full md:w-[82%] overflow-y-auto px-3">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductLayout;
