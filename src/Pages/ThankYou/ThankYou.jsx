import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ThankYou = () => {
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

  if (!order) return <p>Loading your order...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
      <p>
        <strong>Order ID:</strong> {order.order_id}
      </p>
      <p>
        <strong>Status:</strong> {order.payment_status}
      </p>
      <p>
        <strong>Total:</strong> ${order.total_amount}
      </p>
      {/* Display additional info if needed */}
    </div>
  );
};

export default ThankYou;
