export default function TaxList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-5 md:mt-8 mb-3">
      <h3 className="text-xl font-semibold mb-3">Tax List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border  border-gray-600">
          <thead>
            <tr className="text-left">
              <th className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                Name
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                Value (%)
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                Status
              </th>
              <th className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((tax) => (
              <tr key={tax.id}>
                <td className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                  {tax.name}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                  {tax.value}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                  {tax.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="p-2 sm:p-3 border-b border-gray-600 whitespace-nowrap">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(tax)}
                      className="text-blue-600 cursor-pointer hover:underline min-w-[40px] py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tax.id)}
                      className="text-red-600 cursor-pointer hover:underline min-w-[40px] py-1"
                    >
                      Delete
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
