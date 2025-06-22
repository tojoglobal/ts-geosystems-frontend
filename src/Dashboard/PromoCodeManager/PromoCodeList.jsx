import { MdEdit, MdDelete } from "react-icons/md";

export default function PromoCodeList({ data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto mb-2 rounded-xl shadow-xl border border-gray-800 bg-gray-900/95 mt-6">
      <table className="min-w-full text-sm text-left rounded-xl">
        <thead>
          <tr className="bg-gray-800/80">
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap font-semibold border-b border-gray-700">
              Title
            </th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap font-semibold border-b border-gray-700">
              Code
            </th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap font-semibold border-b border-gray-700">
              Times
            </th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap font-semibold border-b border-gray-700">
              Discount
            </th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap font-semibold border-b border-gray-700">
              Type
            </th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap font-semibold border-b border-gray-700">
              Status
            </th>
            <th className="px-2 sm:px-4 py-2 whitespace-nowrap font-semibold border-b border-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((promo) => (
            <tr
              key={promo.id}
              className="border-t border-gray-800 hover:bg-gray-800/70 transition"
            >
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.title}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.code_name}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.no_of_times}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.discount}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.type}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                {promo.status ? (
                  <span className="text-green-400 font-semibold">Active</span>
                ) : (
                  <span className="text-gray-400">Inactive</span>
                )}
              </td>
              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(promo)}
                    className="text-blue-400 hover:text-blue-600 p-2 rounded cursor-pointer transition"
                    title="Edit"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(promo.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded cursor-pointer transition"
                    title="Delete"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan="7"
                className="px-2 sm:px-4 py-2 text-center text-gray-400 bg-gray-900"
              >
                No promo codes found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
