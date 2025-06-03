import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";
import { useState } from "react";
import { useSelector } from "react-redux";
import ResourceCard from "./ResourceCard";

const UserManuals = () => {
  const { isAuth } = useSelector((state) => state.authUser);
  const [currentPage, setCurrentPage] = useState(1);
  const { data = {}, isLoading } = useDataQuery(
    ["userManuals", currentPage],
    `/api/usermanuals?page=${currentPage}`
  );
  const { data: manuals = [], pagination } = data;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < pagination?.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-1 md:p-3">
      <div className="flex items-center gap-2 text-[11px]">
        <Link to="/" className="text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/support" className="capitalize text-[#e62245]">
          Support
        </Link>
        <span>/</span>
        <Link to="/user-manuals" className="text-[#e62245]">
          User Manuals
        </Link>
      </div>
      <p className="text-[#e62245] font-light my-3 text-[28px]">
        User Manuals
      </p>
      <h1 className="text-[#e62245] font-bold text-xl mb-5">
        G2 Survey 3D Laser Scanner User Manuals
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {manuals.map((manual) => (
          <ResourceCard
            key={manual.id}
            imageUrl={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
              manual.photo
            }`}
            title={manual.user_manuals_name}
            onDownload={() =>
              isAuth
                ? window.open(manual.user_manuals_link, "_blank")
                : window.location.replace("/user/login")
            }
          />
        ))}
      </div>
      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 cursor-pointer py-1 border hover:text-[#e62245] flex items-center gap-1 disabled:opacity-50"
          >
            <span>&lt;</span> Prev
          </button>

          <div className="flex gap-2">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 cursor-pointer py-1 border ${
                      currentPage === pageNum
                        ? "bg-crimson-red text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === pagination.totalPages}
            className="px-3 cursor-pointer py-1 border hover:text-[#e62245] flex items-center gap-1 disabled:opacity-50"
          >
            Next <span>&gt;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManuals;
