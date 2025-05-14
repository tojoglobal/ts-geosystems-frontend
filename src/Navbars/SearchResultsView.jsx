/* eslint-disable no-useless-escape */
import { useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
const SearchResultsView = ({ products, onClose, searchText }) => {
  const [sortOrder, setSortOrder] = useState("relevance");

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-y-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">2.5 U R V E Y</h1>
          <button onClick={onClose} className="text-2xl text-gray-600">
            ×
          </button>
        </div>

        <div className="flex">
          {/* Left Sidebar - Filters */}
          <div className="w-1/4 pr-6">
            <h2 className="text-lg font-semibold mb-4">Lektorium für Kosten</h2>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Brand</h3>
              <ul className="space-y-1">
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
              <h3 className="font-semibold mb-2">Category</h3>
              <ul className="space-y-1">
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
              <h3 className="font-semibold mb-2">Condition</h3>
              <ul className="space-y-1">
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
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <span>1:{i < 9 ? `0${i + 1}` : i + 1}</span>
                    <span>0.{i + 1}/1.00</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="w-3/4">
            <div className="flex justify-between items-center mb-6">
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

            <div className="grid grid-cols-5 gap-4">
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
