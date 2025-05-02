import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/orderdata/${orderId}`)
        .then((res) => setOrder(res.data))
        .catch((err) => console.error(err));
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-700">Thank you for your purchase.</p>
        {order ? (
          <div className="mt-4 text-sm text-left">
            <p>
              <strong>Order ID:</strong> {order.order_id}
            </p>
            <p>
              <strong>Status:</strong> {order.payment_status}
            </p>
            <p>
              <strong>Total:</strong> ${order.total_amount}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">Loading order details...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
