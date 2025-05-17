/* eslint-disable no-useless-escape */
import { useSelector } from "react-redux";
import useDataQuery from "../utils/useDataQuery";
import { useState } from "react";
import Loader from "../utils/Loader";

const RecentlyViewed = () => {
  const { user } = useSelector((state) => state.authUser);
  const { data = {}, isLoading } = useDataQuery(
    ["myRecentlyViewed"],
    `/api/viewed/products/${user.email}`
  );
  const recentItems = data.products || [];

  const [hoveredProductId, setHoveredProductId] = useState(null);

  const parseField = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  };

  const formatPrice = (price) =>
    price.toLocaleString("en-BD", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
      {recentItems.map((item) => {
        let images = [];
        try {
          images = JSON.parse(item.image_urls);
        } catch {
          images = [item.image_urls];
        }

        const firstImage = images[0]
          ? `${import.meta.env.VITE_OPEN_APIURL}${images[0].replace(
              /^["\[]+|["\]]+$/g,
              ""
            )}`
          : "";

        const secondImage = images[1]
          ? `${import.meta.env.VITE_OPEN_APIURL}${images[1].replace(
              /^["\[]+|["\]]+$/g,
              ""
            )}`
          : firstImage;

        const isHovered = hoveredProductId === item.id;
        const displayImage = isHovered ? secondImage : firstImage;

        const taxData = parseField(item.tax);
        const price = parseFloat(item.price) || 0;
        const vat = taxData?.value || 0;
        const priceIncVat = price * (1 + vat / 100);

        const onSale = item.on_sale || false;

        return (
          <div
            key={item.id}
            className="bg-white overflow-hidden"
            onMouseEnter={() => setHoveredProductId(item.id)}
            onMouseLeave={() => setHoveredProductId(null)}
          >
            <div className="relative mb-3">
              {onSale && (
                <span className="absolute top-1 right-4 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  SALE
                </span>
              )}
              <img
                src={displayImage}
                alt={item.product_name}
                className="w-auto mx-auto max-h-[176px] object-cover"
              />
            </div>
            <div className="p-3">
              <div className="capitalize text-sm text-gray-600 mb-1 border-t border-gray-200 pt-3">
                {item.brand_name} | Sku: {item.sku}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {item.product_name}
              </h3>
              <div className="text-sm text-gray-900 font-semibold">
                ৳{formatPrice(price)}{" "}
                <span className="text-xs text-gray-500">(Ex. VAT)</span>
              </div>
              <div className="text-sm text-gray-900 font-semibold mb-2">
                ৳{formatPrice(priceIncVat)}{" "}
                <span className="text-xs text-gray-500">(Inc. VAT)</span>
              </div>
              <button className="mt-2 cursor-pointer text-[14px] w-full bg-crimson-red text-white py-[6px] px-4 rounded hover:bg-red-700 transition-colors">
                {onSale ? "ADD TO CART" : "CHOOSE OPTIONS"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentlyViewed;
