import React from "react";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash } from "lucide-react";

const PremiumProductTable = ({
  products,
  productsLoading,
  getCategoryName,
  getSubCategoryName,
  getBrandName,
  handleDelete,
  handleView,
}) => {
  return (
    <div className="overflow-x-auto rounded-3xl border-2 border-[#0ea5e9] bg-gradient-to-b from-[#181c2a] via-[#22223b] to-[#151825] shadow-2xl">
      <table className="w-full min-w-[900px] text-sm text-left text-white font-medium">
        <thead>
          <tr className="uppercase text-xs tracking-wider bg-gradient-to-r from-[#232946] to-[#22223b] text-[#bae6fd] border-b border-[#0ea5e9]">
            <th className="px-3 md:px-4 py-3">Product Name</th>
            <th className="px-3 md:px-4 py-3">
              Price <span className="font-bold">৳</span>
            </th>
            <th className="px-3 md:px-4 py-3">Category</th>
            <th className="px-3 md:px-4 py-3">Sub Category</th>
            <th className="px-3 md:px-4 py-3">SKU</th>
            <th className="px-3 md:px-4 py-3">Condition</th>
            <th className="px-3 md:px-4 py-3">Brand</th>
            <th className="px-3 md:px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsLoading ? (
            <tr>
              <td colSpan={8} className="bg-[#22223b] text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0ea5e9] mx-auto"></div>
              </td>
            </tr>
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[#232946] hover:bg-[#1e293b]/50 transition"
              >
                <td className="py-4 px-4 sm:px-6 font-semibold text-[#bae6fd]">
                  {product.product_name}
                </td>
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] text-white px-3 py-1 rounded-lg shadow font-bold">
                    ৳ {product.price}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <span className="bg-[#0ea5e9]/15 text-[#0ea5e9] px-2 py-0.5 rounded font-semibold">
                    {getCategoryName(product.category)}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <span className="bg-[#22d3ee]/15 text-[#22d3ee] px-2 py-0.5 rounded font-semibold">
                    {getSubCategoryName(product.sub_category)}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6 text-[#facc15] font-mono">
                  {product.sku}
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <span className="bg-[#38bdf8]/10 text-[#38bdf8] px-2 py-0.5 rounded">
                    {product.product_condition}
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6 font-bold text-[#e0f2fe]">
                  {getBrandName(product.brand_name)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Link to={`/dashboard/update-product/${product.id}`}>
                      <button className="bg-gradient-to-r from-green-600 to-green-400 text-white p-2 rounded-full shadow hover:scale-110 duration-150">
                        <Edit size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-gradient-to-r from-rose-700 to-pink-500 text-white p-2 rounded-full shadow hover:scale-110 duration-150"
                    >
                      <Trash size={16} />
                    </button>
                    <button
                      onClick={() => handleView(product)}
                      title="View"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-2 rounded-full shadow hover:scale-110 duration-150"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="bg-[#181c2a] text-center p-8 text-white font-semibold"
              >
                No Product found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Responsive card view for small screens */}
      <div className="md:hidden flex flex-col gap-4 p-4">
        {productsLoading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0ea5e9] mx-auto"></div>
          </div>
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-[#0ea5e9] bg-gradient-to-r from-[#232946] to-[#22223b] shadow-md p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg text-[#bae6fd]">
                  {product.product_name}
                </div>
                <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] text-white px-3 py-1 rounded-lg shadow font-bold">
                  ৳ {product.price}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap text-xs mt-2">
                <span className="bg-[#0ea5e9]/15 text-[#0ea5e9] px-2 py-0.5 rounded font-semibold">
                  {getCategoryName(product.category)}
                </span>
                <span className="bg-[#22d3ee]/15 text-[#22d3ee] px-2 py-0.5 rounded font-semibold">
                  {getSubCategoryName(product.sub_category)}
                </span>
                <span className="bg-[#38bdf8]/10 text-[#38bdf8] px-2 py-0.5 rounded">
                  {product.product_condition}
                </span>
                <span className="font-mono text-[#facc15] px-2">
                  {product.sku}
                </span>
                <span className="font-bold text-[#e0f2fe] px-2">
                  {getBrandName(product.brand_name)}
                </span>
              </div>
              <div className="flex justify-center gap-3 mt-3">
                <Link to={`/dashboard/update-product/${product.id}`}>
                  <button className="bg-gradient-to-r from-green-600 to-green-400 text-white p-2 rounded-full shadow hover:scale-110 duration-150">
                    <Edit size={16} />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-gradient-to-r from-rose-700 to-pink-500 text-white p-2 rounded-full shadow hover:scale-110 duration-150"
                >
                  <Trash size={16} />
                </button>
                <button
                  onClick={() => handleView(product)}
                  title="View"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-2 rounded-full shadow hover:scale-110 duration-150"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#181c2a] text-center p-8 text-white font-semibold rounded-xl">
            No Product found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumProductTable;
