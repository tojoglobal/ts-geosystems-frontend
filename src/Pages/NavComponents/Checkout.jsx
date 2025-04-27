import { Link } from "react-router-dom";
import { useState } from "react";

const Checkout = () => {
  const [formData, setFormData] = useState({
    email: "",
    newsletter: false,
    shippingAddress: "",
    billingAddress: "",
    paymentMethod: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Send formData to backend or API
    console.log("Form Data Submitted: ", formData);
    // Example: fetch("/api/checkout", { method: "POST", body: JSON.stringify(formData) })
  };

  return (
    <div className="max-w-[1300px] mx-auto py-6 mb-5">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-8">
          <div className="mb-6">
            <p className="text-sm mb-2">Check out faster with:</p>
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex gap-2">
                <button className="flex-1 bg-[#ffc439] text-black py-2 rounded flex items-center justify-center gap-2">
                  <img src="/paypal.svg" alt="PayPal" className="h-5" />
                  <span className="font-semibold">Checkout</span>
                </button>
                <button className="flex-1 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-black py-2 rounded flex items-center justify-center gap-1">
                  <span className="font-semibold">Pay with</span>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                    alt="Amazon"
                    className="h-4"
                  />
                  <span className="text-xl">➔</span>
                </button>
              </div>
              <div className="flex">
                <div className="flex-1"></div>
                <div className="flex-1 flex justify-center">
                  <span className="text-center text-xs font-bold uppercase text-gray-700">
                    Use your Amazon account
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 text-xs">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Customer</h2>
            <label>Email</label>
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
                onClick={handleSubmit}
                className="bg-[#e62245] text-white font-semibold px-4 py-2 rounded"
              >
                CONTINUE
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              <label htmlFor="newsletter" className="text-sm">
                Subscribe to our newsletter.
              </label>
            </div>
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#e62245] font-semibold">
                Sign in now
              </Link>
            </p>
          </div>
          <hr className="border-gray-300" />
          <div>
            <h2 className="text-2xl mb-4">Shipping</h2>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Enter your shipping address"
              className="border p-2 rounded w-full"
            />
          </div>
          <hr className="border-gray-300" />
          <div>
            <h2 className="text-2xl mb-4">Billing</h2>
            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Enter your billing address"
              className="border p-2 rounded w-full"
            />
          </div>
          <hr className="border-gray-300" />
          <div>
            <h2 className="text-2xl mb-4">Payment</h2>
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
        </div>
        {/* Right side - Order Summary */}
        <div className="border rounded shadow-xl">
          <div className="flex justify-between items-center mb-4 border-b pb-4 p-4">
            <h2 className="text-lg">Order Summary</h2>
            <Link to="/cart" className="text-[#e62245] text-sm font-semibold">
              Edit Cart
            </Link>
          </div>
          {/* Products */}
          <div className="space-y-4 mb-4 px-4 py-3">
            <h1 className="font-semibold">2 Items</h1>
            <div className="flex gap-4">
              <img
                src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/100x100/products/788/4467/leica-icon-icg70-antenna__78227.1723046790.jpg?c=1"
                alt="Product 1"
                className="w-20 h-20 object-cover"
              />
              <div className="flex justify-between text-sm">
                <p className="font-semibold">
                  1 x Leica iCON iCG70 GNSS RTK Rover Package
                </p>
                <p>£11,994.00</p>
              </div>
            </div>
            {/* Product 2 */}
            <div className="flex gap-4">
              <img
                src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/products/832/images/4995/recon-leica-rtc360-5__65988.1697695898.1280.1280__50334.1743025571.220.290.jpg?c=1"
                alt="Product 2"
                className="w-20 h-20 object-cover"
              />
              <div className="flex justify-between text-sm">
                <p className="font-semibold">
                  1 x Leica RTC360 3D Laser Scanner 2021 - Used
                </p>
                <p>£38,760.00</p>
              </div>
            </div>
          </div>
          <hr className="border-gray-300 mb-4" />
          {/* Totals */}
          <div className="space-y-2 text-sm mb-4 px-4 py-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>£50,754.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>--</span>
            </div>
            <p className="text-[#e62245] text-xs">Promo/Gift Certificate</p>
          </div>
          <hr className="border-gray-300 mb-4" />
          <div className="flex justify-between text-lg mb-4 px-4 py-3">
            <span>Total (GBP)</span>
            <span className="font-semibold text-3xl">£50,754.00</span>
          </div>
          <hr className="border-gray-300 mb-3" />
          <div className="text-sm p-3">
            <p className="font-semibold mb-2">TAX INCLUDED IN TOTAL:</p>
            <div className="flex justify-between">
              <span>VAT</span>
              <span>£8,459.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
