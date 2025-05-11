export default function AuthorList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 px-2">Tax List</h3>
      <div className="min-w-full overflow-hidden">
        <table className="min-w-full text-xs md:text-sm text-left border border-gray-600 mt-4 md:mt-6">
          <thead>
            <tr className="text-left">
              <th className="p-2 md:p-3 border-b border-gray-600">Name</th>
              <th className="p-2 md:p-3 border-b border-gray-600">Value (%)</th>
              <th className="p-2 md:p-3 border-b border-gray-600">Status</th>
              <th className="p-2 md:p-3 border-b border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tax) => (
              <tr key={tax.id}>
                <td className="p-2 md:p-3 border-b border-gray-600">{tax.name}</td>
                <td className="p-2 md:p-3 border-b border-gray-600">{tax.value}</td>
                <td className="p-2 md:p-3 border-b border-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs ${tax.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tax.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-2 md:p-3 border-b border-gray-600">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <button
                      onClick={() => onEdit(tax)}
                      className="text-blue-600 hover:underline text-xs md:text-sm px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(tax.id)}
                      className="text-red-600 hover:underline text-xs md:text-sm px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="4" className="p-2 md:p-3 text-center text-gray-500 text-xs md:text-sm">
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
