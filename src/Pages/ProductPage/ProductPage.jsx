import ProductDetails from "./ProductDetails";
import ProductSidebar from "./ProductSidebar";

const ProductPage = () => {
   return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
         <div className="hidden md:block w-full md:w-[20%] pl-4">
            <ProductSidebar />
         </div>
         <div className="w-full md:w-[80%] overflow-y-auto">
            <ProductDetails />
         </div>
      </div>
   );
};

export default ProductPage;
