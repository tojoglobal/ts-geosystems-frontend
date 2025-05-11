import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useProductsByIdsQuery from "../../Hooks/useProductsByIdsQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { selectMergedCart } from "../../utils/selectMergedCart";
import { clearCart, clearCoupon } from "../../features/AddToCart/AddToCart";

const Checkout = () => {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, coupon, totalQuantity } = useSelector((state) => state.cart);
  const [step, setStep] = useState(1);
  // const [coupon, setCoupon] = useState("");
  const [shippingCost, setShippingCost] = useState(5.99);
  // const [couponApplied, setCouponApplied] = useState(false);
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

  // get a cart product
  const productIds = useMemo(() => items.map((item) => item.id), [items]);
  const { products } = useProductsByIdsQuery(productIds);

  const mergedCart = useSelector((state) => selectMergedCart(state, products));

  const subtotal = mergedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const vat = mergedCart.reduce((total, item) => total + item.totalVat, 0);
  let discount = 0;
  if (coupon && coupon.code_name) {
    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.discount) / 100;
    } else if (coupon.type === "flat") {
      discount = coupon.discount;
    }
  }
  const total = subtotal + vat + shippingCost - discount;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleContinue = (currentStep) => {
    if (currentStep === 1 && formData.email) setStep(2);
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
      coupon: coupon?.code_name || null,
      shipping_cost: shippingCost || null,
      total,
    };

    const sslPaymentInfo = {
      total_amount: total,
      shippingCost: shippingCost,
      order_id: newOrderId,
      productIds: productIds,
      customer_name: formData.shippingName,
      customer_email: formData.email,
      customer_phone: formData.shippingPhone,
      shipping_address: formData.shippingAddress,
      shipping_city: formData.shippingCity,
      shipping_zip: formData.shippingZip,
      items: mergedCart.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
      coupon: coupon || null,
    };

    if (formData.paymentMethod === "sslcommerz") {
      try {
        // Save order with status "pending"
        const saveRes = await axiosPublicUrl.post("/api/orderdata", orderData);

        if (saveRes.status === 200 || saveRes.status === 201) {
          // Trigger SSLCommerz payment
          const paymentInitRes = await axiosPublicUrl.post(
            "/api/ssl-payment/init",
            sslPaymentInfo
          );

          if (paymentInitRes.data?.GatewayPageURL) {
            console.log(paymentInitRes.data.GatewayPageURL);
            window.location.href = paymentInitRes.data.GatewayPageURL;
          } else {
            toast.error("Failed to initiate payment");
          }
        } else {
          toast.error("Failed to save order before payment");
        }
      } catch (err) {
        console.error("SSLCommerz Payment Error:", err);
        Swal.fire({
          icon: "error",
          text: "An error occurred while starting payment.",
          confirmButtonColor: "#ef4444",
        });
      }
    } else if (formData.paymentMethod === "bank") {
      try {
        const res = await axiosPublicUrl.post("/api/orderdata", orderData);
        if (res.status === 200 || res.status === 201) {
          setOrderPlaced(true); // Show thank-you page etc.
          // Order was successful
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
          to="/shop"
          className="inline-block bg-[#e62245] text-white px-6 py-2 rounded"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1370px] mx-auto py-6 mb-5">
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-8">
          {/* Express Checkout Buttons */}
          <div>
            <p className="text-sm mb-2">Check out faster with:</p>
            <div className="flex gap-2 mb-2">
              <button className="flex-1 bg-[#ffc439] py-2 rounded flex items-center justify-center gap-2">
                <img src="/paypal.svg" alt="PayPal" className="h-5" />
                <span className="font-semibold">PayPal</span>
              </button>
              <button className="flex-1 bg-[#f7dfa5] py-2 rounded flex items-center justify-center gap-1">
                <span>Pay with</span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                  alt="Amazon"
                  className="h-4"
                />
              </button>
            </div>
            <p className="text-xs text-center uppercase text-gray-700 font-bold">
              Use your Amazon account
            </p>
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="border p-2 rounded flex-grow"
                />
                <button
                  onClick={() => handleContinue(1)}
                  className="bg-[#e62245] cursor-pointer text-white px-4 py-2 rounded"
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
                />
                <label>Subscribe to our newsletter</label>
              </div>
              <p className="text-sm mt-2">
                Already have an account?{" "}
                <Link to="/user/login" className="text-[#e62245] font-semibold">
                  Sign in now
                </Link>
              </p>
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
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="shippingPhone"
                    value={formData.shippingPhone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="border p-2 rounded"
                  />
                </div>

                <textarea
                  name="shippingComments"
                  value={formData.shippingComments}
                  onChange={handleInputChange}
                  placeholder="Order Comments"
                  className="border p-2 rounded w-full mb-4"
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
                    className="bg-[#e62245] cursor-pointer text-white px-4 py-2 rounded"
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
                  className="border p-2 rounded w-full mb-4"
                >
                  <option value="">Select Payment Method</option>
                  <option value="sslcommerz">SSLCOMMERZ Payment Gateway</option>
                  <option value="bank">Bank Deposit</option>
                </select>

                <button
                  onClick={handlePlaceOrder}
                  className="bg-[#e62245] text-white px-4 py-2 rounded"
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
                    className="bg-blue-600 text-white px-3 py-2 rounded"
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
        <div className="border  rounded shadow-xl p-4 space-y-4">
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
                  <p>{item.price}</p>
                </div>
              ))}
            </>
          )}

          <hr />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>£{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>£{shippingCost}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>VAT</span>
              <span>£{vat.toLocaleString()}</span>
            </div> */}
            {coupon?.code_name && (
              <div className="flex justify-between text-green-600">
                <span>Discount:({coupon?.code_name})</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>
            )}

            {/* Coupon */}
            {/* <div className="mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon"
                  className="border p-1 rounded flex-1"
                />
                <button
                  // onClick={applyCoupon}
                  onClick={handleApplyCoupon}
                  className="bg-[#e62245] text-white px-2 py-1 rounded"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-green-600 text-xs mt-1">
                  Coupon applied: 10% off
                </p>
              )}
            </div> */}
          </div>

          <hr />
          <div className="flex justify-between text-xl font-semibold">
            <span>Total</span>
            <span>
              £{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>

          <hr />
          <div className="text-sm">
            <p className="font-semibold mb-1">TAX INCLUDED IN TOTAL:</p>
            <div className="flex justify-between">
              <span>VAT</span>
              <span>£{vat.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
