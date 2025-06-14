import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import useProductsByIdsQuery from "../../Hooks/useProductsByIdsQuery";
import {
  clearCoupon,
  removeFromCart,
  setCoupon,
  updateQuantity,
} from "../../features/AddToCart/AddToCart";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { selectMergedCart } from "../../utils/selectMergedCart";
import useToastSwal from "../../Hooks/useToastSwal";
import { useVatEnabled } from "../../Hooks/useVatEnabled";

const Cart = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const showToast = useToastSwal();
  const { data: vatEnabled = true } = useVatEnabled();
  const { items, coupon } = useSelector((state) => state.cart);
  const [shippingCost, setShippingCost] = useState(5.99);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    country: "",
    city: "",
    zip: "",
  });
  const [couponInput, setCouponInput] = useState("");

  const estimateShippingCost = () => {
    if (shippingInfo.country && shippingInfo.zip) {
      setShippingCost(190.79); // Example from your screenshot
      showToast("Success", "Shipping Estimated", "Estimated cost: ৳190.79");
    }
  };

  const productIds = useMemo(() => items.map((item) => item.id), [items]);
  const { products } = useProductsByIdsQuery(productIds);

  const mergedCart = useSelector((state) => selectMergedCart(state, products));

  const handleQuantityChange = (id, delta) => {
    dispatch(updateQuantity({ id, amount: delta }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    showToast("success", "Removed!", "Item removed from cart.");
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await axiosPublicUrl.post("api/promocode", {
        code_name: couponInput.trim(),
      });

      if (!res.data) {
        const error = await res.json();
        showToast("error", "Your Coupon is in valid", error.message);
        dispatch(clearCoupon());
        return;
      }
      const data = res.data;
      dispatch(setCoupon(data));
      showToast("Success", "success", `Coupon "${data.code_name}" applied!`);
    } catch (err) {
      console.error(err);
      dispatch(clearCoupon());
      showToast(
        "error",
        "error",
        "An error occurred while applying the coupon"
      );
    }
  };

  const subTotal = mergedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const vat = mergedCart.reduce((total, item) => total + item.totalVat, 0);
  let discount = 0;
  if (coupon && coupon.code_name) {
    if (coupon.type === "percentage") {
      discount = (subTotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discount = coupon.discount;
    }
  }

  const grandTotal =
    subTotal + (vatEnabled ? vat : 0) + shippingCost - discount;

  return (
    <div className="md:p-2">
      <div className="flex items-center gap-2 text-xs mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Your Cart</span>
      </div>
      {mergedCart.length === 0 ? (
        <p className="text-xl">Your cart is empty.</p>
      ) : (
        <>
          <h1 className="text-xl md:text-3xl mb-4">
            Your Cart ({mergedCart.length} Items)
          </h1>
          <table className="w-full border-collapse mb-6 hidden md:table">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Image</th>
                <th className="py-2">Item Name</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
                {vatEnabled && <th className="py-2">Vat</th>}
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {mergedCart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="flex items-center gap-4 py-4">
                    <img
                      src={
                        item.image_urls
                          ? `${import.meta.env.VITE_OPEN_APIURL}${
                              JSON.parse(item.image_urls)[0]
                            }`
                          : "/placeholder.jpg"
                      }
                      alt={item.product_name}
                      className="w-20 h-20 object-contain"
                    />
                    {/* <div></div> */}
                  </td>
                  <td className="w-2xs">
                    <p className="font-medium pr-3">{item.product_name}</p>
                  </td>
                  <td>৳{item?.price.toFixed(2)}</td>
                  <td>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-2 border rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-2 border rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  {vatEnabled && <td>৳{item?.totalVat.toFixed(2)}</td>}
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <p>৳{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 cursor-pointer"
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Coupon and Shipping */}
          <div className="max-w-lg ml-auto p-2 md:p-4 rounded space-y-4">
            {/* Totals */}
            <div className="flex justify-between mb-2 border-b pb-2">
              <span>Subtotal:</span>
              <span>৳{subTotal.toFixed(2)}</span>
            </div>
            {vatEnabled && (
              <div className="flex justify-between mb-2 border-b pb-2">
                <span>VAT:</span>
                <span>৳{vat.toFixed(2)}</span>
              </div>
            )}
            {/* Coupon Section */}
            <div className="mb-2 border-b pb-2">
              <label className="mb-1 text-base font-medium flex justify-between cursor-pointer">
                Coupon Code:
                {!showCouponInput ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="text-[#e62245] cursor-pointer ml-2 underline text-sm"
                  >
                    Show Coupon
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCouponInput(false)}
                    className="text-gray-500 cursor-pointer ml-2 underline text-sm"
                  >
                    Cancel
                  </button>
                )}
              </label>
              {showCouponInput && (
                <>
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter your coupon code"
                      className="w-full px-3 py-2 border rounded mt-2"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-[#e62245] cursor-pointer text-white py-2 px-3 mt-2 rounded"
                    >
                      APPLY
                    </button>
                  </div>
                  {couponInput && (
                    <>
                      {coupon && coupon.code_name === couponInput.trim() ? (
                        <p className="text-green-600 text-sm mt-1">
                          Valid coupon code:{" "}
                          {coupon.type === "percentage"
                            ? `${coupon.discount}% off`
                            : `৳${coupon.discount} off`}
                        </p>
                      ) : (
                        <p className="text-red-600 text-sm mt-1">
                          Invalid coupon code
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Shipping Section */}

            {/* <div className="mb-2 border-b pb-2">
              <label className="mb-1 text-base font-medium flex justify-between cursor-pointer">
                Shipping:
                {!showShippingForm ? (
                  <button
                    onClick={() => setShowShippingForm(true)}
                    className="text-[#e62245] ml-2 underline text-sm"
                  >
                    Estimate Shipping
                  </button>
                ) : (
                  <button
                    onClick={() => setShowShippingForm(false)}
                    className="text-gray-500 ml-2 underline text-sm"
                  >
                    Cancel
                  </button>
                )}
              </label>

              {showShippingForm && (
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full px-3 py-2 border rounded"
                    value={shippingInfo.country}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        country: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-3 py-2 border rounded"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className="w-full px-3 py-2 border rounded"
                    value={shippingInfo.zip}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, zip: e.target.value })
                    }
                  />
                  <button
                    onClick={estimateShippingCost}
                    className="bg-[#e62245] text-white py-2 px-4 rounded"
                  >
                    Estimate Shipping
                  </button>
                </div>
              )}
            </div> */}

            {vatEnabled && (
              <div className="flex justify-between mb-2 border-b pb-2">
                <span>VAT:</span>
                <span>৳{vat.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-2 border-b pb-2">
              <span>Shipping:</span>
              <span>৳{shippingCost.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 border-b pb-2 text-green-600">
                <span>Discount:</span>
                <span>-৳{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold">
              <span>Grand Total:</span>
              <span>৳{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-end mt-5">
              <Link to="/checkout">
                <button className="bg-[#e62245] cursor-pointer text-white py-2 px-6 rounded">
                  CHECKOUT
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
      {/* Mobile Cart View */}
      <div className="md:hidden space-y-4 mt-2">
        {mergedCart.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-3 flex flex-col sm:flex-row gap-4 shadow-sm"
          >
            <img
              src={
                item.image_urls
                  ? `${import.meta.env.VITE_OPEN_APIURL}${
                      JSON.parse(item.image_urls)[0]
                    }`
                  : "/placeholder.jpg"
              }
              alt={item.product_name}
              className="w-24 h-24 object-contain mx-auto sm:mx-0"
            />

            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-base">{item.product_name}</h2>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 cursor-pointer"
                >
                  <RxCross2 />
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                Price: ৳{item?.price.toFixed(2)}
              </p>
              {vatEnabled && (
                <p className="text-sm text-gray-700 mb-1">
                  VAT: ৳{item?.totalVat.toFixed(2)}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">Qty:</span>
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="px-2 py-1 border rounded hover:bg-gray-200 text-sm"
                >
                  -
                </button>
                <span className="px-2 text-sm">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-2 py-1 border rounded hover:bg-gray-200 text-sm"
                >
                  +
                </button>
              </div>

              <div className="mt-3 text-sm font-medium">
                Total: ৳{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
