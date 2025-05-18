import { useState } from "react";
import {
  Eye,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  MessageSquare,
  Reply,
  X,
} from "lucide-react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loader from "../../utils/Loader";
import { formatDate } from "../../utils/formatDate";

const Chat = () => {
  const axiosPublic = useAxiospublic();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages with pagination
  const {
    data: messagesData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/api/messages?page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const { data: messages = [], pagination = {} } = messagesData;

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }) => {
      const res = await axiosPublic.put(`/api/messages/${id}/reply`, {
        admin_reply: reply,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Reply sent successfully",
        icon: "success",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
      queryClient.invalidateQueries(["messages"]);
      setSelectedMessage(null);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to send reply",
        icon: "error",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosPublic.delete(`/api/messages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "The message has been deleted.",
        icon: "success",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
      queryClient.invalidateQueries(["messages"]);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to delete message",
        icon: "error",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Message?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const showFullMessage = (message) => {
    Swal.fire({
      title: `Message from ${message.user_email}`,
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Order ID:</strong> ${message.order_id}</p>
          <p class="mb-2"><strong>Subject:</strong> ${message.subject}</p>
          <p class="mb-2"><strong>Date:</strong> ${formatDate(
            message.created_at
          )}</p>
          <hr class="my-3 border-slate-600">
          <div class="max-h-96 overflow-y-auto">
            <h4 class="font-bold mb-2">Original Message:</h4>
            <p class="whitespace-pre-wrap mb-4">${message.message}</p>
            ${
              message.admin_reply
                ? `
              <h4 class="font-bold mb-2">Your Reply:</h4>
              <p class="whitespace-pre-wrap bg-slate-700 p-2 rounded">${message.admin_reply}</p>
            `
                : ""
            }
          </div>
        </div>
      `,
      width: "800px",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      showCloseButton: true,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 cursor-pointer py-1 rounded ${
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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 cursor-pointer py-1 rounded ${
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {i}
        </button>
      );
    }

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
  if (isError)
    return <div className="text-red-400 p-4">Failed to load messages.</div>;

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4 my-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl font-semibold">Chat Messages</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-slate-700 cursor-pointer outline-none appearance-none text-white text-sm rounded px-4 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-400">
            {pagination.total ? `Total: ${pagination.total} messages` : ""}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr>
              <th className="px-3 md:px-4 py-2 text-left">Order ID</th>
              <th className="px-3 md:px-4 py-2 text-left">Customer</th>
              <th className="px-3 md:px-4 py-2 text-left">Subject</th>
              <th className="px-3 md:px-4 py-2 text-left">Date</th>
              <th className="px-3 md:px-4 py-2 text-left">Status</th>
              <th className="px-3 md:px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr
                  key={message.id}
                  className="bg-slate-800 border-b border-slate-600"
                >
                  <td className="px-3 md:px-4 py-2">{message.order_id}</td>
                  <td className="px-3 md:px-4 py-2">{message.user_email}</td>
                  <td className="px-3 md:px-4 py-2">
                    <div className="max-w-xs truncate hover:text-clip hover:text-white">
                      {message.subject}
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-2">
                    {formatDate(message.created_at)}
                  </td>
                  <td className="px-3 md:px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.is_read
                          ? "text-green-400 bg-green-900"
                          : "text-yellow-400 bg-yellow-900"
                      }`}
                    >
                      {message.is_read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-2 flex gap-3">
                    <button
                      onClick={() => showFullMessage(message)}
                      className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-400 cursor-pointer bg-red-900 p-1 rounded hover:bg-red-800"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-400">
                  No messages found
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
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">{renderPageNumbers()}</div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
              className="p-1 cursor-pointer rounded bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-600">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Reply to Message</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-white"
                  disabled={replyMutation.isLoading}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Order ID:</p>
                  <p className="text-white">{selectedMessage.order_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Customer:</p>
                  <p className="text-white">{selectedMessage.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Subject:</p>
                  <p className="text-white">{selectedMessage.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Original Message:
                  </p>
                  <p className="bg-slate-700 p-3 rounded text-white">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
