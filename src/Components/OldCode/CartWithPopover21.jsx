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

  // console.log(mergedCart);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If cart is open and click is outside the cart element
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
      <div
        ref={cartRef}
        className={`absolute  z-[100]  w-[390px] bg-white border border-gray-200 shadow-xl p-4 ${
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
    </>
  );
};

export default CartWithPopover;
