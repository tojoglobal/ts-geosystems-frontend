import { useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { useDispatch, useSelector } from "react-redux";
import { closeCart } from "../features/CartToggleSlice/CartToggleSlice";
import useProductsByIdsQuery from "../Hooks/useProductsByIdsQuery";
import { getFirstImage } from "../utils/getFirstImage";

const CartWithPopover = () => {
  const { isSticky } = useSelector((state) => state.sticky);
  const { items } = useSelector((state) => state.cart);
  const { isCartVisible } = useSelector((state) => state.cartToggle);

  const dispatch = useDispatch();
  const cartRef = useRef(null);
  const productIds = useMemo(() => items.map((item) => item.id), [items]);
  const { products, loading } = useProductsByIdsQuery(productIds);

  const mergedCart = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCartVisible &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        dispatch(closeCart());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartVisible, dispatch]);

  if (!isCartVisible) return null;

  return (
    <>
      {/* Mobile version (top position) */}
      <div className="block md:hidden">
        <div
          ref={cartRef}
          className="fixed top-12 left-0 right-0 z-[100] w-full bg-white border-b border-gray-200 shadow-lg max-h-[60vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white px-3 py-2 border-b flex justify-between items-center">
            <h3 className="font-bold text-base">Your Cart ({items.length})</h3>
            <button
              onClick={() => dispatch(closeCart())}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
          </div>
          <div className="p-3">
            {loading ? (
              <p className="text-center text-gray-600 py-6">
                Loading cart items...
              </p>
            ) : mergedCart.length === 0 ? (
              <p className="text-center text-gray-600 py-6">
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="max-h-[45vh] overflow-y-auto">
                  {mergedCart?.map((item, index) => (
                    <div key={item.id} className="py-2">
                      <div className="flex items-start gap-3">
                        <img
                          src={
                            getFirstImage(item.image_urls)
                              ? `${
                                  import.meta.env.VITE_OPEN_APIURL
                                }${getFirstImage(item.image_urls)}`
                              : "/placeholder.jpg"
                          }
                          alt={item.product_name}
                          className="w-12 h-12 object-contain"
                        />
                        <div className="flex-1">
                          <p className="capitalize text-xs text-gray-600 mb-1 truncate">
                            {item.brand_name}
                          </p>
                          <Link
                            to={`/products/${item.id}/${slugify(
                              item.product_name || ""
                            )}`}
                            onClick={() => dispatch(closeCart())}
                          >
                            <p className="text-xs font-medium text-crimson-red leading-tight mb-1 line-clamp-2">
                              {item.product_name}
                            </p>
                          </Link>
                          <p className="text-xs text-black font-semibold">
                            {item.quantity}x ৳{item.price}
                          </p>
                        </div>
                      </div>
                      {index < mergedCart.length - 1 && (
                        <hr className="my-2 border-t border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Link to="/checkout" onClick={() => dispatch(closeCart())}>
                    <button className="w-full bg-crimson-red text-xs text-white cursor-pointer font-semibold py-2 rounded">
                      CHECK OUT NOW
                    </button>
                  </Link>
                  <Link to="/cart" onClick={() => dispatch(closeCart())}>
                    <button className="w-full bg-white text-xs text-crimson-red cursor-pointer font-semibold py-2 rounded border border-crimson-red">
                      VIEW CART
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop version (unchanged from original) */}
      <div className="hidden md:block">
        <div
          ref={cartRef}
          className={`absolute z-[100] w-[390px] bg-white border border-gray-200 shadow-xl p-4 ${
            isSticky ? "top-11 right-48" : "top-0 right-5"
          }`}
        >
          {loading ? (
            <p className="text-center text-gray-600 py-8">
              Loading cart items...
            </p>
          ) : mergedCart.length === 0 ? (
            <p className="text-center text-gray-600 py-8">Your cart is empty</p>
          ) : (
            <>
              {mergedCart?.map((item, index) => (
                <div key={item.id} className="py-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        getFirstImage(item.image_urls)
                          ? `${import.meta.env.VITE_OPEN_APIURL}${getFirstImage(
                              item.image_urls
                            )}`
                          : "/placeholder.jpg"
                      }
                      alt={item.product_name}
                      className="w-14 h-14 object-contain"
                    />
                    <div>
                      <p className="capitalize text-sm text-gray-600 mb-1">
                        {item.brand_name}
                      </p>
                      <Link
                        to={`/products/${item.id}/${slugify(
                          item.product_name || ""
                        )}`}
                      >
                        <p className="text-xs font-medium text-crimson-red leading-tight mb-1">
                          {item.product_name}
                        </p>
                      </Link>
                      <p className="text-sm text-black font-semibold">
                        {item.quantity > 0 && item.quantity}x ৳{item.price}
                      </p>
                    </div>
                  </div>
                  {index < mergedCart.length - 1 && (
                    <hr className="my-3 border-t border-gray-300" />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-5 border-t">
                <Link to="/checkout" className="w-1/2">
                  <button className="w-full bg-crimson-red text-sm text-white cursor-pointer font-semibold py-2 rounded">
                    CHECK OUT NOW
                  </button>
                </Link>
                <Link to="/cart" className="w-1/2">
                  <button className="w-full bg-crimson-red text-sm text-white cursor-pointer font-semibold py-2 rounded">
                    VIEW CART
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartWithPopover;
