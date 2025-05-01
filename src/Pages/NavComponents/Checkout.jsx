import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    newsletter: false,
    shippingAddress: "",
    billingAddress: "",
    paymentMethod: "",
  });

  console.log(items);

  const subtotal = 50754;
  const vat = 8459;
  const discount = coupon === "DISCOUNT10" ? 0.1 * subtotal : 0;
  const total = subtotal - discount;

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
    if (currentStep === 3 && formData.billingAddress) setStep(4);
  };

  const applyCoupon = () => {
    setCouponApplied(coupon === "DISCOUNT10");
  };

  return (
    <div className="max-w-[1300px] mx-auto py-6 mb-5">
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
              <h2 className="text-2xl font-semibold mb-2">Customer</h2>
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
                  className="bg-[#e62245] text-white px-4 py-2 rounded"
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
                <Link to="/login" className="text-[#e62245] font-semibold">
                  Sign in now
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step >= 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                placeholder="Enter your shipping address"
                className="border p-2 rounded w-full mb-2"
              />
              {step === 2 && (
                <button
                  onClick={() => handleContinue(2)}
                  className="bg-[#e62245] text-white px-4 py-2 rounded"
                >
                  CONTINUE
                </button>
              )}
            </div>
          )}

          {/* Step 3: Billing */}
          {step >= 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Billing</h2>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                placeholder="Enter your billing address"
                className="border p-2 rounded w-full mb-2"
              />
              {step === 3 && (
                <button
                  onClick={() => handleContinue(3)}
                  className="bg-[#e62245] text-white px-4 py-2 rounded"
                >
                  CONTINUE
                </button>
              )}
            </div>
          )}

          {/* Step 4: Payment */}
          {step >= 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Payment</h2>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Payment Method</option>
                <option value="paypal">PayPal</option>
                <option value="credit-card">Credit Card</option>
                <option value="amazon-pay">Amazon Pay</option>
              </select>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="border rounded shadow-xl p-4 space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <Link to="/cart" className="text-[#e62245] text-sm font-semibold">
              Edit Cart
            </Link>
          </div>

          <h3 className="font-medium">2 Items</h3>
          {[
            {
              img: "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/100x100/products/788/4467/leica-icon-icg70-antenna__78227.1723046790.jpg?c=1",
              name: "1 x Leica iCON iCG70 GNSS RTK Rover Package",
              price: "£11,994.00",
            },
            {
              img: "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/products/832/images/4995/recon-leica-rtc360-5__65988.1697695898.1280.1280__50334.1743025571.220.290.jpg?c=1",
              name: "1 x Leica RTC360 3D Laser Scanner 2021 - Used",
              price: "£38,760.00",
            },
          ].map((item, index) => (
            <div key={index} className="flex gap-4">
              <img
                src={item.img}
                alt="Product"
                className="w-20 h-20 object-cover"
              />
              <div className="flex flex-col justify-between text-sm">
                <p className="font-semibold">{item.name}</p>
                <p>{item.price}</p>
              </div>
            </div>
          ))}

          <hr />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>£{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>--</span>
            </div>

            {/* Coupon */}
            <div className="mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon"
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={applyCoupon}
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
            </div>
          </div>

          <hr />
          <div className="flex justify-between text-xl font-semibold">
            <span>Total (GBP)</span>
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
