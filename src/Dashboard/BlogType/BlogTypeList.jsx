export default function BlogTypeList({ data, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Blog Type List</h3>
      <table className="min-w-full text-sm text-left border border-gray-600 mt-6">
        <thead>
          <tr className="text-left">
            <th className="p-3 border-b border-gray-600">Name</th>
            <th className="p-3 border-b border-gray-600">Status</th>
            <th className="p-3 border-b border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((type) => (
              <tr key={type.id}>
                <td className="p-3 border-b border-gray-600">{type.name}</td>
                <td className="p-3 border-b border-gray-600">
                  {type.status === 1 ? "Active" : "Inactive"}
                </td>
                <td className="p-3 border-b border-gray-600 space-x-2">
                  <button
                    onClick={() => onEdit(type)}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(type.id)}
                    className="text-red-600 cursor-pointer hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">
                No blog types found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
