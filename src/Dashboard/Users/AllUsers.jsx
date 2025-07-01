import { useState } from "react";
import {
  Eye,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Loader from "../../utils/Loader";
import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const AllUsers = () => {
  const axiospublic = useAxiospublic();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const {
    data: userData = {},
    isLoading,
    refetch,
  } = useDataQuery(
    ["users", currentPage, itemsPerPage, search],
    `api/admin/all-users?page=${currentPage}&limit=${itemsPerPage}&search=${search}`
  );
  const { users = [], pagination = {} } = userData;

  const handleShowUserDetails = (user) => {
    Swal.fire({
      title: `User Details`,
      html: `
        <div style="text-align:left;">
          <p><strong>ID:</strong> ${user.id}</p>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phoneNumber}</p>
          <p><strong>Company:</strong> ${user.companyName}</p>
          <p><strong>Address:</strong> ${user.addressLine1 || ""} ${
        user.addressLine2 || ""
      }</p>
          <p><strong>City/State:</strong> ${user.city || ""}, ${
        user.state || ""
      }</p>
          <p><strong>Country:</strong> ${user.country || ""}</p>
          <p><strong>Postcode:</strong> ${user.postcode || ""}</p>
          <p><strong>Joined:</strong> ${
            user.created_at ? formatDate(user.created_at) : ""
          }</p>
        </div>
      `,
      width: 500,
      confirmButtonText: "Close",
      showCloseButton: true,
      background: "#1d293d",
      color: "#fff",
    });
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiospublic.delete(`/api/user/${userId}`);
          if (res.status === 200) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: res?.data?.message || "User deleted.",
              icon: "success",
              background: "#1e293b",
              color: "#f8fafc",
              confirmButtonColor: "#e11d48",
              timer: 4000,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: error.message || "Failed to delete user.",
            timer: 4000,
          });
        }
      }
    });
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const { totalPages = 1 } = pagination;

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
              ? "bg-teal-600 text-white"
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
              ? "bg-teal-600 text-white"
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
              ? "bg-teal-600 text-white"
              : "bg-slate-700 hover:bg-slate-600"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader />
      </div>
    );

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="md:text-xl font-semibold">All Users</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-700 outline-none px-3 py-1 rounded text-white text-sm"
          />
          <span className="text-sm text-gray-400">Show:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-slate-700 cursor-pointer outline-none appearance-none text-white text-sm rounded px-4 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="13">13</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-400">
            {pagination.total ? `Total: ${pagination.total} users` : ""}
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
              <th className="px-3 md:px-4 py-2 text-left">ID</th>
              <th className="px-3 md:px-4 py-2 text-left">Name</th>
              <th className="px-3 md:px-4 py-2 text-left">Email</th>
              <th className="px-3 md:px-4 py-2 text-left">Phone</th>
              <th className="px-3 md:px-4 py-2 text-left">Company</th>
              <th className="px-3 md:px-4 py-2 text-left">Joined</th>
              <th className="px-3 md:px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-slate-800 border-b border-slate-600"
                >
                  <td className="px-3 md:px-4 py-2">
                    <input type="checkbox" className="cursor-pointer" />
                  </td>
                  <td className="px-3 md:px-4 py-2">{user.id}</td>
                  <td className="px-3 md:px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-3 md:px-4 py-2">{user.email}</td>
                  <td className="px-3 md:px-4 py-2">{user.phoneNumber}</td>
                  <td className="px-3 md:px-4 py-2">{user.companyName}</td>
                  <td className="px-3 md:px-4 py-2">
                    {user.created_at ? formatDate(user.created_at) : ""}
                  </td>
                  <td className="px-3 md:px-4 py-2 flex gap-3">
                    <button
                      onClick={() => handleShowUserDetails(user)}
                      className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 cursor-pointer bg-red-900 p-1 rounded hover:bg-red-800"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-400">
                  No users found
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

export default AllUsers;
