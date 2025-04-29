import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const SoftwareDownloads = () => {
  const axiosPublicUrl = useAxiospublic();

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
    // add loading
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching software data</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/support" className="text-[#e62245]">
          SUPPORT
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Quick Guides</span>
      </div>
      <p className="text-[#e62245] mb-6 text-2xl">Quick Guides</p>
      <h1 className="text-[#e62245] font-bold text-xl mb-8">
        G2 Survey 3D Laser Scanner Quick Guides
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {softwareData.map((software) => (
          <Link
            to={software.slug}
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
          </Link>
        ))}
      </div>
      {/* Pagination demo/ will connect later */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className="px-3 py-1 border hover:border-[#e62245] hover:text-[#e62245]"
            >
              {page}
            </button>
          ))}
        </div>
        <button className="px-3 py-1 border hover:border-[#e62245] hover:text-[#e62245] flex items-center gap-1">
          Next <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default SoftwareDownloads;
