import { Link } from "react-router-dom";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const { items, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );
  console.log("Cart", items, totalQuantity);

  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Leica iCON iCG70 GNSS RTK Rover Package",
      price: 11994.0,
      quantity: 1,
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/100x100/products/788/4467/leica-icon-icg70-antenna__78227.1723046790.jpg?c=1",
    },
    {
      id: 2,
      name: "Leica GS05T RTK GPS 4G Rover + CS20",
      price: 11994.0,
      quantity: 1,
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/100x100/products/800/4611/leica-gs05-gnss-antenna__20101.1727199027.jpg?c=1",
    },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e62245",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        //  condition
        Swal.fire(
          "Removed!",
          "The item has been removed from the cart.",
          "success"
        );
      }
    });
  };

  // Calculate totals
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const vat = subTotal * 0.2; // Example VAT at 20%
  const grandTotal = subTotal + vat;

  return (
    <div className="p-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Your Cart</span>
      </div>
      {cartItems.length === 0 ? (
        <div>
          <h1 className="text-3xl text-gray-800 mb-2">Your Cart (0 Items)</h1>
          <p className="text-gray-500 mt-3">Your cart is empty</p>
        </div>
      ) : (
        <div>
          {/* Title */}
          <h1 className="text-3xl mb-2">
            Your Cart ({cartItems.length} Items)
          </h1>
          {/* Table */}
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
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b">
                  {/* Item */}
                  <td className="flex items-center gap-4 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20"
                    />
                    <div>
                      <p>Leica Geosystems</p>
                      <Link className="font-medium text-[#e62245] underline">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  {/* Price */}
                  <td>৳{item.price.toFixed(2)}</td>
                  {/* Quantity */}
                  <td>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 border rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2 border rounded">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 border rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  {/* Total */}
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <p>৳{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-[2px] bg-gray-300 text-red-500 rounded-full flex items-center justify-center"
                      >
                        <RxCross2 className="text-[16px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Summary */}
          <div className="max-w-lg ml-auto p-4 rounded">
            <div className="flex justify-between mb-3 border-b pb-3">
              <span>Subtotal:</span>
              <span>৳{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 border-b pb-3">
              <span>Shipping:</span>
              <span>Estimate Shipping</span>
            </div>
            <div className="flex justify-between mb-3 border-b pb-3">
              <span>VAT:</span>
              <span>৳{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 border-b pb-3">
              <span>Coupon Code:</span>
              <button className="text-blue-500 hover:underline">
                Add Coupon
              </button>
            </div>
            <div className="flex justify-between text-lg mt-4">
              <span>Grand Total:</span>
              <span>৳{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-end mt-7">
              <Link to="/checkout">
                <button className="bg-[#e62245] text-white py-[6px] px-6 rounded mb-4">
                  CHECKOUT
                </button>
              </Link>
            </div>
            <div className="text-sm text-right text-gray-500 mb-4">
              -- or use --
            </div>
            <div className="flex flex-col w-3/5 ml-auto items-center mt-4">
              <button className="flex items-center justify-center gap-1 bg-yellow-400 text-black py-[6px] px-6 rounded w-full mb-2">
                <img src="/paypal.svg" className="w-16" alt="" />
                Checkout
              </button>
              <button className="bg-[#f3a847] text-black py-[6px] px-6 rounded w-full">
                <img
                  src="https://m.media-amazon.com/images/G/02/AmazonPay/Maxo/PWA_dark-en_US._CB620220074_.svg"
                  alt=""
                  className="w-36 mx-auto"
                />
              </button>
              <p className="uppercase font-semibold text-sm">
                use your amazon account
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
