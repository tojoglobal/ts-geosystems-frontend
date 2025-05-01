import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const SoftwareDownloads = () => {
  const axiosPublicUrl = useAxiospublic();
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: softwareData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["software"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/softwar");
      return res?.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
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
    <div className="p-4">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/support" className="text-[#e62245]">
          Support
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Quick Guides</span>
      </div>
      <p className="text-[#e62245] mb-6 text-2xl">Quick Guides</p>
      <h1 className="text-[#e62245] font-bold text-xl mb-8">
        G2 Survey 3D Laser Scanner Quick Guides
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentData.map((software) => (
          <div
            key={software.id}
            className="border rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                software.photo
              }`}
              alt={software.softwar_name}
              className="w-full h-auto object-contain mb-4"
            />
            <div className="border-b w-full mb-4"></div>
            <h3 className="text-center text-sm mb-4">
              {software.softwar_name}
            </h3>
            <button
              onClick={() => window.open(software.softwarlink, "_blank")}
              className="bg-[#e62245] text-white px-6 py-1 rounded hover:bg-[#d41d3f] transition-colors w-full"
            >
              DOWNLOAD
            </button>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border flex items-center gap-1 ${
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
              className={`px-3 py-1 border ${
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
          className={`px-3 py-1 border flex items-center gap-1 ${
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
