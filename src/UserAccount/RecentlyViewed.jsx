/* eslint-disable no-useless-escape */
import { useDispatch, useSelector } from "react-redux";
import useDataQuery from "../utils/useDataQuery";
import { useState, useEffect } from "react";
import Loader from "../utils/Loader";
import { getProductType } from "../utils/productOption";
import { parsePrice } from "../utils/parsePrice";
import { addToCart } from "../features/AddToCart/AddToCart";
import Swal from "sweetalert2";
import { slugify } from "../utils/slugify";
import { Link } from "react-router-dom";

const RecentlyViewed = () => {
  const { user } = useSelector((state) => state.authUser);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data = {}, isLoading } = useDataQuery(
    ["myRecentlyViewed", page, limit],
    `/api/viewed/products/${user.email}?page=${page}&limit=${limit}`
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.total || 0);
    }
  }, [data]);

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

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleAddToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parsePrice(product.price),
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));
    Swal.fire({
      title: "Added to Cart",
      text: `${product.product_name} has been added to your cart.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalItems)} of {totalItems} items
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={limit}
            onChange={handleLimitChange}
            className="border cursor-pointer appearance-none rounded outline-none px-5 py-[1px] text-sm"
          >
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentItems.map((item) => {
          const { isSimpleProduct } = getProductType(item);
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
                <Link
                  to={`/products/${item.id}/${slugify(
                    item.product_name || ""
                  )}`}
                >
                  <img
                    src={displayImage}
                    alt={item.product_name}
                    className="w-auto mx-auto max-h-[176px] object-cover"
                  />
                </Link>
              </div>
              <div className="p-[5px]">
                <div className="capitalize text-sm text-gray-600 mb-1 border-t border-gray-200 pt-3">
                  {item.brand_name} | Sku: {item.sku}
                </div>
                <Link
                  to={`/products/${item.id}/${slugify(
                    item.product_name || ""
                  )}`}
                >
                  <h3 className="text-sm min-h-10 font-medium text-gray-900 mb-2">
                    {item.product_name}
                  </h3>{" "}
                </Link>
                <div className="text-sm text-gray-900 font-semibold">
                  ৳{formatPrice(price)}{" "}
                  <span className="text-xs text-gray-500">(Ex. VAT)</span>
                </div>
                <div className="text-sm text-gray-900 font-semibold mb-2">
                  ৳{formatPrice(priceIncVat)}{" "}
                  <span className="text-xs text-gray-500">(Inc. VAT)</span>
                </div>
                {item?.isStock === 1 && (
                  <div>
                    {isSimpleProduct ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#e62245] w-full cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                      >
                        ADD TO CART
                      </button>
                    ) : (
                      <Link
                        to={`/products/${item.id}/${slugify(
                          item.product_name || ""
                        )}`}
                        className="w-full block text-center cursor-pointer bg-[#e62245] text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                      >
                        CHOOSE OPTION
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 cursor-pointer py-1 rounded border ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 cursor-pointer py-1 rounded border ${
                  page === pageNum
                    ? "bg-crimson-red text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && page < totalPages - 2 && (
            <span className="px-2">...</span>
          )}

          {totalPages > 5 && page < totalPages - 2 && (
            <button
              onClick={() => setPage(totalPages)}
              className="px-3 py-1 cursor-pointer rounded border bg-white hover:bg-gray-50"
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 cursor-pointer rounded border ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
