import React from "react";
import { Edit, Trash } from "lucide-react";

const OrderTable = () => {
  const orders = [
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

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4 my-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Orders</h2>
        <div className="text-sm text-gray-400">Sort By: Latest</div>
      </div>
      <div className="overflow-x-auto">
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
            {orders.map((order, index) => (
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
