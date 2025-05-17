import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserManuals = () => {
  const [manuals, setManuals] = useState([]);

  useEffect(() => {
    // Simulate fetching manuals from an API
    const fetchManuals = async () => {
      // This would be replaced by an actual API call later
      const data = [
        {
          id: 1,
          name: 'Leica FlexLine TS07 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 2,
          name: 'Leica FlexLine TS07 1" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 3,
          name: 'Leica FlexLine TS03 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 4,
          name: 'Leica FlexLine TS10 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 5,
          name: 'Leica FlexLine TS07 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 6,
          name: 'Leica FlexLine TS07 1" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 7,
          name: 'Leica FlexLine TS03 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 8,
          name: 'Leica FlexLine TS10 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 9,
          name: 'Leica FlexLine TS07 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 10,
          name: 'Leica FlexLine TS07 1" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 11,
          name: 'Leica FlexLine TS03 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
        {
          id: 12,
          name: 'Leica FlexLine TS10 5" R500 Manual Total Station',
          image: "https://ts-geosystems.com.bd/assets/images/JMqcf5wY.png",
          downloadLink: "#",
        },
      ];
      setManuals(data);
    };

    fetchManuals();
  }, []);

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
      <p className="text-[#e62245] font-light mt-3 mb-6 text-[28px]">
        User Manuals
      </p>
      <h1 className="text-[#e62245] font-bold text-xl mb-8">
        G2 Survey 3D Laser Scanner User Manuals
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {manuals.map((guide) => (
          <div
            key={guide.id}
            className="border rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={guide.image}
              alt={guide.name}
              className="w-full h-auto object-contain mb-4"
            />
            <div className="border-b w-full mb-4"></div>
            <h3 className="text-center text-sm mb-4">{guide.name}</h3>
            <button
              onClick={() => window.open(guide.downloadLink, "_blank")}
              className="bg-[#e62245] text-white px-6 py-1 rounded hover:bg-[#d41d3f] transition-colors w-full"
            >
              DOWNLOAD
            </button>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((page) => (
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

export default UserManuals;
