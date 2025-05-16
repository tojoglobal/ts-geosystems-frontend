import { Link } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

const demoProducts = [
  {
    id: 1,
    name: "Leica GK1 Lemo to Serial Converter",
    brand: "Leica Geosystems",
    price: 5.0,
    priceExVat: 6.0,
    oldPrice: 67.5,
    oldPriceInc: 81.0,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/552/3303/leica-gk1-lemo-serial-converter__63317.1689995970.jpg?c=1",
    description:
      "The Lemo Canon Converter for Leica Total Stations is a 30-degree Lemo to RS232 converter that connects any Leica total station to any computer. This accessory is used with the GEV186 cable to...",
    availability: "Usually ships in 24 hours",
    otherDetails: "N/A",
    reviews: "No Reviews",
  },
  {
    id: 2,
    name: "Leica CCD1 Radio Handle - Used",
    brand: "Leica Geosystems",
    price: 100.0,
    priceExVat: 120.0,
    oldPrice: 295.0,
    oldPriceInc: 354.0,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/565/3376/recon-leica-ccd1-radio-handle__01533.1691120389.jpg?c=1",
    description:
      "WLAN communications handle for use with iCON Robotic Total Stations.",
    manufactured: "2013",
    condition: "Good",
    availability: "Usually ships in 24 hours",
    otherDetails: "N/A",
    reviews: "No Reviews",
  },
];

const Compare = () => {
  //   const { ids } = useParams();
  //   const idArray = ids.split("/").map((id) => Number(id));

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Compare Products</span>
      </div>
      <div className="">
        <h1 className="text-3xl mb-3">
          Comparing {demoProducts.length} Products
        </h1>
        <div className="flex items-center gap-2">
          <button
            className={`p-3 rounded-sm ${
              viewMode === "grid"
                ? "bg-[#e62245] text-white"
                : "border text-black"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <BsGrid3X3GapFill size={20} />
          </button>
          <button
            className={`p-3 rounded-sm ${
              viewMode === "list"
                ? "bg-[#e62245] text-white"
                : "border text-black"
            }`}
            onClick={() => setViewMode("list")}
          >
            <FaThList size={20} />
          </button>
        </div>
      </div>

      <div
        className={`${
          viewMode === "grid" ? "grid grid-cols-4 gap-6" : "flex flex-col gap-6"
        }`}
      >
        {demoProducts.map((product) => (
          <div
            key={product.id}
            className={`relative ${viewMode === "list" ? "w-1/4" : ""}`}
          >
            <button className="absolute right-0 top-0 p-2 text-gray-500 hover:text-[#e62245]">
              <IoClose size={24} />
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-contain mb-4"
            />
            <div className="space-y-4">
              <h3 className="font-medium">{product.name}</h3>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-gray-500 line-through">
                    Was: ৳{product.oldPrice.toFixed(2)}
                  </p>
                  <p className="font-bold">
                    ৳{product.price.toFixed(2)} (Ex. VAT)
                  </p>
                </div>
                <p className="font-bold">৳{product.price.toFixed(2)}</p>
                <p className="text-gray-500">
                  ৳{product.priceExVat.toFixed(2)} (Inc. VAT)
                </p>
              </div>
              <button className="w-full bg-[#e62245] text-white py-2 hover:bg-[#d41d3f] transition-colors font-semibold mb-4">
                ADD TO CART
              </button>
              <div className="p-6">
                <div className="w-full space-y-3 text-sm text-gray-800">
                  <div>
                    <h4 className="font-bold">Brand:</h4>
                    <p className="text-[#e62245] underline">{product.brand}</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Description</h4>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">No Reviews</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Availability</h4>
                    <p className="text-gray-600">{product.availability}</p>
                  </div>
                  {product.manufactured && (
                    <div>
                      <h4 className="font-medium">Manufactured</h4>
                      <p className="text-gray-600">{product.manufactured}</p>
                    </div>
                  )}
                  {product.condition && (
                    <div>
                      <h4 className="font-medium">Condition</h4>
                      <p className="text-gray-600">{product.condition}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold">Other Details</h4>
                    <p className="text-gray-600 font-bold">
                      {product.otherDetails || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
