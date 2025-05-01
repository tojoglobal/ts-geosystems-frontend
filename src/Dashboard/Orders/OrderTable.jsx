import React, { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
const demoOrders = [
  {
    id: "#ORD2540",
    productName: "Sample Product",
    quantity: 2,
    customerName: "John Doe",
    orderDate: "2024-01-20",
    status: "Pending",
    totalAmount: 299.99,
    statusClass: "text-yellow-400 bg-yellow-900",
  },
  {
    id: "#ORD2541",
    productName: "Test Product",
    quantity: 1,
    customerName: "Jane Smith",
    orderDate: "2024-01-19",
    status: "Completed",
    totalAmount: 199.99,
    statusClass: "text-green-400 bg-green-900",
  },
];
const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`)
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status } : o))
    );
  };

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4 my-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <div className="text-sm text-gray-400">Sort By: Latest</div>
      </div>
      <div className="overflow-x-auto">
        {/* <table className="w-full border">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center border-t">
                <td>{order.order_id}</td>
                <td>{order.email}</td>
                <td>£{order.total}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "completed"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => updateStatus(order.order_id, "completed")}
                    className="text-green-600 font-semibold"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => updateStatus(order.order_id, "cancelled")}
                    className="text-red-600 font-semibold"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr>
              <th className="px-4 py-2 text-left">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Order Date</th>
              <th className="px-4 py-2 text-left">Total Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {demoOrders.map((order, index) => (
              <tr
                key={index}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-4 py-2">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.productName}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                  <span>{order.customerName}</span>
                </td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">{order.orderDate}</td>
                <td className="px-4 py-2">${order.totalAmount}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusClass}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="text-green-400 bg-green-900 p-1 rounded hover:bg-green-700">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-400 bg-red-900 p-1 rounded hover:bg-red-700">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
