import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import Swal from "sweetalert2";

const equipmentCategories = [
  {
    title: "Used Laser Scanners",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/e/used-category-scanners__95474.original.jpg",
    link: "/used-equipment/laser-scanners",
  },
  {
    title: "Used Total Stations",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/n/used-category-robotic-total-stations__71261.original.jpg",
    link: "/used-equipment/total-stations",
  },
  {
    title: "Used GNSS/GPS",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/m/used-category-gnss__59353.original.jpg",
    link: "/used-equipment/gnss-gps",
  },
  {
    title: "Used Controllers",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/q/used-category-controllers__43564.original.jpg",
    link: "/used-equipment/controllers",
  },
  {
    title: "Used Lasers",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/y/used-category-construction-lasers__49199.original.jpg",
    link: "/used-equipment/lasers",
  },
  {
    title: "Used Levels",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/z/used-category-digital-levels__91752.original.jpg",
    link: "/used-equipment/levels",
  },
  {
    title: "Used Location Detection",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/e/used-category-cable-locators__45605.original.jpg",
    link: "/used-equipment/location-detection",
  },
  {
    title: "Used Accessories",
    image:
      "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/original/h/used-category-accessories__70873.original.jpg",
    link: "/used-equipment/accessories",
  },
];

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

const UsedEquipment = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("FEATURED ITEMS");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareItems, setCompareItems] = useState([]);
  const navigate = useNavigate();
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
  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[10px] mb-4">
        <Link to="/" className="text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Used Surveying Equipment</span>
      </div>
      <h1 className="text-4xl font-bold mb-6 uppercase">
        Used Surveying Equipment
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-b pb-10">
        {equipmentCategories.map((category, index) => (
          <Link
            key={index}
            to={category.link}
            className="group relative bg-white rounded-lg overflow-hidden transition-shadow"
          >
            <div className="relative h-48 bg-[#f5f5f5]">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div className="p-2 text-center">
              <h2 className="text-lg font-medium group-hover:text-[#e62245] transition-colors">
                {category.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
      <section className="mt-2">
        <div className="flex items-center justify-between md:justify-normal md:gap-52 mb-6">
          {/* View Mode Buttons */}
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
        {/* Products Grid/List */}
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          } gap-6`}
        >
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className={`${
                viewMode === "list" ? "flex gap-6 p-4" : "p-4"
              } relative`}
            >
              {/* SALE badge */}
              <div
                className={`absolute ${
                  viewMode === "list" ? "top-5 left-52" : "top-4 right-4"
                } bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm`}
              >
                SALE
              </div>
              {/* Product Image */}
              <Link to={product.url}>
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
                    className="w-full h-72 object-contain transition-all duration-300 ease-in-out"
                  />
                </div>
              </Link>
              {/* Product Details */}
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
                  <Link to={product.url}>
                    <h3
                      className={`${
                        viewMode === "list"
                          ? "text-2xl text-[#545454]"
                          : "text-[#54546f] text-lg"
                      } font-medium hover:text-[#e62245] cursor-pointer`}
                    >
                      {product.name}
                    </h3>
                  </Link>
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
                      )}
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
            </div>
          ))}
        </div>
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
                    currentPage === idx + 1
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
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
              COMPARE SELECTED
            </button>
          </div>
        </div>{" "}
      </section>
      <section className="mt-12">
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-used-equipment.jpg"
          alt=""
        />
        <div className="space-y-6 text-center mt-5">
          <p>
            G2 Survey offer a wide range of reconditioned and used surveying
            equipment at very competitive prices, providing excellent value for
            money.
          </p>
          <p>
            All of our pre-owned used Total Stations, GNSS/GPS Systems, 3D Laser
            Scanners, Laser Levels, Levels, and other used surveying equipment
            are fully serviced, certified and come with a minimum 3 month
            warranty for both parts and labour.
          </p>
          <p>
            With an extensive range of used Total Stations, used 3D Laser
            Scanners and used GNSS/GPS Systems and more, we're guaranteed to
            find the right equipment for you, whatever the budget.
          </p>
          {/* Highlighted box */}
          <div className="bg-gray-100 p-8 rounded-lg space-y-6">
            <h2 className="text-xl text-[#e62245] uppercase">
              Used Surveying Equipment Benefits
            </h2>
            <p>
              Cost Effective - Substantial Savings Over Buying New Equipment
            </p>
            <p>Serviced / Calibrated by Leica Trained Technicians</p>
            <p>6 Month Extended Warranty Available on Many Instruments</p>
            <p>
              Leading Brands - Whether it be a Used{" "}
              <a href="#" className="underline">
                Leica TS15
              </a>{" "}
              Total Station or a{" "}
              <a href="#" className="underline">
                Leica BLK360
              </a>{" "}
              Used Laser Scanner you're after, we've got you covered
            </p>
            <p className="italic font-semibold">Worldwide Shipping</p>
            <p className="text-[#e62245] font-semibold">
              DEMAND IS HIGH FOR PRE-OWNED EQUIPMENT, AND OUR STOCK IS
              CONSTANTLY CHANGING.
            </p>
            <p className="text-[#e62245] font-semibold">
              IF YOU CAN'T FIND THE SPECIFIC KIT YOU REQUIRE PLEASE CONTACT US
              AND WE WILL SOURCE IT.
            </p>

            <div className="flex justify-center">
              <button className="bg-[#e62245] text-white px-6 py-2 rounded-md hover:bg-[#c81e3b] transition">
                Contact Us
              </button>
            </div>

            <div>
              <a href="#" className="text-[#e62245] underline text-sm">
                G2 Survey Reconditioned Surveying Equipment Brochure
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsedEquipment;
