import ssl from "/image/ssl.png";
import bank from "/image/digitalbank.jpg";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useProductsByIdsQuery from "../../Hooks/useProductsByIdsQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { selectMergedCart } from "../../utils/selectMergedCart";
import { clearCart, clearCoupon } from "../../features/AddToCart/AddToCart";
import useToastSwal from "../../Hooks/useToastSwal";
import { useVatEnabled } from "../../Hooks/useVatEnabled";
import { formatBDT } from "../../utils/formatBDT";

const Checkout = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToastSwal();
  const { items, coupon, totalQuantity, shipping } = useSelector(
    (state) => state.cart
  );
  const { user, isAuth } = useSelector((state) => state.authUser);
  const [step, setStep] = useState(1);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    newsletter: false,
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingZip: "",
    shippingPhone: "",
    shippingComments: "",
    billingSameAsShipping: true,
    billingAddress: "",
    paymentMethod: "",
  });

  // VAT toggle from global
  const { data: vatEnabled = true } = useVatEnabled();

  // get a cart product
  const productIds = useMemo(() => items.map((item) => item.id), [items]);
  const { products } = useProductsByIdsQuery(productIds);

  const mergedCart = useSelector((state) => selectMergedCart(state, products));
  // Use the shipping from the cart state if available
  const shippingCost =
    shipping && shipping.amount ? parseFloat(shipping.amount) : 100;

  // Do NOT do custom VAT exclusion here, let backend decide!
  const subtotal = mergedCart.reduce(
    (total, item) => total + item.priceIncVat * item.quantity,
    0
  );

  const vat = mergedCart.reduce((total, item) => total + item?.vat, 0);

  let discount = 0;
  if (coupon && coupon.code_name) {
    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discount = coupon.discount;
    }
  }
  const total = subtotal + shippingCost - discount;

  // Set email if user is authenticated
  useEffect(() => {
    if (user && isAuth) {
      setFormData((prev) => ({ ...prev, email: user?.email }));
    }
  }, [user, isAuth]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleContinue = (currentStep) => {
    if (currentStep === 1) {
      if ((user && isAuth) || formData.email) {
        setFormData((prev) => ({
          ...prev,
          email: user && isAuth ? user.email : formData.email,
        }));
        setStep(2);
      }
      return;
    }
    if (currentStep === 2 && formData.shippingAddress) setStep(3);
    if (currentStep === 3) {
      if (formData.billingSameAsShipping) {
        setFormData((prev) => ({
          ...prev,
          billingAddress: `${prev.shippingAddress}, ${prev.shippingCity}, ${prev.shippingZip}`,
        }));
      }
      setStep(4);
    }
  };

  const handlePlaceOrder = async () => {
    const newOrderId = "TSGB" + Date.now();
    setOrderId(newOrderId);
    const orderData = {
      order_id: newOrderId,
      email: formData.email,
      shippingName: formData.shippingName,
      shippingAddress: formData.shippingAddress,
      shippingCity: formData.shippingCity,
      shippingZip: formData.shippingZip,
      shippingPhone: formData.shippingPhone,
      shippingComments: formData.shippingComments,
      billingAddress: formData.billingSameAsShipping
        ? `${formData.shippingAddress}, ${formData.shippingCity}, ${formData.shippingZip}`
        : formData.billingAddress,
      paymentMethod: formData.paymentMethod,
      paymentStatus: "pending",
      items: mergedCart,
      coupon: coupon || null,
      shipping_cost: shippingCost || null,
      total,
    };

    const _items = mergedCart.map((item) => item);

    const sslPaymentInfo = {
      total_amount: total,
      order_id: newOrderId,
      productIds: productIds,
      customer_name: formData.shippingName,
      customer_email: formData.email,
      customer_phone: formData.shippingPhone,
      shipping_address: formData.shippingAddress,
      shipping_city: formData.shippingCity,
      shipping_zip: formData.shippingZip,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        options: item.options.map((opt) => opt.id),
      })),
      shippingCost,
      coupon: coupon ? coupon.code_name : null,
      vatEnabled,
      paymentMethod: formData.paymentMethod,
    };

    if (formData.paymentMethod === "sslcommerz") {
      try {
        const saveRes = await axiosPublicUrl.post("/api/orderdata", orderData);

        if (saveRes.status === 200 || saveRes.status === 201) {
          const paymentInitRes = await axiosPublicUrl.post(
            "/api/ssl-payment/init",
            sslPaymentInfo
          );

          if (paymentInitRes.data?.GatewayPageURL) {
            window.location.href = paymentInitRes.data.GatewayPageURL;
          } else {
            showToast("error", "Failed to initiate payment");
          }
        } else {
          showToast("error", "Failed to save order before payment");
        }
      } catch (err) {
        console.error("SSLCommerz Payment Error:", err);
        showToast("error", "An error occurred while starting payment.");
      }
    } else if (formData.paymentMethod === "bank") {
      try {
        const res = await axiosPublicUrl.post("/api/orderdata", orderData);
        if (res.status === 200 || res.status === 201) {
          setOrderPlaced(true); // Show thank-you page etc.
          dispatch(clearCart());
          dispatch(clearCoupon());
          navigate("");
        } else {
          alert("Failed to place order.");
        }
      } catch (error) {
        console.error("Bank payment order error:", error);
        alert("An error occurred while placing the order.");
      }
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Your cart is empty.
        </p>
        <Link
          to="/shop-all"
          className="inline-block bg-[#e62245] text-white px-6 py-2 rounded cursor-pointer"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto py-6 mb-5 px-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          {/* Express Checkout Buttons */}
          <div>
            <p className="text-sm mb-2">Check out faster with:</p>
            <div className="flex gap-2 mb-2">
              <button className="flex-1 bg-[#f7dfa5] py-2 rounded flex items-center justify-center gap-1 cursor-pointer">
                <span>Pay with</span>
                <img src={ssl} alt="Amazon" className="h-6" />
              </button>
              <button className="flex-1 bg-[#f7dfa5] py-2 rounded flex items-center justify-center gap-1 cursor-pointer">
                <span>Pay with</span>
                <img src={bank} alt="Digital Bank" className="h-6 ml-[2px]" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-xs">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          {/* Step 1: Customer */}
          {step >= 1 && (
            <div>
              <h2 className="text-2xl text-charcoal font-normal mb-2">
                Customer
              </h2>
              <div className="flex w-2/3 gap-4 mb-3">
                <input
                  type="email"
                  name="email"
                  value={isAuth && user ? user?.email : formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  readOnly={!!(user && isAuth)}
                  className="border p-2 rounded flex-grow"
                />
                <button
                  onClick={() => handleContinue(1)}
                  className="bg-[#e62245] text-white px-4 py-2 rounded cursor-pointer"
                  disabled={!((user && isAuth) || formData.email)}
                >
                  CONTINUE
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                />
                <label>Subscribe to our newsletter</label>
              </div>
              {!isAuth && (
                <p className="text-sm mt-2">
                  Already have an account?{" "}
                  <Link
                    to="/user/login"
                    className="text-[#e62245] font-semibold"
                  >
                    Sign in now
                  </Link>
                </p>
              )}
              {user && isAuth && (
                <div className="text-green-700 text-sm mt-2">
                  Logged in as <strong>{user.email}</strong>
                </div>
              )}
            </div>
          )}

          <hr className="flex-grow border-gray-300" />
          {/* Step 2: Shipping */}
          <div>
            <h2 className="text-2xl  text-charcoal font-normal mb-2">
              Shipping
            </h2>
            {/* Step 2: Shipping Info */}
            {step >= 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="border p-2 rounded-sm focus:outline-none focus:border focus:border-gray-400"
                  />
                  <input
                    type="text"
                    name="shippingPhone"
                    value={formData.shippingPhone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="border p-2 rounded-sm focus:outline-none focus:border focus:border-gray-400"
                  />
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="border p-2 rounded-sm focus:outline-none focus:border focus:border-gray-400"
                  />
                  <input
                    type="text"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="border p-2 rounded-sm focus:outline-none focus:border focus:border-gray-400"
                  />
                  <input
                    type="text"
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="border p-2 rounded-sm focus:outline-none focus:border focus:border-gray-400"
                  />
                </div>

                <textarea
                  name="shippingComments"
                  value={formData.shippingComments}
                  onChange={handleInputChange}
                  placeholder="Order Comments"
                  className="border p-2 mb-4 w-full rounded-sm focus:outline-none focus:border focus:border-gray-400"
                />

                <button
                  onClick={() => handleContinue(2)}
                  className="bg-[#e62245] cursor-pointer text-white px-4 py-2 rounded"
                >
                  CONTINUE
                </button>
              </>
            )}
          </div>
          <hr className="flex-grow border-gray-300" />
          {/* Step 3: Billing */}
          <div>
            <h2 className="text-2xl  text-charcoal font-normal mb-2">
              Billing
            </h2>
            {step >= 3 && (
              <>
                <div className="mb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="billingSameAsShipping"
                      checked={formData.billingSameAsShipping}
                      onChange={handleInputChange}
                      className="cursor-pointer"
                    />
                    Billing address is same as shipping address
                  </label>
                </div>

                {!formData.billingSameAsShipping && (
                  <textarea
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your billing address"
                    className="border p-2 rounded w-full mb-2"
                  />
                )}

                {step === 3 && (
                  <button
                    onClick={() => handleContinue(3)}
                    className="bg-[#e62245] text-white px-4 py-2 rounded cursor-pointer"
                  >
                    CONTINUE
                  </button>
                )}
              </>
            )}
          </div>
          <hr className="flex-grow border-gray-300" />
          {/* Step 4: Payment */}
          <div>
            <h2 className="text-2xl  text-charcoal font-normal mb-2">
              Payment
            </h2>
            {step >= 4 && !orderPlaced && (
              <>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full mb-4 cursor-pointer"
                >
                  <option value="">Select Payment Method</option>
                  <option value="sslcommerz">SSLCOMMERZ Payment Gateway</option>
                  <option value="bank">Bank Deposit</option>
                </select>

                <button
                  onClick={handlePlaceOrder}
                  className="bg-[#e62245] text-white px-4 py-2 rounded cursor-pointer"
                >
                  Place Order
                </button>
              </>
            )}
          </div>

          {orderPlaced && (
            <div className="border p-4 mt-4 bg-green-50 rounded">
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Thank you for your order!
              </h2>
              <p className="mb-2">
                Order ID: <strong>{orderId}</strong>
              </p>

              {formData.paymentMethod === "sslcommerz" && (
                <div className="space-y-2">
                  <p>Payment completed via SSLCOMMERZ.</p>
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-3 py-2 rounded cursor-pointer"
                  >
                    Print Invoice
                  </button>
                </div>
              )}

              {formData.paymentMethod === "bank" && (
                <div className="space-y-2">
                  <p>Please deposit to the following bank account:</p>
                  <ul className="text-sm list-disc pl-5">
                    <li>Bank: ABC Bank Ltd.</li>
                    <li>Account Name: MyCompany Ltd.</li>
                    <li>Account Number: 123456789</li>
                    <li>Branch: Banani, Dhaka</li>
                  </ul>
                  <p className="text-red-600">
                    Make sure to mention your Order ID as payment reference.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div>
          <div className="space-y-4 shadow-lg border rounded p-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <Link to="/cart" className="text-[#e62245] text-sm font-semibold">
                Edit Cart
              </Link>
            </div>

            <h3 className="font-medium">{totalQuantity} Items</h3>
            {mergedCart.length === 0 ? (
              <p className="text-xl">Your cart is empty.</p>
            ) : (
              <>
                {mergedCart.map((item, index) => (
                  <div key={index} className="flex gap-3 ">
                    <img
                      src={
                        item.image_urls
                          ? `${import.meta.env.VITE_OPEN_APIURL}${
                              JSON.parse(item.image_urls)[0]
                            }`
                          : "/placeholder.jpg"
                      }
                      alt={item.product_name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex flex-col justify-between text-sm">
                      <p className="font-semibold text-charcoal">
                        <span>{item.quantity}</span>{" "}
                        <span className="px-1">x</span> {item.product_name}
                      </p>
                    </div>
                    <p>৳{formatBDT(item?.totalPrice)}</p>
                  </div>
                ))}
              </>
            )}
            <hr />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{formatBDT(shippingCost)}</span>
              </div>
              {vatEnabled && (
                <div className="flex justify-between">
                  <span>VAT</span>
                  <span>৳{formatBDT(vat)}</span>
                </div>
              )}

              {coupon?.code_name && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:({coupon?.code_name})</span>
                  <span>-৳{formatBDT(discount)}</span>
                </div>
              )}
            </div>

            <hr />
            <div className="flex justify-between text-xl font-semibold">
              <span>Total</span>
              <span>৳{formatBDT(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
