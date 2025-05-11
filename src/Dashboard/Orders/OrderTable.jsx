import { useState } from "react";
import {
  Edit,
  Eye,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { parseItems } from "../../utils/parseItems";
import { formatDate } from "../../utils/formatDate";
import { FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { GenerateInvoicePdf } from "../../utils/generateInvoicePdf";
import Loader from "../../utils/Loader";

const OrderTable = () => {
  const axiospublic = useAxiospublic();
  const [editStatusId, setEditStatusId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: orderData = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiospublic.get(
        `api/orderinfo?page=${currentPage}&limit=${itemsPerPage}`
      );
      return res?.data;
    },
  });

  const { data: orders = [], pagination = {} } = orderData;

  const handleDownloadInvoice = async (order) => {
    const doc = await GenerateInvoicePdf(order);
    window.open(doc.output("bloburl"), "_blank");
  };

  const handleEditStatus = async (orderId, newStatus) => {
    try {
      const res = await axiospublic.put(`/api/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (res.status === 200) {
        refetch();
        setEditStatusId(null);
        Swal.fire("Success", "Order status updated!", "success");
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDeleteOrder = (order_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiospublic.delete(`/api/orders/${order_id}`);
          if (res.status === 200) {
            refetch();
            Swal.fire("Deleted!", res?.data?.message, "success");
          } else {
            throw new Error("Failed to delete order");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  const handleShowOrderDetails = (order) => {
    const items = parseItems(order?.items);
    const html = `
      <div style="text-align:left; max-height:300px; overflow-y:auto;">
        <p><strong>Order ID:</strong> ${order.order_id}</p>
        <p><strong>Name:</strong> ${order.shipping_name}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Billing Address:</strong> ${order.billing_address}</p>
        <p><strong>Shipping Address:</strong> ${order.shipping_address}, ${
      order.shipping_city
    } - ${order.shipping_zip}</p>
        <hr />
        <h4>Items:</h4>
        <ul>
          ${items
            .map(
              (item) =>
                `<li>${item.product_name} - Qty: ${item.quantity} - $${item.price}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;
    Swal.fire({
      title: `Order Details`,
      html,
      width: 600,
      confirmButtonText: "Close",
      showCloseButton: true,
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-900";
      case "completed":
        return "text-green-500 bg-green-900";
      case "cancelled":
        return "text-[#ed5e49] bg-[rgba(237,94,73,0.18)]";
      case "shipping":
        return "text-[#f4ba40] bg-[rgba(244,186,64,0.18)]";
      default:
        return "text-white bg-slate-600";
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const { totalPages } = pagination;

    if (!totalPages) return null;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 rounded ${
            1 === currentPage
              ? "bg-blue-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded ${
            totalPages === currentPage
              ? "bg-blue-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Failed to load orders.</div>;

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4 my-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl font-semibold">Order Management</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-slate-700 appearance-none text-white text-sm rounded px-4 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-400">
            {pagination.total ? `Total: ${pagination.total} orders` : ""}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr>
              <th className="px-3 md:px-4 py-2 text-left">
                <input type="checkbox" />
              </th>
              <th className="px-3 md:px-4 py-2 text-left">Order ID</th>
              <th className="px-3 md:px-4 py-2 text-left">Name</th>
              <th className="px-3 md:px-4 py-2 text-left">Payment Method</th>
              <th className="px-3 md:px-4 py-2 text-left">Payment Status</th>
              <th className="px-3 md:px-4 py-2 text-left">Quantity</th>
              <th className="px-3 md:px-4 py-2 text-left">Order Date</th>
              <th className="px-3 md:px-4 py-2 text-left">Total Amount</th>
              <th className="px-3 md:px-4 py-2 text-left">Status</th>
              <th className="px-3 md:px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={index}
                  className="bg-slate-800 border-b border-slate-600"
                >
                  <td className="px-3 md:px-4 py-2">
                    <input type="checkbox" />
                  </td>
                  <td className="px-3 md:px-4 py-2">{order?.order_id}</td>
                  <td className="px-3 md:px-4 py-2">{order?.shipping_name}</td>
                  <td className="px-3 md:px-4 py-2">{order?.payment_method}</td>
                  <td
                    className={`px-3 md:px-4 py-2 ${
                      order?.paymentStatus === "paid"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {order?.paymentStatus}
                  </td>
                  <td className="px-3 md:px-4 py-2">
                    {parseItems(order?.items).length}
                  </td>
                  <td className="px-3 md:px-4 py-2">{formatDate(order?.created_at)}</td>
                  <td className="px-3 md:px-4 py-2">${order?.total}</td>
                  <td className="px-3 md:px-4 py-2">
                    {editStatusId === order.order_id ? (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleEditStatus(order.order_id, e.target.value)
                        }
                        className="bg-gray-800 appearance-none text-white p-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="shipping">Shipping</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="text-blue-400 bg-blue-900 p-1 rounded hover:bg-blue-700"
                    >
                      <FaFilePdf size={16} />
                    </button>
                    <button
                      onClick={() => handleShowOrderDetails(order)}
                      className="text-yellow-400 bg-yellow-900 p-1 rounded hover:bg-yellow-700"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="text-green-400 bg-green-900 p-1 rounded hover:bg-green-700"
                      onClick={() =>
                        setEditStatusId((prev) =>
                          prev === order.order_id ? null : order.order_id
                        )
                      }
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order?.order_id)}
                      className="text-red-400 bg-red-900 p-1 rounded hover:bg-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, pagination.total)} of{" "}
            {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">{renderPageNumbers()}</div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-1 rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
              className="p-1 rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
