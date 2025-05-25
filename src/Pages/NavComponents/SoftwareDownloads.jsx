import { useState } from "react";
import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";
import { useSelector } from "react-redux";

const SoftwareDownloads = () => {
  const { isAuth } = useSelector((state) => state.authUser);
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: softwareData = [],
    isLoading,
    isError,
  } = useDataQuery(["software"], "/api/software");

  if (isLoading) return null;

  if (isError) {
    return <div>Error fetching software data</div>;
  }

  // Calculate the data to display for the current page
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentData = softwareData.slice(startIdx, endIdx);

  // Calculate the total number of pages
  const totalPages = Math.ceil(softwareData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
        <Link to="/software-downloads" className="text-[#e62245]">
          Software Downloads
        </Link>
      </div>
      <p className="text-[#e62245] font-light mt-3 mb-3 text-[28px]">
        Software Downloads
      </p>
      <h1 className="text-[#e62245] font-bold text-xl mb-5">
        G2 Survey 3D Laser Scanner Software Downloads
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentData.map((software) => (
          <div
            key={software.id}
            className="border rounded-sm flex flex-col h-full"
          >
            <div className="flex flex-col p-4 flex-grow">
              <img
                src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                  software.photo
                }`}
                alt={software.softwar_name}
                className="w-full h-32 object-contain mb-3"
              />
              <div className="border-b w-full mb-3"></div>
              <h3 className="capitalize text-sm mb-2 flex-grow">
                {software.softwar_name}
              </h3>
            </div>
            <a
              onClick={() =>
                isAuth
                  ? window.open(software.softwarlink, "_blank")
                  : window.location.replace("/user/login")
              }
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#e62245] hover:bg-[#d41d3f] text-white text-sm font-semibold py-1 w-full text-center rounded block transition-colors"
            >
              DOWNLOAD
            </a>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 cursor-pointer border flex items-center gap-1 ${
            currentPage === 1
              ? "cursor-not-allowed text-gray-400"
              : "hover:border-[#e62245] hover:text-[#e62245]"
          }`}
        >
          <span>&lt;</span> Previous
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 cursor-pointer py-1 border ${
                currentPage === index + 1
                  ? "bg-[#e62245] text-white"
                  : "hover:border-[#e62245] hover:text-[#e62245]"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 cursor-pointer py-1 border flex items-center gap-1 ${
            currentPage === totalPages
              ? "cursor-not-allowed text-gray-400"
              : "hover:border-[#e62245] hover:text-[#e62245]"
          }`}
        >
          Next <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default SoftwareDownloads;
