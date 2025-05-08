import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { parsePrice } from "../../utils/parsePrice";
import { addToCart } from "../../features/AddToCart/AddToCart";

const fakeProducts = [
  {
    id: 1,
    name: "Leica iCON iCG70 GNSS Rover Package",
    sku: "868636",
    brand: "Leica Geosystems",
    price: 9995.0,
    priceExVat: 11994.0,
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/788/4467/leica-icon-icg70-antenna__78227.1723046790.jpg?c=1",
    img2: "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/788/4468/leica-icon-icg70-second__12345.1723046791.jpg?c=1",
  },
  {
    id: 2,
    name: "Leica GVP722 SmartPole & SmartStation Container",
    sku: "817055",
    brand: "Leica Geosystems",
    price: 104.12,
    priceExVat: 124.95,
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
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
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
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
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
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
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
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
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/255/1782/leica-disto-d510-b__27186.1659454649.jpg?c=1",
    img2: "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/255/1782/leica-disto-d510-b__27186.1659454649.jpg?c=1",
  },
  {
    id: 7,
    name: "Leica GVP735 GNSS Container",
    sku: "855307",
    brand: "Leica Geosystems",
    price: 104.12,
    priceExVat: 124.95,
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
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
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/838/5026/leica-black-container-799275__42061.1744323007.jpg?c=1",
  },
  {
    id: 9,
    name: "Leica iCON iCG70 GNSS Rover Package",
    sku: "868636",
    brand: "Leica Geosystems",
    price: 9995.0,
    priceExVat: 11994.0,
    url: "/leica-icon-icg70-gnss-rtk-rover-package/",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/788/4467/leica-icon-icg70-antenna__78227.1723046790.jpg?c=1",
    img2: "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/788/4468/leica-icon-icg70-second__12345.1723046791.jpg?c=1",
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
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareItems, setCompareItems] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productsPerPage = 8;
  const totalPages = Math.ceil(fakeProducts.length / productsPerPage);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = fakeProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const toggleCompare = (productId) => {
    setCompareItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCompareSelected = () => {
    if (compareItems.length < 2) {
      Swal.fire({
        title: "Comparison Error",
        text: "You must select at least two products to compare",
        icon: "error",
        confirmButtonColor: "#e62245",
        confirmButtonText: "OK",
      });
    } else {
      // Sort the IDs to maintain consistent URL regardless of selection order
      const sortedIds = [...compareItems].sort((a, b) => a - b);
      navigate(`/compare/${sortedIds.join(",")}`);
    }
  };

  const handleAddToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parsePrice(product.price),
      quantity: 1,
    };

    console.log(itemToAdd);

    // dispatch(addToCart(itemToAdd));
    Swal.fire({
      title: "Added to Cart",
      text: `${product.name} has been added to your cart.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[10px] mb-4">
        <Link to="/">Home</Link>
        <span>/</span>
        <span className="text-[#e62245]">Clearance</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">CLEARANCE</h1>
      <section>
        <div className="flex items-center justify-between md:justify-normal md:gap-52 mb-6">
          {/* View Mode Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-[#e62245] text-white rounded-sm"
                  : "text-gray-600 border"
              }`}
            >
              <BsGrid3X3GapFill size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
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
            <label className="text-xs">Sort By:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border py-1 pl-2 text-xs border-[#e1dcdc] rounded-[5px] pr-36 appearance-none bg-white cursor-pointer"
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
        {/* Products Grid/List */}
        <div
          className={`grid mx-5 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-stretch"
              : "grid-cols-1 gap-7"
          } gap-4`}
        >
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className={`relative ${
                viewMode === "list" ? "flex gap-6" : "flex flex-col h-full"
              }`}
            >
              {/* SALE badge */}
              <div
                className={`absolute ${
                  viewMode === "list" ? "top-3 left-[267px]" : "top-3 right-3"
                } bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm`}
              >
                SALE
              </div>
              {viewMode === "list" ? (
                <Link to={product.url} className="w-1/3">
                  <div
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    <img
                      src={
                        hoveredProductId === product.id && product.img2
                          ? product.img2
                          : product.image
                      }
                      alt={product.name}
                      className="w-full h-64 object-contain transition-all duration-300 ease-in-out"
                    />
                  </div>
                </Link>
              ) : (
                <div className="w-full h-60 flex items-center justify-center bg-white">
                  <Link to={product.url} className="w-full h-full">
                    <div
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={
                          hoveredProductId === product.id && product.img2
                            ? product.img2
                            : product.image
                        }
                        alt={product.name}
                        className="w-auto h-60 object-contain transition-all duration-300 ease-in-out"
                      />
                    </div>
                  </Link>
                </div>
              )}
              {/* Product Details - Different structure for list vs grid */}
              {viewMode === "list" ? (
                <div className="w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-gray-600">
                      {product.brand} | Sku: {product.sku}
                    </div>
                    <Link to={product.url}>
                      <h3 className="text-xl text-gray-800 font-medium hover:text-[#e62245] cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-[#2f2f2b] mt-2">
                      Ex Demo - As New GNSS Antenna iCON iCG70 UHF Performance
                      AntennaGEB334 Li-Ion Battery x2GNSS Rover Container
                      Controller iCON CC170 Field ControllerGEB260 Li-Ion
                      BatteryGAT25 AntennaGEV288 Mains ChargerGHT63 Pole
                      ClampGHT81 Holder Plate Accessories GKL341...
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-col">
                      <div className="text-[#2f2f2b] text-lg font-semibold">
                        Was: £16,661.67
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-lg">
                          Price £{product.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 underline">
                          (Ex. VAT)
                        </p>
                      </div>
                      <div className="text-[#2f2f2b] text-lg font-semibold">
                        Was: £16,661.67
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                        <p className="text-[#2f2f2b] text-lg font-semibold">
                          Price:
                        </p>
                        £{product.priceExVat.toFixed(2)}{" "}
                        <span className="underline">(Inc. VAT)</span>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 flex-row">
                      <button className="bg-[#e62245] text-white px-6 py-[5px] rounded-[3px] hover:bg-[#d41d3f] font-bold transition-colors">
                        ADD TO CART
                      </button>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`compare-${product.id}`}
                          className="accent-[#0075ff]"
                          checked={compareItems.includes(product.id)}
                          onChange={() => toggleCompare(product.id)}
                        />
                        <label
                          htmlFor={`compare-${product.id}`}
                          className="text-sm cursor-pointer"
                        >
                          COMPARE
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-grow border-t pt-3">
                  <div className="flex-grow">
                    <div className="border-t border-gray-300 pt-2 text-xs text-gray-600 mb-1">
                      {product.brand} | Sku: {product.sku}
                    </div>
                    <Link to={product.url}>
                      <h3 className="text-gray-800 font-medium hover:text-[#e62245] cursor-pointer leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center gap-1">
                      <p className="font-bold">£{product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 underline">
                        (Ex. VAT)
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#b3b3b5] mt-1">
                      £{product.priceExVat.toFixed(2)}{" "}
                      <span className="underline">(Inc. VAT)</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#e62245] text-white px-6 py-[5px] rounded-[3px] hover:bg-[#d41d3f] font-bold transition-colors"
                      >
                        ADD TO CART
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id={`compare-${product.id}`}
                          className="accent-[#0075ff]"
                          checked={compareItems.includes(product.id)}
                          onChange={() => toggleCompare(product.id)}
                        />
                        <label
                          htmlFor={`compare-${product.id}`}
                          className="text-sm cursor-pointer"
                        >
                          COMPARE
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center">
          {/* Previous button (only show if not on page 1) */}
          {currentPage > 1 ? (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
            >
              ← Previous
            </button>
          ) : (
            <div></div>
          )}
          {/* Page numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`border px-3 py-1 rounded text-sm ${
                  currentPage === idx + 1 ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        {/* Next button */}
        {currentPage < totalPages ? (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
          >
            Next →
          </button>
        ) : (
          <div></div>
        )}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCompareSelected}
            className={`${
              compareItems.length >= 2
                ? "bg-[#e62245] hover:bg-[#d41d3f] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            } text-xs font-semibold px-6 py-2 rounded transition-colors`}
          >
            COMPARE SELECTED ({compareItems.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Clearance;
