import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useToastSwal from "../../Hooks/useToastSwal";
import { formatBDT } from "../../utils/formatBDT";

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

export default function GetQuotationModal({ isOpen, onRequestClose, product }) {
  const axiosPublicUrl = useAxiospublic();
  const showToast = useToastSwal();
  const { user } = useSelector((state) => state.authUser);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: user?.email || "",
        phone: "",
        message: "",
      });
    }
    // eslint-disable-next-line
  }, [isOpen]);

  if (!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      product_id: product.id,
      product_name: product.product_name,
      product_price: product.price,
    };

    try {
      const response = await axiosPublicUrl.post("/api/quotation", data);
      if (response.data.success) {
        showToast(
          "success",
          "Message sent successfully!",
          "We will get back to you soon. Thank you!"
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: user?.email || "",
          phone: "",
          message: "",
        });
        onRequestClose();
      }
    } catch (error) {
      showToast(
        "error",
        "Error",
        error?.response?.data?.message ||
          error.message ||
          "Failed to send message. Please try again."
      );
    }
  };

  // Try to parse product image
  let productImage = "/placeholder.jpg";
  try {
    if (product?.image_urls) {
      const imgs = JSON.parse(product.image_urls);
      if (imgs && imgs.length > 0) {
        productImage = `${import.meta.env.VITE_OPEN_APIURL}${imgs[0]}`;
      }
    }
  } catch {
    productImage = "/placeholder.jpg";
  }

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
          <h2 className="text-2xl font-bold text-[#e62245]">Get Quotation</h2>
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
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <input
                type="text"
                name="firstName"
                placeholder="First Name*"
                className="border focus:outline-none px-2 py-3 rounded border-gray-300 placeholder:text-black"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name*"
                required
                className="border focus:outline-none px-2 py-3 rounded border-gray-300 placeholder:text-black"
                value={formData.lastName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="E-mail*"
                className="border focus:outline-none px-2 py-3 rounded border-gray-300 placeholder:text-black"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone*"
                className="border focus:outline-none px-2 py-3 rounded border-gray-300 placeholder:text-black"
                value={formData.phone}
                onChange={handleChange}
              />
              <textarea
                name="message"
                required
                placeholder="Comments/Questions*"
                className="border focus:outline-none px-2 py-3 rounded md:col-span-2 border-gray-300 placeholder:text-black"
                rows={4}
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              <div className="flex justify-end md:col-span-2">
                <button
                  type="submit"
                  className="bg-[#e62245] cursor-pointer text-white py-[6px] px-6 rounded w-fit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="space-y-4">
            <div className="border rounded shadow-xl p-4">
              {/* order summary */}
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <span className="text-[#e62245] text-sm font-semibold">
                  Quotation
                </span>
              </div>
              <h3 className="font-medium">1 Item</h3>
              <div className="flex gap-3 items-center">
                <img
                  src={productImage}
                  alt={product.product_name}
                  className="w-20 h-20 object-cover"
                />
                <div className="flex flex-col justify-between text-sm">
                  <p className="font-semibold text-charcoal">
                    <span>1 x</span> {product.product_name}
                  </p>
                  <span className="text-[#d71a28] font-bold">
                    ৳{formatBDT(product.price)}
                  </span>
                </div>
              </div>
              <div className="pt-4 text-xs text-gray-500">
                <div>
                  <strong>Product ID:</strong> {product.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
