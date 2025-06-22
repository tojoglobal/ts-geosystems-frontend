import { MdEdit, MdDelete } from "react-icons/md";

export default function TaxList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-5 md:mt-8 mb-3">
      <h3 className="text-xl sm:text-2xl font-semibold mb-3">Tax List</h3>
      <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-800 bg-gray-900/95">
        <table className="min-w-full text-sm text-left bg-gray-900 text-white rounded-xl">
          <thead>
            <tr className="text-left bg-gray-800/80">
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap font-semibold">
                Name
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap font-semibold">
                Value (%)
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap font-semibold">
                Status
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((tax) => (
              <tr key={tax.id} className="hover:bg-gray-800/80 transition">
                <td className="p-2 sm:p-3 border-b border-gray-800 whitespace-nowrap">
                  {tax.name}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-800 whitespace-nowrap">
                  {tax.value}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-800 whitespace-nowrap">
                  {tax.status === 1 ? (
                    <span className="text-green-400 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-800 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(tax)}
                      className="text-blue-400 hover:text-blue-600 p-2 rounded cursor-pointer transition"
                      title="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(tax.id)}
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
                  colSpan="4"
                  className="p-2 sm:p-3 text-center text-gray-400 bg-gray-900"
                >
                  No taxes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
