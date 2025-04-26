import { useState } from "react";
import { Link } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";

const fakeProducts = [
  {
    id: 1,
    name: "Leica iCON iCG70 GNSS Rover Package",
    sku: "868636",
    brand: "Leica Geosystems",
    price: 9995.0,
    priceExVat: 11994.0,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/788/4467/leica-icon-icg70-antenna__78227.1723046790.jpg?c=1",
  },
  {
    id: 2,
    name: "Leica GVP722 SmartPole & SmartStation Container",
    sku: "817055",
    brand: "Leica Geosystems",
    price: 104.12,
    priceExVat: 124.95,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/538/3241/leica-gvp-container-generic__65969.1689823054.jpg?c=1",
  },
  {
    id: 3,
    name: "Leica GVP735 GNSS Container",
    sku: "855307",
    brand: "Leica Geosystems",
    price: 104.12,
    priceExVat: 124.95,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/538/3241/leica-gvp-container-generic__65969.1689823054.jpg?c=1",
  },
  {
    id: 4,
    name: "Leica GEB321 Li-Ion Battery",
    sku: "898414",
    brand: "Leica Geosystems",
    price: 80.0,
    priceExVat: 96.0,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/394/1923/leica-geb321-battery__34880.1659455123.jpg?c=1",
  },
  {
    id: 5,
    name: "Leica iCON iCG70 GNSS Rover Package",
    sku: "868636",
    brand: "Leica Geosystems",
    price: 9995.0,
    priceExVat: 11994.0,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/725/3974/leica-gknl4m-staff__25248.1705485152.jpg?c=1",
  },
  {
    id: 6,
    name: "Leica GVP722 SmartPole & SmartStation Container",
    sku: "817055",
    brand: "Leica Geosystems",
    price: 104.12,
    priceExVat: 124.95,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/255/1782/leica-disto-d510-b__27186.1659454649.jpg?c=1",
  },
  {
    id: 7,
    name: "Leica GVP735 GNSS Container",
    sku: "855307",
    brand: "Leica Geosystems",
    price: 104.12,
    priceExVat: 124.95,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/839/5027/leica-sprinter-250m-digital-level-a__77897.1744323008.jpg?c=1",
  },
  {
    id: 8,
    name: "Leica GEB321 Li-Ion Battery",
    sku: "898414",
    brand: "Leica Geosystems",
    price: 80.0,
    priceExVat: 96.0,
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/838/5026/leica-black-container-799275__42061.1744323007.jpg?c=1",
  },
];

const sortOptions = [
  "FEATURED ITEMS",
  "NEWEST ITEMS",
  "BEST SELLING",
  "A TO Z",
  "Z TO A",
  "BY REVIEW",
  "PRICE: ASCENDING",
  "PRICE: DESCENDING",
];

const Clearance = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("FEATURED ITEMS");

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm mb-4">
        <Link to="/" className="hover:text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Clearance</span>
      </div>
      <h1 className="text-4xl font-bold mb-6">CLEARANCE</h1>
      <section>
        <div className="flex items-center justify-between md:justify-normal md:gap-52 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 ${
                viewMode === "grid"
                  ? "bg-[#e62245] text-white rounded-sm"
                  : "text-gray-600 border"
              }`}
            >
              <BsGrid3X3GapFill size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 ${
                viewMode === "list"
                  ? "bg-[#e62245] text-white rounded-sm"
                  : "text-black border"
              }`}
            >
              <FaThList size={20} />
            </button>
          </div>
          {/* <div className="w-full flex justify-center mt-4 md:mt-0"> */}
          <div className="flex items-center gap-2">
            <label className="text-sm">Sort By:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-1 rounded-sm pr-16 appearance-none bg-white cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          } gap-6`}
        >
          {fakeProducts.map((product) => (
            <div
              key={product.id}
              className={`${
                viewMode === "list" ? "flex gap-6 p-4" : "p-4"
              } relative`}
            >
              <div
                className={`absolute ${
                  viewMode === "list" ? "top-4 left-60" : "top-4 right-4"
                } bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm`}
              >
                SALE
              </div>
              <div className={viewMode === "list" ? "w-1/4" : ""}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-contain"
                />
              </div>
              <div
                className={`${
                  viewMode === "list"
                    ? "w-3/4 flex flex-col justify-between"
                    : "space-y-2 border-t pt-2"
                }`}
              >
                <div>
                  <div className="text-xs text-gray-600">
                    {product.brand} | Sku: {product.sku}
                  </div>
                  <h3
                    className={`${
                      viewMode === "list"
                        ? "text-2xl text-[#545454]"
                        : "text-[#54546f] text-lg"
                    } font-medium hover:text-[#e62245] cursor-pointer`}
                  >
                    {product.name}
                  </h3>
                  {viewMode === "list" && (
                    <p className="text-sm text-[#2f2f2b] mt-2">
                      Ex Demo - As New GNSS Antenna iCON iCG70 UHF Performance
                      AntennaGEB334 Li-Ion Battery x2GNSS Rover Container
                      Controller iCON CC170 Field ControllerGEB260 Li-Ion
                      BatteryGAT25 AntennaGEV288 Mains ChargerGHT63 Pole
                      ClampGHT81 Holder Plate Accessories GKL341...
                    </p>
                  )}
                </div>
                <div className="mt-auto">
                  <div className="flex flex-col">
                    {viewMode === "list" && (
                      <div className="text-[#2f2f2b] text-lg font-semibold">
                        Was: £16,661.67
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-lg">
                        {viewMode === "list" && "Price"} £
                        {product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 underline">
                        (Ex. VAT)
                      </p>
                    </div>
                    {viewMode === "list" && (
                      <div className="text-[#2f2f2b] text-lg mb-1 font-semibold">
                        Was: £16,661.67
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                      {viewMode === "list" && (
                        <p className="text-[#2f2f2b] text-lg font-semibold">
                          Price:
                        </p>
                      )}{" "}
                      £{product.priceExVat.toFixed(2)}{" "}
                      <span className="underline">(Inc. VAT)</span>
                    </div>
                  </div>
                  <div
                    className={`flex gap-4 mt-4 ${
                      viewMode === "list" ? "flex-row" : "flex-col"
                    }`}
                  >
                    <button className="bg-[#e62245] text-white px-6 py-2 hover:bg-[#d41d3f] transition-colors">
                      ADD TO CART
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`compare-${product.id}`}
                        className="accent-[#0075ff]"
                      />
                      <label
                        htmlFor={`compare-${product.id}`}
                        className="text-sm"
                      >
                        COMPARE
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Clearance;
