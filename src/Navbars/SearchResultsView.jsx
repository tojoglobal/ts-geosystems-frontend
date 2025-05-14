/* eslint-disable no-useless-escape */
import { useState } from "react";
import { MdAddShoppingCart, MdOutlineKeyboardVoice } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
const SearchResultsView = ({
  products,
  onClose,
  searchText,
  handleSearchSubmit,
  setSearchText,
}) => {
  const [sortOrder, setSortOrder] = useState("relevance");

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-[100] overflow-y-auto">
      <div className="flex max-w-[99%] z-50 mx-auto items-center pt-6 p-4">
        <img
          src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/250x64/g2-survey-logo_1611121872__30054.original.png"
          className="w-[190px] h-full mr-4"
          alt="G2 Survey"
        />
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full ml-2 mx-auto border-b border-[#c5ccd3] bg-white rounded"
        >
          <IoSearchSharp className="ml-6 mr-2 font-extrabold text-xl text-charcoal-black" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-3 py-4 text-2xl outline-none focus:outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <MdOutlineKeyboardVoice className="mr-30 text-2xl text-charcoal" />
          <button
            type="submit"
            className="absolute right-0 cursor-pointer px-4 h-full text-2xl border-2 border-charcoal-black bg-gray-200 hover:bg-gray-100 focus:outline-none"
          >
            Submit
          </button>
        </form>
        {/* Close Icon */}
        <button onClick={onClose} className="ml-8 cursor-pointer ">
          <RxCross1 className="text-4xl text-[#626263]" />
        </button>
      </div>
      <h2 className="max-w-[85%] mx-auto text-gray-700 text-sm font-semibold mr-2">
        Latest searches:
      </h2>
      <div className="p-8">
        {/* <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">2.5 U R V E Y</h1>
          <button onClick={onClose} className="text-2xl text-gray-600">
            ×
          </button>
        </div> */}
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-[20%] bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Lektorium für Kosten</h2>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-[18px] mb-2">Brand</h3>
              <ul className="space-y-1 text-[14px]">
                <li className="flex justify-between">
                  <span>Lein Grenzplatten</span>
                  <span>42</span>
                </li>
                <li className="flex justify-between">
                  <span>Nebel</span>
                  <span>4</span>
                </li>
                <li className="flex justify-between">
                  <span>Radiolektration</span>
                  <span>3</span>
                </li>
              </ul>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-[18px] mb-2">Category</h3>
              <ul className="space-y-1 text-[14px]">
                <li className="flex justify-between">
                  <span>Prog.All</span>
                  <span>30</span>
                </li>
                <li className="flex justify-between">
                  <span>Survivalpulszeitstufen</span>
                  <span>34</span>
                </li>
                <li className="flex justify-between">
                  <span>Container & Bap</span>
                  <span>32</span>
                </li>
                <li className="flex justify-between">
                  <span>30 Laser Scanning</span>
                  <span>12</span>
                </li>
                <li className="flex justify-between">
                  <span>Scanner Accessibilität</span>
                  <span>11</span>
                </li>
              </ul>
            </div>

            {/* Condition Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-[18px]">Condition</h3>
              <ul className="space-y-1 text-[14px]">
                <li className="flex justify-between">
                  <span>NEVY</span>
                  <span>40</span>
                </li>
                <li className="flex justify-between">
                  <span>USED</span>
                  <span>4</span>
                </li>
              </ul>
            </div>

            {/* Best Price Filter */}
            <div>
              <h3 className="font-semibold mb-2">Best Price</h3>
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="w-full md:w-[80%]">
            <div className="flex justify-between mx-5 items-center bg-white py-[6px] px-6">
              <p className="text-sm">
                {products.length} results found for "{searchText}"
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    className="appearance-none text-sm border rounded px-2 py-1"
                    value={sortOrder}
                    onChange={handleSort}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 p-5">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-white p-4 border border-gray-200 hover:border-gray-300"
                >
                  <img
                    src={
                      product.image_urls
                        ? `${import.meta.env.VITE_OPEN_APIURL}${JSON.parse(
                            product.image_urls
                          )[0].replace(/^["\[]+|["\]]+$/g, "")}`
                        : product.image
                    }
                    alt={product.product_name || product.name}
                    className="w-full h-32 object-contain mb-2"
                  />
                  <p className="text-xs font-medium mb-1 hover:text-[#e62245] cursor-pointer">
                    {product.product_name || product.name}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-xs font-semibold">{product.price}</p>
                    <button className="p-1 bg-[#e62245] text-white rounded hover:bg-[#d41d3f]">
                      <MdAddShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsView;
