import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { clearCart, clearCoupon } from "../../features/AddToCart/AddToCart";
import useToastSwal from "../../Hooks/useToastSwal";
import { useVatEnabled } from "../../Hooks/useVatEnabled";

// Accessibility
Modal.setAppElement("#root");

const modalStyles = {
  content: {
    maxWidth: "1150px",
    width: "98%",
    borderRadius: "18px",
    border: "none",
    top: "48%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "0",
    background: "white",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 12px 40px 0 rgba(0,0,0,0.20)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  overlay: {
    backgroundColor: "rgba(24,30,37,0.86)",
    zIndex: "1000",
  },
};

// Set your site-wide VAT rate here (e.g. 15% VAT)
const DEFAULT_VAT_RATE = 0.15;

export default function GetQuotationModal({ isOpen, onRequestClose, product }) {
  const axiosPublicUrl = useAxiospublic();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToastSwal();
  const { user, isAuth } = useSelector((state) => state.authUser);

  // Modal specific states
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    email: user?.email || "",
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

  // For VAT and price calculation (from API)
  const { data: vatEnabled = true } = useVatEnabled();
  const [shippingCost] = useState(5.99);

  // The "cart" will be only this product (quotation is for single product, quantity 1)
  const mergedCart = useMemo(
    () =>
      product
        ? [
            {
              ...product,
              quantity: 1,
            },
          ]
        : [],
    [product]
  );

  // Subtotal
  const subtotal = mergedCart.reduce(
    (total, item) => total + (parseFloat(item.price) || 0) * item.quantity,
    0
  );

  // Calculate VAT per product with fallback to default rate
  const vat = useMemo(() => {
    if (!vatEnabled) return 0;
    return mergedCart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      let vatRate = DEFAULT_VAT_RATE;
      // If product has a tax property (e.g. {value: 15}), use that percentage
      if (item.tax && item.tax.value) {
        vatRate = parseFloat(item.tax.value) / 100;
      }
      return total + price * vatRate * item.quantity;
    }, 0);
  }, [mergedCart, vatEnabled]);

  let discount = 0; // Add coupon support if you wish
  const total = subtotal + (vatEnabled ? vat : 0) + shippingCost - discount;

  // Steps logic
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinue = (currentStep) => {
    if (currentStep === 1) {
      if ((isAuth && user) || formData.email) {
        setFormData((prev) => ({
          ...prev,
          email: isAuth && user ? user.email : formData.email,
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

  // Place order logic (SSLCOMMERZ or Bank, like Checkout)
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
      coupon: null,
      shipping_cost: shippingCost || null,
      total,
    };

    const sslPaymentInfo = {
      total_amount: total,
      shippingCost: shippingCost,
      order_id: newOrderId,
      productIds: [product.id],
      customer_name: formData.shippingName,
      customer_email: formData.email,
      customer_phone: formData.shippingPhone,
      shipping_address: formData.shippingAddress,
      shipping_city: formData.shippingCity,
      shipping_zip: formData.shippingZip,
      items: [
        {
          id: product.id,
          price: product.price,
          quantity: 1,
        },
      ],
      coupon: null,
      vatEnabled,
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
          setOrderPlaced(true);
          dispatch(clearCart());
          dispatch(clearCoupon());
          onRequestClose();
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

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setOrderPlaced(false);
      setOrderId(null);
      setFormData({
        email: user?.email || "",
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
    }
    // eslint-disable-next-line
  }, [isOpen]);

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Get Quotation Modal"
      closeTimeoutMS={200}
    >
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-[#e62245]">
            Get Quotation & Checkout
          </h2>
          <button
            className="text-gray-800 cursor-pointer text-2xl font-bold hover:text-[#e62245]"
            onClick={onRequestClose}
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Form Steps */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            {/* Step 1: Customer */}
            {step >= 1 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer</h3>
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
                    className="bg-[#e62245] cursor-pointer text-white px-4 py-2 rounded"
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
            {step >= 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Shipping</h3>
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
              </div>
            )}

            <hr className="flex-grow border-gray-300" />
            {/* Step 3: Billing */}
            {step >= 3 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Billing</h3>
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
              </div>
            )}

            <hr className="flex-grow border-gray-300" />
            {/* Step 4: Payment */}
            {step >= 4 && !orderPlaced && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Payment</h3>
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
                  className="bg-[#e62245] cursor-pointer text-white px-4 py-2 rounded"
                >
                  Place Order
                </button>
              </div>
            )}

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
          <div className="border rounded shadow-xl p-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <span className="text-[#e62245] text-sm font-semibold">
                Quotation
              </span>
            </div>
            <h3 className="font-medium">1 Item</h3>
            <div className="flex gap-3 ">
              <img
                src={
                  product?.image_urls
                    ? `${import.meta.env.VITE_OPEN_APIURL}${
                        JSON.parse(product.image_urls)[0]
                      }`
                    : "/placeholder.jpg"
                }
                alt={product.product_name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex flex-col justify-between text-sm">
                <p className="font-semibold text-charcoal">
                  <span>1 x</span> {product.product_name}
                </p>
              </div>
              <p>{product.price}</p>
            </div>
            <hr />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{shippingCost}</span>
              </div>
              {vatEnabled && (
                <div className="flex justify-between">
                  <span>VAT</span>
                  <span>
                    ৳
                    {vat > 0
                      ? vat.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : "0"}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-৳{discount.toFixed(2)}</span>
              </div>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-semibold">
              <span>Total</span>
              <span>
                ৳{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <hr />
            {vatEnabled && (
              <div className="text-sm">
                <p className="font-semibold mb-1">TAX INCLUDED IN TOTAL:</p>
                <div className="flex justify-between">
                  <span>VAT</span>
                  <span>
                    ৳
                    {vat > 0
                      ? vat.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : "0"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
