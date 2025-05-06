import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useDispatch } from "react-redux";
import { clearCart, clearCoupon } from "../../features/AddToCart/AddToCart";
import { GenerateInvoicePdf } from "../../utils/generateInvoicePdf";

const ThankYou = () => {
  const axiosPublic = useAxiospublic();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderId) {
      axiosPublic
        .get(`/api/orderdata`, {
          params: { orderId },
        })
        .then((res) => {
          setOrder(res.data);
          if (res.data.payment_method === "sslcommerz") {
            dispatch(clearCart());
            dispatch(clearCoupon());
          }
        })
        .catch((err) => console.error(err));
    }
  }, [orderId, axiosPublic, dispatch]);

  // console.log(order);

  const handleDownload = async () => {
    const doc = await GenerateInvoicePdf(order);
    doc.save(`Invoice_${order.order_id}.pdf`);
  };

  const handlePrint = async () => {
    const doc = await GenerateInvoicePdf(order);

    window.open(doc.output("bloburl"), "_blank");
  };

  if (!order)
    return (
      <div className="text-center py-10 text-lg">Loading your order...</div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
          Thank you for your order!
        </h1>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.payment_method}
          </p>
          <p>
            <strong>Total Paid:</strong> ${order.total}
          </p>
        </div>

        {order.payment_method === "sslcommerz" ? (
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200 text-green-800">
            <h2 className="text-xl font-semibold mb-2">
              Payment Confirmed via SSLCommerz
            </h2>
            <p>
              Your order has been successfully processed and is now being
              prepared for shipping. You’ll receive updates shortly.
            </p>
          </div>
        ) : (
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800">
            <h2 className="text-xl font-semibold mb-2">
              Bank Payment Instructions
            </h2>
            <p>
              Your order has been received. Please transfer the total amount ($
              {order.total}) to the following bank account:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Bank Name:</strong> Example Bank
              </li>
              <li>
                <strong>Account Number:</strong> 123456789
              </li>
              <li>
                <strong>Account Name:</strong> Your Store Name
              </li>
            </ul>
            <p className="mt-2">
              After your payment is confirmed, we will start processing your
              shipment.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            We’ve also sent a confirmation to: <strong>{order.email}</strong>
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download Invoice
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
