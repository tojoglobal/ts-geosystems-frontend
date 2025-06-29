/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import {
  MdAddShoppingCart,
  MdOutlineKeyboardVoice,
  MdRequestQuote,
} from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { useEffect, useState } from "react";
import { useTrackProductView } from "../Hooks/useTrackProductView";
import AddToCartButton from "../Components/AddToCartButton"; // ADD THIS
import { parsePrice } from "../utils/parsePrice"; // ADD THIS
import { formatBDT } from "../utils/formatBDT"; // ADD THIS

const SearchResultsView = ({
  products,
  onClose,
  searchText,
  handleSearchSubmit,
  setSearchText,
  sortOrder,
  setSortOrder,
}) => {
  const { trackProductView } = useTrackProductView();
  const [filters, setFilters] = useState({
    brands: [],
    categories: [],
    conditions: [],
    minPrice: 0,
    maxPrice: 10000,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    brand: null,
    category: null,
    condition: null,
    priceRange: [0, 10000],
  });
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Extract filters from products
  useEffect(() => {
    if (products.length > 0) {
      // Extract unique brands
      const brandsMap = {};
      const categoriesMap = {};
      const conditionsMap = {};
      let minPrice = Infinity;
      let maxPrice = 0;

      products.forEach((product) => {
        // Process brands
        if (product.brand_name) {
          brandsMap[product.brand_name] =
            (brandsMap[product.brand_name] || 0) + 1;
        }

        // Process categories
        try {
          if (product.category) {
            const categoryObj = JSON.parse(product.category);
            if (categoryObj.cat) {
              categoriesMap[categoryObj.cat] =
                (categoriesMap[categoryObj.cat] || 0) + 1;
            }
          }
        } catch (e) {
          console.error("Error parsing category", e);
        }

        // Process conditions
        if (product.product_condition) {
          conditionsMap[product.product_condition] =
            (conditionsMap[product.product_condition] || 0) + 1;
        }

        // Process prices
        const price = parseFloat(product.price) || 0;
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      });

      setFilters({
        brands: Object.entries(brandsMap).map(([name, count]) => ({
          name,
          count,
        })),
        categories: Object.entries(categoriesMap).map(([name, count]) => ({
          name,
          count,
        })),
        conditions: Object.entries(conditionsMap).map(([name, count]) => ({
          name,
          count,
        })),
        minPrice: Math.floor(minPrice),
        maxPrice: Math.ceil(maxPrice),
      });

      // Set initial price range
      setSelectedFilters((prev) => ({
        ...prev,
        priceRange: [Math.floor(minPrice), Math.ceil(maxPrice)],
      }));
    }
  }, [products]);

  // Apply filters when they change
  useEffect(() => {
    let result = [...products];

    // Apply brand filter
    if (selectedFilters.brand) {
      result = result.filter((p) => p.brand_name === selectedFilters.brand);
    }

    // Apply category filter
    if (selectedFilters.category) {
      result = result.filter((p) => {
        try {
          const categoryObj = JSON.parse(p.category);
          return categoryObj.cat === selectedFilters.category;
        } catch (e) {
          return false;
        }
      });
    }

    // Apply condition filter
    if (selectedFilters.condition) {
      result = result.filter(
        (p) => p.product_condition === selectedFilters.condition
      );
    }

    // Apply price range filter
    result = result.filter((p) => {
      const price = parseFloat(p.price) || 0;
      return (
        price >= selectedFilters.priceRange[0] &&
        price <= selectedFilters.priceRange[1]
      );
    });

    setFilteredProducts(result);
  }, [products, selectedFilters]);

  const handleBrandFilter = (brand) => {
    setSelectedFilters((prev) => ({
      ...prev,
      brand: prev.brand === brand ? null : brand,
    }));
  };

  const handleCategoryFilter = (category) => {
    setSelectedFilters((prev) => ({
      ...prev,
      category: prev.category === category ? null : category,
    }));
  };

  const handleConditionFilter = (condition) => {
    setSelectedFilters((prev) => ({
      ...prev,
      condition: prev.condition === condition ? null : condition,
    }));
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    setSelectedFilters((prev) => {
      const newRange = [...prev.priceRange];
      newRange[index] = value;
      return { ...prev, priceRange: newRange };
    });
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  // RESET FILTERS
  const resetBrand = () =>
    setSelectedFilters((prev) => ({ ...prev, brand: null }));
  const resetCategory = () =>
    setSelectedFilters((prev) => ({ ...prev, category: null }));
  const resetCondition = () =>
    setSelectedFilters((prev) => ({ ...prev, condition: null }));

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
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-[20%] bg-white p-6">
            {/* Brand Filter */}
            {filters.brands.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[18px]">Brand</h3>
                  {selectedFilters.brand && (
                    <button
                      className="text-xs px-2 cursor-pointer py-1 bg-gray-200 text-gray-500 rounded hover:text-black"
                      onClick={resetBrand}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <ul className="space-y-1 text-sm">
                  {filters.brands.map((brand, i) => (
                    <li
                      key={i}
                      className={`flex capitalize justify-between items-center cursor-pointer ${
                        selectedFilters.brand === brand.name
                          ? "text-[#e62245]"
                          : "hover:text-[#e62245]"
                      }`}
                      onClick={() => handleBrandFilter(brand.name)}
                    >
                      <span>{brand.name}</span>
                      <span className="text-gray-500">{brand.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Category Filter */}
            {filters.categories.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[18px]">Category</h3>
                  {selectedFilters.category && (
                    <button
                      className="text-xs px-2 cursor-pointer py-1 bg-gray-200 text-gray-500 rounded hover:text-black"
                      onClick={resetCategory}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <ul className="space-y-1 text-sm">
                  {filters.categories.map((category, i) => (
                    <li
                      key={i}
                      className={`flex capitalize justify-between items-center cursor-pointer ${
                        selectedFilters.category === category.name
                          ? "text-[#e62245]"
                          : "hover:text-[#e62245]"
                      }`}
                      onClick={() => handleCategoryFilter(category.name)}
                    >
                      <span>{category.name.replace(/-/g, " ")}</span>
                      <span className="text-gray-500">{category.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Condition Filter */}
            {filters.conditions.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[18px]">Condition</h3>
                  {selectedFilters.condition && (
                    <button
                      className="text-xs cursor-pointer px-2 py-1 bg-gray-200 text-gray-500 rounded hover:text-black"
                      onClick={resetCondition}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <ul className="text-sm">
                  {filters.conditions.map((condition, i) => (
                    <li
                      key={i}
                      className={`flex justify-between items-center cursor-pointer ${
                        selectedFilters.condition === condition.name
                          ? "text-[#e62245]"
                          : "hover:text-[#e62245]"
                      }`}
                      onClick={() => handleConditionFilter(condition.name)}
                    >
                      <span>
                        {condition.name.charAt(0).toUpperCase() +
                          condition.name.slice(1)}
                      </span>
                      <span className="text-gray-500">{condition.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Range Filter */}
            {filteredProducts.length > 1 && (
              <div>
                <h3 className="font-bold text-[18px] mb-4">Price Range</h3>
                <div className="mb-2">
                  <input
                    type="range"
                    className="w-full"
                    min={filters.minPrice}
                    max={filters.maxPrice}
                    value={selectedFilters.priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                  />
                  <input
                    type="range"
                    className="w-full"
                    min={filters.minPrice}
                    max={filters.maxPrice}
                    value={selectedFilters.priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>৳{selectedFilters.priceRange[0]}</span>
                  <span>৳{selectedFilters.priceRange[1]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Products */}
          <div className="w-full md:w-[80%]">
            <div className="flex justify-between mx-5 items-center bg-white py-[6px] px-6">
              <p className="text-sm">
                {filteredProducts.length} results found for "{searchText}"
                {selectedFilters.brand && ` in brand ${selectedFilters.brand}`}
                {selectedFilters.category &&
                  ` in category ${selectedFilters.category.replace(/-/g, " ")}`}
                {selectedFilters.condition &&
                  ` with condition ${selectedFilters.condition}`}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    className="appearance-none cursor-pointer text-sm border rounded px-2 py-1"
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
            <div className="grid grid-cols-4 xl:grid-cols-5 gap-4 p-5">
              {filteredProducts.map((product, index) => {
                // --- ADD CODE SIMILAR TO SearchOverlay ---
                const priceOption = Number(product?.priceShowHide);
                let vat = 0;
                try {
                  vat = product?.tax ? JSON.parse(product.tax).value : 0;
                } catch {
                  vat = 0;
                }
                const basePrice = parsePrice(product.price) || 0;
                const vatAmount = basePrice * (vat / 100);
                const priceIncVat = basePrice + vatAmount;

                return (
                  <div
                    key={index}
                    className="relative flex flex-col bg-white p-4 border border-gray-200 hover:border-gray-300"
                  >
                    {product?.sale === 1 && (
                      <div className="absolute top-2 right-2 bg-[#e62245] text-white px-2 py-[1px] font-semibold rounded-sm text-sm">
                        SALE
                      </div>
                    )}
                    <Link
                      onClick={() => {
                        trackProductView(product.id);
                        onClose();
                      }}
                      to={`/products/${product.id}/${slugify(
                        product.product_name || ""
                      )}`}
                      className="w-full"
                    >
                      <img
                        src={
                          product?.image_urls
                            ? `${import.meta.env.VITE_OPEN_APIURL}${JSON.parse(
                                product?.image_urls
                              )[0]?.replace(/^["\[]+|["\]]+$/g, "")}`
                            : product?.image
                        }
                        alt={product?.product_name || product.name}
                        className="w-full h-32 object-contain mb-2"
                      />
                      <div className="text-xs font-medium mb-1 hover:text-[#e62245] cursor-pointer">
                        {product.product_name || product.name}
                      </div>
                    </Link>
                    <div className="flex justify-between items-center mt-auto">
                      <p className="font-semibold text-xs">
                        {priceOption === 1 ? "" : formatBDT(priceIncVat)}
                      </p>
                      {product?.isStock === 1 && priceOption === 1 && (
                        <Link
                          to={`/products/${product.id}/${slugify(
                            product.product_name || ""
                          )}`}
                          title="Get Quotation"
                          className="ml-auto p-[4px] rounded bg-[#e62245] hover:bg-[#d41d3f] text-white transition min-w-0 flex items-center"
                          style={{ fontSize: "11px", fontWeight: 500 }}
                        >
                          <MdRequestQuote size={15} className="mr-1" />
                          QUOTE
                        </Link>
                      )}
                      {product?.isStock === 1 && priceOption !== 1 && (
                        <span className="ml-auto flex items-center">
                          <AddToCartButton
                            product={product}
                            quantity={1}
                            selectedOptions={[]}
                            variant="icon"
                          >
                            <MdAddShoppingCart size={16} />
                          </AddToCartButton>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsView;
