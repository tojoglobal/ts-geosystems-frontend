import React from "react";
import { Edit, Trash } from "lucide-react";

const transactions = [
  {
    id: "#MB2540",
    name: "Neal Matthews",
    ip: "cs562xf452dd",
    date: "07 Oct, 2022",
    total: "$400",
    method: "Mastercard",
    status: "Completed",
    statusClass: "text-green-400 bg-green-900",
  },
  {
    id: "#MB2541",
    name: "Jamal Burnett",
    ip: "ar52xf658dd",
    date: "07 Oct, 2022",
    total: "$380",
    method: "Visa",
    status: "Cancel",
    statusClass: "text-red-400 bg-red-900",
  },
  {
    id: "#MB2542",
    name: "Juan Mitchell",
    ip: "op63xf223dd",
    date: "06 Oct, 2022",
    total: "$384",
    method: "Paypal",
    status: "Completed",
    statusClass: "text-green-400 bg-green-900",
  },
  {
    id: "#MB2543",
    name: "Barry Dick",
    ip: "ty56xf985dd",
    date: "05 Oct, 2022",
    total: "$412",
    method: "Mastercard",
    status: "Completed",
    statusClass: "text-green-400 bg-green-900",
  },
  {
    id: "#MB2544",
    name: "Ronald Taylor",
    ip: "jf75xf431dd",
    date: "04 Oct, 2022",
    total: "$404",
    method: "Visa",
    status: "Shipping",
    statusClass: "text-yellow-400 bg-yellow-900",
  },
  {
    id: "#MB2545",
    name: "Jacob Hunter",
    ip: "fd96xf467dd",
    date: "04 Oct, 2022",
    total: "$392",
    method: "Paypal",
    status: "Completed",
    statusClass: "text-green-400 bg-green-900",
  },
];

const LatestTransactions = () => {
  return (
    <div className="bg-slate-900 text-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Latest Transaction</h2>
        <div className="text-sm text-gray-400">Sort By: Yearly</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-800">
            <tr>
              <th className="px-4 py-2">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Billing Name</th>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Order Date</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Payment Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className="bg-slate-800 border-b border-slate-700"
              >
                <td className="px-4 py-2">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2">{transaction.id}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                  <span>{transaction.name}</span>
                </td>
                <td className="px-4 py-2">{transaction.ip}</td>
                <td className="px-4 py-2">{transaction.date}</td>
                <td className="px-4 py-2">{transaction.total}</td>
                <td className="px-4 py-2">{transaction.method}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.statusClass}`}
                  >
                    {transaction.status}
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

export default LatestTransactions;
