import { useSelector } from "react-redux";
import useDataQuery from "../utils/useDataQuery";
import { Link } from "react-router-dom";

const RecentlyViewed = () => {
  const { user } = useSelector((state) => state.authUser);
  const { data = {}, isLoading } = useDataQuery(
    ["myRecentlyViewed", user?.email],
    user?.email ? `/api/viewed/products/${user.email}` : null
  );

  // Parse the JSON fields in the products
  const parseProductFields = (product) => {
    try {
      return {
        ...product,
        category:
          typeof product.category === "string"
            ? JSON.parse(product.category)
            : product.category,
        sub_category:
          typeof product.sub_category === "string"
            ? JSON.parse(product.sub_category)
            : product.sub_category,
        tax:
          typeof product.tax === "string"
            ? JSON.parse(product.tax)
            : product.tax,
        image_urls:
          typeof product.image_urls === "string"
            ? JSON.parse(product.image_urls)
            : product.image_urls,
      };
    } catch (error) {
      console.error("Error parsing product fields:", error);
      return product;
    }
  };

  // Format the price with VAT
  const getPriceWithVat = (price, taxValue) => {
    const priceNum = parseFloat(price) || 0;
    const vat = taxValue ? parseFloat(taxValue) : 0;
    return (priceNum * (1 + vat / 100)).toFixed(2);
  };

  // Get the first image URL
  const getFirstImage = (imageUrls) => {
    if (!imageUrls || !imageUrls.length) return "";
    const firstImage = imageUrls[0];
    return firstImage.startsWith("/uploads")
      ? `${import.meta.env.VITE_OPEN_APIURL}${firstImage}`
      : firstImage;
  };

  if (!user) return null;
  if (isLoading) return <div>Loading recently viewed items...</div>;
  if (!data.products || data.products.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Recently Viewed</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.products.map((product) => {
          const parsedProduct = parseProductFields(product);
          const firstImage = getFirstImage(parsedProduct.image_urls);
          const priceWithVat = getPriceWithVat(
            parsedProduct.price,
            parsedProduct.tax?.value
          );

          return (
            <div
              key={product.id}
              className="bg-white overflow-hidden border rounded-lg"
            >
              <div className="relative">
                {parsedProduct.clearance && (
                  <span className="absolute top-1 right-4 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                    SALE
                  </span>
                )}
                <Link to={`/product/${product.id}`}>
                  <img
                    src={firstImage}
                    alt={product.product_name}
                    className="w-auto mx-auto h-48 object-contain p-4"
                  />
                </Link>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-600 mb-1">
                  {product.brand_name} | Sku: {product.sku}
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 hover:text-crimson-red">
                    {product.product_name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ৳{parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      (Ex. VAT)
                    </span>
                    <div className="text-sm text-gray-500">
                      ৳{priceWithVat}{" "}
                      <span className="text-xs">(Inc. VAT)</span>
                    </div>
                  </div>
                </div>
                <button className="mt-4 cursor-pointer text-[14px] w-full bg-crimson-red text-white py-[6px] px-4 rounded hover:bg-red-700 transition-colors">
                  {parsedProduct.clearance ? "ADD TO CART" : "CHOOSE OPTIONS"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewed;
