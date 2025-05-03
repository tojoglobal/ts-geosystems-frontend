export default function TaxList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Tax List</h3>
      <table className="min-w-full text-sm text-left border mt-6">
        <thead className="bg-gray-200">
          <tr className="text-gray-800 text-left">
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Value (%)</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tax) => (
            <tr key={tax.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{tax.name}</td>
              <td className="p-3 border-b">{tax.value}</td>
              <td className="p-3 border-b">
                {tax.status === 1 ? "Active" : "Inactive"}
              </td>
              <td className="p-3 border-b space-x-2">
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
