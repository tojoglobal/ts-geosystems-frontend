import { Outlet } from "react-router-dom";
import ProductSidebar from "./ProductPage/ProductSidebar";

const ProductLayout = () => {
  return (
    <div className="container mx-auto flex flex-col md:flex-row min-h-screen bg-white mt-4 mb-10">
      <div className="hidden md:block w-full md:w-[20%]">
        <ProductSidebar />
      </div>
      <div className="w-full md:w-[80%] overflow-y-auto px-3">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductLayout;
