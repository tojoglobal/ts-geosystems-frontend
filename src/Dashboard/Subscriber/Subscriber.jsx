import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash,
} from "lucide-react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loader from "../../utils/Loader";
import { formatDate } from "../../utils/formatDate";

const Subscriber = () => {
  const axiosPublic = useAxiospublic();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch subscribers
  const {
    data: subscribersData = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["subscribers", currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/api/subscribers?page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data;
    },
  });

  const { data: subscribers = [], pagination = {} } = subscribersData;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosPublic.delete(`/api/subscribers/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "Subscriber has been removed.",
        icon: "success",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
      refetch();
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to delete subscriber",
        icon: "error",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#e11d48",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Subscriber?",
      text: "This will remove them from the mailing list",
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
    return <div className="text-red-400 p-4">Failed to load subscribers.</div>;

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4 my-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl font-semibold">Email Subscribers</h2>
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
            {pagination.total ? `Total: ${pagination.total} subscribers` : ""}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr>
              <th className="px-3 md:px-4 py-2 text-left">Email</th>
              <th className="px-3 md:px-4 py-2 text-left">Subscribed Date</th>
              <th className="px-3 md:px-4 py-2 text-left">Status</th>
              <th className="px-3 md:px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="bg-slate-800 border-b border-slate-600"
                >
                  <td className="px-3 md:px-4 py-2">{subscriber.email}</td>
                  <td className="px-3 md:px-4 py-2">
                    {formatDate(subscriber.subscribed_at)}
                  </td>
                  <td className="px-3 md:px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscriber.is_active
                          ? "text-green-400 bg-green-900"
                          : "text-red-400 bg-red-900"
                      }`}
                    >
                      {subscriber.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-2">
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      className="text-red-400 cursor-pointer bg-red-900 p-1 rounded hover:bg-red-800"
                      disabled={deleteMutation.isLoading}
                    >
                      {deleteMutation.isLoading &&
                      deleteMutation.variables === subscriber.id ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <Trash size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-400">
                  No subscribers found
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
    </div>
  );
};

export default Subscriber;
