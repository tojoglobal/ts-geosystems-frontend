import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import useProductsByIdsQuery from "../../Hooks/useProductsByIdsQuery";
import {
  removeFromCart,
  updateQuantity,
} from "../../features/AddToCart/AddToCart";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const Cart = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [shippingCost, setShippingCost] = useState(5.99);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    country: "",
    city: "",
    zip: "",
  });
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");

  const estimateShippingCost = () => {
    if (shippingInfo.country && shippingInfo.zip) {
      setShippingCost(190.79); // Example from your screenshot
      Swal.fire("Shipping Estimated", "Estimated cost: £190.79", "success");
    }
  };

  const productIds = useMemo(() => items.map((item) => item.id), [items]);
  const { products, loading } = useProductsByIdsQuery(productIds);

  const mergedCart = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      const rawPrice = product?.price || "0";
      const numericPrice = Number(rawPrice.toString().replace(/,/g, "")); // Clean commas
      return product
        ? {
            ...product,
            quantity: item.quantity,
            price: numericPrice,
          }
        : null;
    })
    .filter(Boolean);

  const handleQuantityChange = (id, delta) => {
    dispatch(updateQuantity({ id, amount: delta }));
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This item will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e62245",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(id));
        Swal.fire("Removed!", "Item removed from cart.", "success");
      }
    });
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await axiosPublicUrl.post("api/promocode", {
        code_name: couponInput.trim(),
      });

      if (!res.data) {
        const error = await res.json();
        Swal.fire("Invalid", error.message, "Your Coupon is in valid");
        setCoupon("");
        return;
      }
      const data = res.data;
      console.log(data);
      setCoupon(data);
      Swal.fire("Success", `Coupon "${data.code_name}" applied!`, "success");
    } catch (err) {
      console.error(err);
      setCoupon("");
      // Swal.fire("Error", "Your Coupon is invalid", "error");
    }
  };

  const subTotal = mergedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const vat = subTotal * 0.2;
  // const discount = coupon === "DISCOUNT10" ? subTotal * 0.1 : 0;
  let discount = 0;
  if (coupon && coupon.code_name) {
    if (coupon.type === "percentage") {
      discount = (subTotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discount = coupon.discount;
    }
  }

  const grandTotal = subTotal + vat + shippingCost - discount;

  console.log(products);
  return (
    <div className="p-3">
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
          <h1 className="text-3xl mb-4">
            Your Cart ({mergedCart.length} Items)
          </h1>
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Item</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
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
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                    </div>
                  </td>
                  <td>£{item?.price.toFixed(2)}</td>
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
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <p>£{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500"
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
          <div className="max-w-lg ml-auto p-4 rounded space-y-4">
            {/* Totals */}
            <div className="flex justify-between mb-2 border-b pb-2">
              <span>Subtotal:</span>
              <span>£{subTotal.toFixed(2)}</span>
            </div>
            {/* Coupon Section */}
            <div className="mb-2 border-b pb-2">
              <label className="mb-1 text-base font-medium flex justify-between cursor-pointer">
                Coupon Code:
                {!showCouponInput ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="text-[#e62245] ml-2 underline text-sm"
                  >
                    Show Coupon
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCouponInput(false)}
                    className="text-gray-500 ml-2 underline text-sm"
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
                      // onClick={() => setCoupon(couponInput)}
                      onClick={handleApplyCoupon}
                      className="bg-[#e62245] text-white py-2 px-3 mt-2 rounded"
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
                            : `£${coupon.discount} off`}
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

            <div className="flex justify-between mb-2 border-b pb-2">
              <span>VAT (20%):</span>
              <span>£{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 border-b pb-2">
              <span>Shipping:</span>
              <span>£{shippingCost.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 border-b pb-2 text-green-600">
                <span>Discount:</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold">
              <span>Grand Total:</span>
              <span>£{grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-end mt-5">
              <Link to="/checkout">
                <button className="bg-[#e62245] text-white py-2 px-6 rounded">
                  CHECKOUT
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
