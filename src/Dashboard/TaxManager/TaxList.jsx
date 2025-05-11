export default function TaxList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Tax List</h3>
      <table className="min-w-full text-sm text-left border border-gray-600 mt-6">
        <thead>
          <tr className="text-left">
            <th className="p-3 border-b border-gray-600">Name</th>
            <th className="p-3 border-b border-gray-600">Value (%)</th>
            <th className="p-3 border-b border-gray-600">Status</th>
            <th className="p-3 border-b border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tax) => (
            <tr key={tax.id}>
              <td className="p-3 border-b border-gray-600">{tax.name}</td>
              <td className="p-3 border-b border-gray-600">{tax.value}</td>
              <td className="p-3 border-b border-gray-600">
                {tax.status === 1 ? "Active" : "Inactive"}
              </td>
              <td className="p-3 border-b border-gray-600 space-x-2">
                <button
                  onClick={() => onEdit(tax)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(tax.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                No taxes found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
