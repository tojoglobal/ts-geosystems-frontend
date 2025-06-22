import { MdEdit, MdDelete } from "react-icons/md";

export default function ShippingCostList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-5 md:mt-8 mb-3">
      <h3 className="text-xl font-semibold mb-3">Shipping Cost List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border  border-gray-700">
          <thead>
            <tr className="text-left">
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                Name
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                Amount
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                Status
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((cost) => (
              <tr key={cost.id}>
                <td className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                  {cost.name}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                  {cost.amount}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                  {cost.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-700 whitespace-nowrap">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(cost)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded cursor-pointer transition"
                      title="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(cost.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer transition"
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
                  className="p-2 sm:p-3 text-center text-gray-500"
                >
                  No shipping costs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
